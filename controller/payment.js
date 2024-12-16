const Payment = require('../model/payment');
const User = require("../model/usermodel");
const Subscribe = require('../model/suscribe');
const axios = require("axios");
var request = require('request');
const Flutterwave = require('flutterwave-node-v3');
const { method } = require('lodash');
const { json } = require('body-parser');
const Upgrade = require('../model/upgrades');
require("dotenv").config()

//const flw = new Flutterwave(process.env.PUBLIC_KEY, process.env.SECRETE_KEY);

//subscription package point or PV 
const packagePoints = {
  '2500': 10,
  '5000': 20,
  '10000': 40,
  '25000': 100,
  '50000': 200,
  '100000': 400,
  '500000': 2000
};

//  referral percentage structure for commission calculation
const referralPercentages = {
  1: {
    '2500': 0.20,
    '5000': 0.20,
    '10000': 0.20,
    '25000': 0.20,
    '100000': 0.20,
    '500000': 0.20
  },
  2: {
    '2500': 0.05,
    '5000': 0.05,
    '10000': 0.05,
    '25000': 0.05,
    '100000': 0.05,
    '500000': 0.05
  },
  3: {
    '2500': 0.03,
    '5000': 0.03,
    '10000': 0.03,
    '25000': 0.03,
    '100000': 0.03,
    '500000': 0.03
  },
  4: {
    '2500': 0.02,
    '5000': 0.02,
    '10000': 0.02,
    '25000': 0.02,
    '100000': 0.02,
    '500000': 0.02
  },
  5: {
    '2500': 0.02,
    '5000': 0.02,
    '10000': 0.02,
    '25000': 0.02,
    '100000': 0.02,
    '500000': 0.02
  },
  6: {
    '2500': 0.01,
    '5000': 0.01,
    '10000': 0.01,
    '25000': 0.01,
    '100000': 0.01,
    '500000': 0.01
  },
  7: {
    '2500': 0.01,
    '5000': 0.01,
    '10000': 0.01,
    '25000': 0.01,
    '100000': 0.01,
    '500000': 0.01
  },
  8: {
    '2500': 0.01,
    '5000': 0.01,
    '10000': 0.01,
    '25000': 0.01,
    '100000': 0.01,
    '500000': 0.01
  },
  9: {
    '2500': 0.01,
    '5000': 0.01,
    '10000': 0.01,
    '25000': 0.01,
    '100000': 0.01,
    '500000': 0.01
  },
  10: {
    '2500': 0.01,
    '5000': 0.01,
    '10000': 0.01,
    '25000': 0.01,
    '100000': 0.01,
    '500000': 0.01
  }
};

