// controllers/adminController.js
const User = require('../model/usermodel');
const Payment = require("../model/payment")
const Admin = require("../model/admin");
const Subscribe = require("../model/suscribe");
const Notification = require("../model/notification");
const Flutterwave = require('flutterwave-node-v3');
const { method } = require('lodash');
require("dotenv").config();

const flw = new Flutterwave(process.env.PUBLIC_KEY, process.env.SECRETE_KEY);


const packagePoints = {
  '2500': 10,
  '5000': 20,
  '10000': 40,
  '25000': 100,
  '50000': 200,
  '100000': 400,
  '500000': 2000
};


const verifyuserPayment = async (userId) => {

  try {
    const payment = await Subscribe.findOne({ user: userId });

    if (!payment) {
      console.log('Payment record not found')
      return;
    }

    const expectedAmount = payment.amount; // Retrieve the expected amount from the payment record
    const points = packagePoints[expectedAmount] || 0;

    console.log('Payment record:', payment);
console.log('Expected amount:', expectedAmount);
console.log('Points awarded:', points);



    // Update payment status and points
    await Subscribe.findOneAndUpdate( { status: 'success', points: points });

    //res.redirect(`http://localhost:3500/api/auth/dashboard/${userId}`);
  } catch (error) {
    console.error('Error verifying payment:', error);
   // res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};

// Login an admin
const logIn = async (req, res) => {
  try {
      const { email, password } = req.body;

      // Find the admin
      const admin = await Admin.findOne({ email });
      if (!admin) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Compare passwords
      // const isMatch = await admin.comparePassword(password);
      // if (!isMatch) {
      //     return res.status(400).json({ message: 'Invalid email or password' });
      // }


      req.session.user = {
        id: admin._id,
        email: admin.email
       
      };
      // Generate a token

      // Send success response with token
      res.status(200).json({
        status: "Success",
        message: "Login successful",
        user: {
            id: admin._id,
            email: admin.email
            // Add other admin fields as needed
        }
    });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Register a new admin
const registerAdmin = async (req, res) => {
  try {
      const { fullname, email, password, isAdmin } = req.body;

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
          return res.status(400).json({ message: 'Admin already exists' });
      }

      // Create a new admin
      const newAdmin = new Admin({ fullname, email, password, isAdmin });
      await newAdmin.save();

      // Generate a token

      res.status(201).json({ admin: newAdmin });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const distrubutePercentage = async(req, res)=>{}

// Get current admin details
const getCurrentAdmin = async (req, res) => {
  try {
      // Retrieve the admin from the request (assumes auth middleware sets req.admin)
      const admin = req.admin;
      res.status(200).json(admin);
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {


    //console.log(transac)

            // Check if session exists
      if (!req.session.user) {
              // Session does not exist, redirect to login or show an error
              return res.redirect('/adminlogin'); 
      }

      const users = await User.find();
      const transac = await Payment.find();
      const subscribe = await Subscribe.find();

      // Calculate total amount
      const totalAmount = subscribe.reduce((sum, user) => sum + user.subscription, 0);

      // Calculate average subscription amount
      const averageSubscription = subscribe.length > 0 ? totalAmount / subscribe.length : 0;

      // Assuming we want to display the number of transactions
      const totalTransactions = subscribe.length;
  
// console.log(subscribe)
    res.render('user/html/dashboard', { users, transac, subscribe, totalAmount, averageSubscription, totalTransactions }); // Rendering a view with the users data
  } catch (err) {
    res.status(500).send('Error retrieving users');
  }
};


const verifyProof = async (req, res) => {
  try {
      if (!req.session.user) {
          // Session does not exist, redirect to login or show an error
          return res.redirect('/adminlogin'); 
      }

      // Fetch all users
      const users = await User.find().select('fullname email');

      // Fetch the admin document to get proof of payment
      const admin = await Admin.findById('66f134e2e0fcd58cf8e977c3').select('proofPayment');
      const payment = await Payment.findOne({ userId: users._id }); // Adjust the query as needed
      if (!payment) {
        return res.status(404).send('Payment not found');
    }

    const paymentId = payment._id; // Extract the payment ID

    
      // Render the view with the users and admin proof of payment
      res.render('user/html/verifypayment', { users, admin, paymentId  });
  } catch (err) {
      console.error('Error retrieving users or admin:', err);
      res.status(500).send('Error retrieving users or admin');
  }
};


const verifypayment = async(req, res)=>{
  try {
    const { paymentId } = req.params;
    const { action, userId } = req.body; // action should be 'approve' or 'reject'
    const users = await User.findById(userId);
    console.log(users)

    const payment = await Payment.findById(paymentId);
    if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
    }

    if (action === 'approve') {
        payment.status = 'approved';
        await payment.save();
        await verifyuserPayment(users);
        res.status(200).json({ message: 'Payment approved successfully' });
    } else if (action === 'reject') {
        payment.status = 'rejected';
        await payment.save();
        res.status(200).json({ message: 'Payment rejected' });
    } else {
        res.status(400).json({ message: 'Invalid action' });
    }
} catch (error) {
    res.status(500).json({ error: error.message });
}
}

const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id; // Get user ID from request parameters
      await User.findByIdAndDelete(userId); // Delete user by ID
      res.redirect('/adminlogin'); // Redirect to users list after deletion
    } catch (err) {
      res.status(500).send('Error deleting user');
    }
  };

const search = async (req, res) => {
    const criteria = req.query;
    const query = {};

    if (criteria.email) {
        query.email = { $regex: new RegExp(criteria.email, 'i') }; // Correct regex usage
    }

    try {
        const user = await User.find(query);
        console.log(user)
        
        res.render("user/html/search",{result: user});
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching for jobs.' });
    }
};

// Create a new notification
const createNotification = async (req, res) => {
  try {
      const { message, user, type } = req.body;

      if (!message || !user || !type) {
          return res.status(400).json({ error: 'Message, user, and type are required.' });
      }

      // Check if the user exists
      const userExists = await Admin.findById(user);
      if (!userExists) {
          return res.status(404).json({ error: 'User not found.' });
      }

      const notification = new Notification({ message, user, type });
      await notification.save();

      // Update user's notification count
      await User.updateOne(      
        { $inc: { notificationsCount: 1 } }
      );


      //res.status(201).json(notification);
      res.redirect('/api/admin/message')
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getAllUsers, 
  createNotification, 
  deleteUser, 
  logIn, 
  search, 
  registerAdmin, 
  getCurrentAdmin,
  verifyProof,
  verifypayment

};