const upgradeDisribution = async (userId, packageAmount) => {
  const amount = parseFloat(packageAmount);
  const pointsToAdd = packagePoints[packageAmount] || 0;

  const tierLimits = {
    2500: 2,
    5000: 3,
  };

  const referralPercentages = {
    1: { 2500: 0.20, 5000: 0.20 },
    2: { 2500: 0.05, 5000: 0.05 },
  };

  const user = await User.findById(userId).populate('referredBy');

  if (!user) {
    console.error(`User with ID ${userId} not found.`);
    return;
  }

  const subscription = await Upgrade.findOne({ user: userId });

  if (!subscription) {
    console.error(`Subscription for user ID ${userId} not found.`);
    return;
  }

  const userPackagePoints = subscription.subscription;
  const maxTiers = tierLimits[userPackagePoints] || 1;

  console.log(`User ${userId} with package ${userPackagePoints} has a tier limit of ${maxTiers}.`);

  const distribute = async (currentUser, currentTier, remainingTiers) => {
    if (!currentUser || currentTier > maxTiers || remainingTiers <= 0) {
      console.log(`Tier ${currentTier} exceeds the maximum allowed tiers or no remaining tiers. Stopping distribution.`);
      return;
    }

    // Calculate commission for the current tier
    const percentage = referralPercentages[currentTier]?.[packageAmount] || 0;
    const commission = amount * percentage;

    // Check if currentUser is the original user; if yes, skip commission
    if (currentUser._id.toString() !== userId) {
      try {
        // Update the current user's commission and points
        await User.updateOne(
          { _id: currentUser._id },
          {
            $inc: { commissions: commission },
            $push: { points: { packageAmount: amount, points: pointsToAdd } }
          }
        );

        console.log(`Updated commissions and points for user ${currentUser._id} at tier ${currentTier}`);

        // Distribute commission and points to the referrer
        if (currentUser.referredBy) {
          const referrer = await User.findById(currentUser.referredBy._id).populate('referredBy');

          if (referrer) {
            if (referrer.referralTier < currentTier) {
              console.log(`Updating referralTier for user ${referrer._id} to ${currentTier}`);
              await User.updateOne(
                { _id: referrer._id },
                { $set: { referralTier: currentTier } }
              );
            }

            await distribute(referrer, currentTier + 1, remainingTiers - 1);
          } else {
            console.error(`Referrer with ID ${currentUser.referredBy._id} not found.`);
          }
        } else {
          console.log(`No referrer for user ${currentUser._id}.`);
        }
      } catch (error) {
        console.error(`Error distributing commissions for user ${currentUser._id}:`, error);
      }
    } else {
      console.log(`Skipping commission for user ${currentUser._id} during their own upgrade.`);
      try {
       
        
        // Distribute commission and points to the referrer
        if (currentUser.referredBy) {
          const referrer = await User.findById(currentUser.referredBy._id).populate('referredBy');
  
          if (referrer) {
            // Update the referrer's tier if needed
            if (referrer.referralTier < currentTier) {
              console.log(`Updating referralTier for user ${referrer._id} to ${currentTier}`);
              await User.updateOne(
                { _id: referrer._id },
                { $set: { referralTier: currentTier } }
              );
            }
  
            // Distribute commission and points to the referrer
            await distribute(referrer, currentTier + 1, remainingTiers - 1); // Increment tier level and decrease remaining tiers
          } else {
            console.error(`Referrer with ID ${currentUser.referredBy._id} not found.`);
          }
        } else {
          console.log(`No referrer for user ${currentUser._id}.`);
        }
      } catch (error) {
        console.error(`Error distributing commissions for user ${currentUser._id}:`, error);
      }
     
    }
  };

  await distribute(user, 1, maxTiers);
};


const distributeCommissions = async (userId, packageAmount) => {
  const amount = parseFloat(packageAmount);
  const pointsToAdd = packagePoints[packageAmount] || 0;

  // Define the maximum number of tiers based on package points
  const tierLimits = {
    2500: 2, // Max 2 tiers for 2500 points
    5000: 3, // Max 3 tiers for 5000 points
    // Add other package points and their tier limits if needed
  };

  // Define referral percentages
  const referralPercentages = {
    1: { 2500: 0.20, 5000: 0.20 }, // 20% for the first tier
    2: { 2500: 0.05, 5000: 0.05 }, // 5% for the second tier
    // Add other tiers and percentages if needed
  };

  // Find the user who made the payment
  const user = await User.findById(userId).populate('referredBy');

  if (!user) {
    console.error(`User with ID ${userId} not found.`);
    return;
  }

  // Find the subscription of the user to get the package details
  const subscription = await Subscribe.findOne({ user: userId });

  if (!subscription) {
    console.error(`Subscription for user ID ${userId} not found.`);
    return;
  }

  // Determine the user's package points and tier limit
  const userPackagePoints = subscription.subscription;
  const maxTiers = tierLimits[userPackagePoints] || 1; // Default to 1 tier if no limit is specified

  console.log(`User ${userId} with package ${userPackagePoints} has a tier limit of ${maxTiers}.`);

  // Helper function to distribute commissions
  const distribute = async (currentUser, currentTier, remainingTiers) => {
    if (!currentUser || currentTier > maxTiers || remainingTiers <= 0) {
      console.log(`Tier ${currentTier} exceeds the maximum allowed tiers or no remaining tiers. Stopping distribution.`);
      return; // Stop recursion if the tier exceeds the allowed limit or no remaining tiers
    }

    // Calculate commission for the current tier
    const percentage = referralPercentages[currentTier]?.[packageAmount] || 0;
    const commission = amount * percentage;

    try {
      // Update the current user's commission and points
      await User.updateOne(
        { _id: currentUser._id },
        { 
          $inc: { commissions: commission }, 
          $push: { points: { packageAmount: amount, points: pointsToAdd } } 
        }
      );

      // Log successful update
      console.log(`Updated commissions and points for user ${currentUser._id} at tier ${currentTier}`);

      // Distribute commission and points to the referrer
      if (currentUser.referredBy) {
        const referrer = await User.findById(currentUser.referredBy._id).populate('referredBy');

        if (referrer) {
          // Update the referrer's tier if needed
          if (referrer.referralTier < currentTier) {
            console.log(`Updating referralTier for user ${referrer._id} to ${currentTier}`);
            await User.updateOne(
              { _id: referrer._id },
              { $set: { referralTier: currentTier } }
            );
          }

          // Distribute commission and points to the referrer
          await distribute(referrer, currentTier + 1, remainingTiers - 1); // Increment tier level and decrease remaining tiers
        } else {
          console.error(`Referrer with ID ${currentUser.referredBy._id} not found.`);
        }
      } else {
        console.log(`No referrer for user ${currentUser._id}.`);
      }
    } catch (error) {
      console.error(`Error distributing commissions for user ${currentUser._id}:`, error);
    }
  };

  await distribute(user, 1, maxTiers); // Start with Tier 1 for the direct referrer
};

const verifyReferralPayment = async (req, res) => {
  const { tx_ref, userId, transaction_id } = req.query;
 

  if (!tx_ref || !userId || !transaction_id) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }




  try {
    // Fetch the payment record from the database
    const payment = await Subscribe.findOne({ tx_ref: tx_ref });
    if (!payment) {
      return res.status(400).json({ success: false, message: 'Payment record not found' });
    }

    const expectedAmount = payment.amount; // Retrieve the expected amount from the payment record
    console.log(expectedAmount)
    const points = packagePoints[expectedAmount] || 0;

    // Verify the transaction using Flutterwave
    //const response = await flw.Transaction.verify({ id: transaction_id });
    //console.log(response)
    const response = null;



    if (response.data.status === 'successful' &&
        response.data.amount === expectedAmount &&
        response.data.currency === 'NGN') {

      // Payment was successful, update the payment status


      // Optionally, update other related records or perform additional actions

      //res.redirect(`http://localhost:3500/api/auth/dashboard/${userId}`);
      res.render('paymentsuccess', {userId})
    } else {
      // Payment failed or does not match the expected parameters
      await Subscribe.updateOne({ tx_ref: tx_ref }, { status: 'failed' });
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};

const subscriptionFeeReferral = async (req, res) => {
  const { email, name, package, userId, referralToken } = req.body;

  if (!email || !name || !package || !userId || !referralToken) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
  }


  const points = packagePoints[package] || 0;

  // First validate the referral token
  let referrer;
  try {
      referrer = await User.findOne({
          referralToken: referralToken
          // Remove the expiration check if tokens do not expire
      }).populate('referredBy');
      
      if (!referrer) {
          return res.status(400).json({ success: false, message: 'Invalid or expired referral token.' });
      }

      // Create a new payment record
      const paymentData = {
        public_key: process.env.PUBLIC_KEY,
        email: email,
        name: name,
        subscription: package,
        currency: 'NGN',
        source: 'docs-html-test',
        user: userId,
        amount: package
      };

      const response = await axios.post('https://api.paystack.co/transaction/initialize', {

        amount: package * 100,
        currency: 'NGN',
        callback_url: `http://localhost:3500/api/payment/verify-payment?userId=${userId}`,
      
        email: email,
        name: name,
       
     
      }, {
        headers: {
          Authorization: `Bearer sk_test_0ef643074c6e99bb5e115e092a4bb495a5b63005`,
          'Content-Type': 'application/json'
        },
      
      });

      if (response.data.status === true) {
        const paymentLink = response.data.data.authorization_url; // This link is where you should redirect the user to
        
        const tx_ref = response.data.data.reference; // Use the Paystack reference as tx_ref

        // Update paymentData to include the tx_ref from Paystack
        paymentData.tx_ref = tx_ref;
        
        const payment = new Subscribe(paymentData);
        await payment.save();
        res.redirect(paymentLink); // Redirect user to the payment page
        // const paymentLink = response.data.data.link; // This link is where you should redirect the user to
        // await Subscribe.updateOne({ status: 'success' });
        // res.redirect(paymentLink); // Redirect user to the payment page
      } else {
        // Handle unsuccessful response
        await Subscribe.updateOne({ status: 'failed' });
  
        res.status(400).json({ success: false, message: 'Payment initialization failed' });
      }

      // Call function to distribute commissions based on the referrer
      await distributeCommissions(referrer._id, package);

  } catch (error) {
      console.error('Error preparing payment redirect:', error);
      
      // Handle errors only if the redirect has not been sent yet
      if (!res.headersSent) {
          res.status(500).json({ success: false, message: error.message });
      }
  }
};



const subscriptionFee = async (req, res) => {
  const { email, name, package, userId } = req.body;
  const points = packagePoints[package] || 0;

  const paymentData = {
    public_key: process.env.PUBLIC_KEY,
    email: email,
    name: name,
    subscription: package,
    currency: 'NGN',
    source: 'docs-html-test',
    user: userId,
    amount: package 
  };

  try {
    // Make the API request to Paystack
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      amount: package * 100,
      currency: 'NGN',
      callback_url: `http://localhost:3500/api/payment/verify-payment?userId=${userId}`,
      email: email,
      name: name,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRETE_LIVE}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status) {
      const paymentLink = response.data.data.authorization_url; // This link is where you should redirect the user to
      const tx_ref = response.data.data.reference; // Use the Paystack reference as tx_ref

      // Update paymentData to include the tx_ref from Paystack
      paymentData.tx_ref = tx_ref;

      // Save the payment data to your database
      const payment = new Subscribe(paymentData);
      await payment.save();
      
      res.redirect(paymentLink); // Redirect user to the payment page
    } else {
      res.status(400).json({ success: false, message: 'Payment initialization failed' });
    }
  } catch (error) {
    console.error('Error preparing payment redirect:', error);
    res.status(500).json({ success: false, message: 'Failed to prepare payment redirect' });
  }
};


const verifyPayment = async (req, res) => {
  const { trxref, reference, userId } = req.query;

  if (!trxref || !reference || !userId) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    const payment = await Subscribe.findOne({ user: userId });

    if (!payment) {
      return res.status(400).json({ success: false, message: 'Payment record not found' });
    }

    const expectedAmount = payment.amount; // Retrieve the expected amount from the payment record
    const points = packagePoints[expectedAmount] || 0;

    console.log('Payment record:', payment);
console.log('Expected amount:', expectedAmount);
console.log('Points awarded:', points);
console.log('txrf:', trxref);
console.log('reference:', reference);


    // Update payment status and points
    await Subscribe.findOneAndUpdate({ tx_ref: trxref }, { status: 'success', points: points });

    res.redirect(`http://localhost:3500/api/auth/dashboard/${userId}`);
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};




const getAllBanks = (req, res) => {
  // Define the options for the request
  const options = {
    method: 'GET',
    url: 'https://api.paystack.co/bank', // Replace 'NG' with a dynamic country code if needed
    headers: {
      'Authorization': `Bearer sk_test_0ef643074c6e99bb5e115e092a4bb495a5b63005` // Replace with your actual secret key
    }
  };

  // Make the request
  request(options, (error, response) => {
    if (error) {
      // Handle request errors
      console.error('Error making request:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
    }

    // Check if the response status is successful
    if (response.statusCode === 200) {
      // Send the response body back to the client
      res.status(200).json(JSON.parse(response.body));
    } else {
      // Handle non-successful status codes
      console.error('Unexpected status code:', response.statusCode);
      res.status(response.statusCode).json({ message: 'Error fetching data', body: response.body });
    }
  });
};

const billPayment = (req, res)=>{
    // Define the options for the request
  const options = {
    method: 'GET',
    url: 'https://api.flutterwave.com/v3/bills/AIRTIME/billers?country=NG', // Replace 'NG' with a dynamic country code if needed
    headers: {
      'Authorization': `Bearer ${process.env.SECRETE_KEY}`    }
  };

  // Make the request
  request(options, (error, response) => {
    if (error) {
      // Handle request errors
      console.error('Error making request:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
    // Log the response for debugging
    console.log('Response body:', response.body);
    console.log('Response status code:', response.statusCode);
    // Check if the response status is successful
    if (response.statusCode === 200) {
      // Send the response body back to the client
      res.status(200).json(JSON.parse(response.body));
    } else {
      // Handle non-successful status codes
      console.error('Unexpected status code:', response.statusCode);
      res.status(response.statusCode).json({ message: 'Error fetching data', body: response.body });
    }
  });
}

// Handle webhook notifications
const handleWebhook = async (req, res) => {
  const { tx_ref, status } = req.body;

  try {
    // Find the payment record by tx_ref
    const payment = await Subscribe.findOne({ tx_ref });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // Update the payment status based on webhook response
    if (status === 'successful') {
      payment.status = 'success';
      // Additional logic (e.g., update points) can go here
    } else {
      payment.status = 'failed';
    }

    await payment.save();

    res.status(200).json({ success: true, message: 'Payment status updated' });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ success: false, message: 'Failed to handle webhook' });
  }
};


const handlePaymentCallback = async (req, res) => {
  const { tx_ref } = req.query;

  try {
    // Find the payment record by tx_ref
    const payment = await Subscribe.findOne({ tx_ref });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // Render a response to the user, e.g., a confirmation page
    res.send('Payment status is being processed. Check your email for details.');
  } catch (error) {
    console.error('Error handling payment callback:', error);
    res.status(500).json({ success: false, message: 'Failed to handle payment callback' });
  }
};

const withdraw = async (req, res) => {
  const { userId, amount, bank_code, account_number, account_name } = req.body;
  console.log(bank_code, userId, amount, account_name, account_number);
  if (!userId || !amount  || !bank_code || !account_number || !account_name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the withdrawal amount is within the user's commission
    if (amount > user.commissions) {
      return res.status(400).json({ message: 'Insufficient commission' });
    }



  const payload = {
      
        "bank_code": `${bank_code}`,
        "country_code": "NG",
        "account_number": `${account_number}`,
        "account_name": `${account_name}`,
        "account_type": "personal",
        "document_type": "identityNumber",
        "document_number": "76147241785"

    }

    // const response = await flw.Transfer.initiate(payload)
    const response = await axios.post('https://api.paystack.co/bank/validate', payload, {
      headers: {
              Authorization: `Bearer sk_test_0ef643074c6e99bb5e115e092a4bb495a5b63005`,
              'Content-Type': 'application/json'
            }
    })

    console.log(response);
} catch (error) {
    console.log(error)
    res.status(400).json({status: "failed", message: "verification failed"})

}


  

};



const submitPayment = async (req, res) => {
  const { email, name, amount, userId } = req.body;
  console.log(email, name, amount, userId)

  // Generate a unique transaction reference
  const timestamp = Date.now(); // Current timestamp in milliseconds
  const randomValue = Math.floor(Math.random() * 1000000); // Random number up to 1,000,000
  const tx_ref = `tx_${timestamp}_${randomValue}`; // Combine timestamp and random value

  // Payment data
  const paymentData = {
    public_key: process.env.PUBLIC_KEY,
    email: email,
    name: name,
    tx_ref: tx_ref,
    amount: amount,
    currency: 'NGN',
    source: 'docs-html-test',
    status: 'pending', // Default status
    user: userId
  };

  try {
    // Save the payment record to the database
    const payment = new Payment(paymentData);
    await payment.save();
    await User.findByIdAndUpdate(userId, {
               $push: { payments: payment._id }
         });
      

    // Make the API request to Flutterwave
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      tx_ref: tx_ref,
      amount: amount,
      currency: 'NGN',
      callback_url: `http://localhost:3500/api/auth/dashboard/${userId}`,   
        email: email,
        name:name,
        phonenumber: '09012345678'
      
     
   
    }, {
      headers: {
        Authorization: `Bearer sk_test_0ef643074c6e99bb5e115e092a4bb495a5b63005`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status === true) {
      const paymentLink = response.data.data.link; // This link is where you should redirect the user to
      await Payment.updateOne({ status: 'success' });
      res.redirect(paymentLink); // Redirect user to the payment page
    } else {
      // Handle unsuccessful response
      await Payment.updateOne({ status: 'failed' });

      res.status(400).json({ success: false, message: 'Payment initialization failed' });
    }
  } catch (err) {
    console.error('Error processing payment:', err.response ? err.response.data : err.message);
    // Update payment status to failed
    await Payment.updateOne({ tx_ref: tx_ref }, { status: 'failed' });
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const buyAirtime = async(req, res)=>{
  const {phonenumber, amount} = req.body;
    // Validate input
    if (!phonenumber || !amount) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }


  const payload = {
    country: 'NG',
    customer_id: phonenumber,
    amount,
    reference: `ref-${Date.now()}`,  // Generate a unique reference
    callback_url: 'https://your-callback-url.com'
};

  try {
    const response = await axios.post('https://api.flutterwave.com/v3/billers/AIRTIME/items/BIL100/payment', payload,
      {
        headers:{
          Authorization: `Bearer ${process.env.SECRETE_KEY}`,
          'Content-Type': 'application/json'
        } 
      }
  
  );
  // Send response to client
  res.json(response.data);
  console.log(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ status: 'error', message: error.response?.data?.message || 'An error occurred' });

  }


}


const verifyUpgradePayment = async (req, res) => {
  const { tx_ref, userId, reference } = req.query;
 

  if (!tx_ref || !userId || !reference) {
    //return res.status(400).json({ success: false, message: 'Missing required parameters' });
    return  res.render('paymentunsuccess', {userId})

  }




  try {
    // Fetch the payment record from the database
    const payment = await Upgrade.findOne({ tx_ref: tx_ref });
    if (!payment) {
      return res.status(400).json({ success: false, message: 'Payment record not found' });
    }

    const expectedAmount = payment.amount; // Retrieve the expected amount from the payment record
    console.log(expectedAmount)
    const points = packagePoints[expectedAmount] || 0;

    // Verify the transaction using Flutterwave
    //const response = await flw.Transaction.verify({ id: transaction_id });
    //console.log(response)



    if (response.data.status === 'successful' &&
        response.data.amount === expectedAmount &&
        response.data.currency === 'NGN') {

      // Payment was successful, update the payment status
      await Upgrade.updateOne({ tx_ref: tx_ref }, { status: 'success' });
      await Upgrade.updateOne({ points: points})
      await upgradeDisribution(userId, expectedAmount);
      // Optionally, update other related records or perform additional actions

      //res.redirect(`http://localhost:3500/api/auth/dashboard/${userId}`);
      res.render('paymentsuccess', {userId})
    } else {
      // Payment failed or does not match the expected parameters
      await Upgrade.updateOne({ tx_ref: tx_ref }, { status: 'failed' });
      //res.status(400).json({ success: false, message: 'Payment verification failed' });
      res.render('paymentunsuccess', {userId})

    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};

const upgradePackage = async (req, res) => {

  const { email, name, package, userId} = req.body;
  console.log("Upgrade package request received", req.body);
  const timestamp = Date.now(); // Current timestamp in milliseconds
  const randomValue = Math.floor(Math.random() * 1000000); // Random number up to 1,000,000
  const tx_ref = `tx_${timestamp}_${randomValue}`; // Combine timestamp and random value

  const points = packagePoints[package] || 0;


  const paymentData = {
      public_key: process.env.PUBLIC_KEY,
      email: email,
      amount: package,
      name: name,
      tx_ref: tx_ref,
      subscription: package,
      currency: 'NGN',
      source: 'docs-html-test',
      user:userId
  };



  try {


       // Make the API request to Flutterwave
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      tx_ref: tx_ref,
      amount: package,
      currency: 'NGN',
      callback_url: ``,
      email: email,
      name: name,
      
     
   
    }, {
      headers: {
        Authorization: `Bearer sk_test_0ef643074c6e99bb5e115e092a4bb495a5b63005`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status === true) {
      const paymentLink = response.data.data.link; // This link is where you should redirect the user to
      // Create a new payment record
      const payment = new Upgrade(paymentData);
      await payment.save();

      //distribute commission for upgrade...
      //distributeCommissions(userId, package)
      res.redirect(paymentLink); // Redirect user to the payment page
    } else {
      // Handle unsuccessful response
      await Subscribe.updateOne({ status: 'failed' });

      res.status(400).json({ success: false, message: 'Payment initialization failed' });
    }


 

  } catch (error) {
      console.error('Error preparing payment redirect:', error);
      res.status(500).json({ success: false, message: 'Failed to prepare payment redirect' });
  }
};

const verifyMonthlyPackage = async (req, res) => {
  const { tx_ref, userId, transaction_id } = req.query;
 

  if (!tx_ref || !userId || !transaction_id) {
    //return res.status(400).json({ success: false, message: 'Missing required parameters' });
    res.render('paymentunsuccess', {userId})

  }




  try {
    // Fetch the payment record from the database
    const payment = await Subscribe.findOne({ tx_ref: tx_ref });
    if (!payment) {
      return res.status(400).json({ success: false, message: 'Payment record not found' });
    }

    const expectedAmount = payment.amount; // Retrieve the expected amount from the payment record
    console.log(expectedAmount)
    const points = packagePoints[expectedAmount] || 0;

    // Verify the transaction using Flutterwave
    const response = await flw.Transaction.verify({ id: transaction_id });
    //console.log(response)



    if (response.data.status === 'successful' &&
        response.data.amount === expectedAmount &&
        response.data.currency === 'NGN') {

      // Payment was successful, update the payment status
      await Subscribe.updateOne({ tx_ref: tx_ref }, { status: 'success' });
      await Subscribe.updateOne({ points: points})

      // Optionally, update other related records or perform additional actions

      //res.redirect(`http://localhost:3500/api/auth/dashboard/${userId}`);
      res.render('paymentsuccess', {userId})
    } else {
      // Payment failed or does not match the expected parameters
      await Subscribe.updateOne({ tx_ref: tx_ref }, { status: 'failed' });
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};

const monthlySubscribe = async (req, res) => {
  const { email, name, package, userId } = req.body;
  const timestamp = Date.now(); // Current timestamp in milliseconds
  const randomValue = Math.floor(Math.random() * 1000000); // Random number up to 1,000,000
  const tx_ref = `tx_${timestamp}_${randomValue}`; // Combine timestamp and random value

  const points = packagePoints[package] || 0;


  const paymentData = {
      public_key: process.env.PUBLIC_KEY,
      email: email,
      amount: package,
      name: name,
      tx_ref: tx_ref,
      subscription: package,
      currency: 'NGN',
      source: 'docs-html-test',
      user:userId
  };



  try {


       // Make the API request to Flutterwave
    const response = await axios.post('https://api.flutterwave.com/v3/payments', {
      tx_ref: tx_ref,
      amount: package,
      currency: 'NGN',
      redirect_url: `http://localhost:3500/api/auth/dashboard/${userId}`,
      customer: {
        email: email,
        name:name,
        phonenumber: '09012345678'
      },
      user:userId
     
   
    }, {
      headers: {
        Authorization: `Bearer ${process.env.SECRETE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status === 'success') {
      const paymentLink = response.data.data.link; // This link is where you should redirect the user to
            // Create a new payment record
            const payment = new Subscribe(paymentData);
            await payment.save();
            await Subscribe.updateOne({points: points});
            await User.updateOne({_id: payment.user, package: payment.subscription})
      await Subscribe.updateOne({ status: 'success' });

      //distribute commission for upgrade...
      distributeCommissions(userId, package)
      res.redirect(paymentLink); // Redirect user to the payment page
    } else {
      // Handle unsuccessful response
      await Subscribe.updateOne({ status: 'failed' });

      res.status(400).json({ success: false, message: 'Payment initialization failed' });
    }


 

  } catch (error) {
      console.error('Error preparing payment redirect:', error);
      res.status(500).json({ success: false, message: 'Failed to prepare payment redirect' });
  }
};

module.exports = 
{
  buyAirtime,
  withdraw,
  submitPayment, 
  handlePaymentCallback, 
  subscriptionFee, 
  getAllBanks,
  subscriptionFeeReferral,
  billPayment,
  handleWebhook,
  upgradePackage,
  verifyPayment,
  monthlySubscribe,
  verifyUpgradePayment,
  verifyMonthlyPackage,
  verifyReferralPayment
}
