const User = require("../model/usermodel");
const nodemailer = require("nodemailer");
const Payment = require('../model/payment');
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const vtuServices = require("../util/vtuservices");
const cloudinary = require("../cloudinary");
const streamifier  = require("streamifier");
const Subscribe = require('../model/suscribe');
const Notification = require('../model/notification');
const jwt = require('jsonwebtoken');
const Admin = require("../model/admin");

//function to login
const logIn = async(req, res)=>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ status: "Failed", message: "invalid email or password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, 'Adain', { expiresIn: '1h' }); // 1 hour expiration
        // const token = user.generateAuthToken();
        //res.status(200).json({ status: "Success" });
        // Store user information in the session
    
                req.session.user = {
                    id: user._id,
                    email: user.email,
                    fullname: user.fullname, 
                    phoneNumber: user.phoneNumber,
                    country: user.country,
                    accountNumber: user.accountNumber,
                    accountBank: user.accountBank,
                    referralToken: user.referralToken,
                    image:user.image,
                    notificationsCount: user.notificationsCount,
                    referralCount:user.referralCount,
                    referredUsers: user.referredUsers,
                    commissions: user.commissions,
                    points:user.points,
                    accountName:user.accountName
                   
                    
                   
                    
                    // Add other fields as needed
                };

                // Send success response
                res.status(200).json({
                    status: "Success",
                    message: "Login successful",
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        fullname: user.fullname,
                        phoneNumber: user.phoneNumber,
                        country: user.country,
                        accountNumber: user.accountNumber,
                        accountBank: user.accountBank,
                        notificationsCount: user.notificationsCount,
                        referralCount:user.referralCount,
                        referredUsers: user.referredUsers,
                        points:user.points,
                        accountName:user.accountName

                    }
                });
        
                // Redirect to the dashboard
                // res.redirect('/dashboard');
    } catch (error) {
        console.error("Error during login:", error);

        // Handle errors and ensure only one response
        if (!res.headersSent) {
            res.status(500).json({ status: "Failed", message: error.message });
        }   
    }
    
    
};

const getUser = async (req, res) => {
    const userId = req.params.userId;

    // Ensure userId is provided
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch payments and subscriptions associated with the user
        const payments = await Payment.find({ user: userId }).lean();
        const subscribe = await Subscribe.find({ user: userId }).lean();
        const notifications = await Notification.find().sort({ createdAt: -1 });

        // Calculate totals
        const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalsub = subscribe.reduce((sum, sub) => sum + sub.points, 0);

        // Store data in session
        req.session.user.payments = payments;
        req.session.user.totalAmount = totalAmount;
        req.session.user.subscribe = totalsub;

        // Check if the request expects JSON or HTML
        if (req.headers['accept'] === 'application/json') {
            // Respond with JSON if the client requests JSON
            return res.json({
                user,
                payments,
                notifications,
                totalAmount,
                totalsub
            });
        } else {
            // Render the view with user and calculated data if not requesting JSON
            if (!req.session.user) {
                return res.redirect('/login'); // Redirect to login if not authenticated
            } else {
                return res.render('admin/html/admin', {
                    user,
                    payments,
                    notifications,
                    totalAmount,
                    totalsub
                });
            }
        }
    } catch (error) {
        console.error('Error fetching user data:', error);

        // Handle errors and provide a fallback in case of failure
        req.session.user = {
            ...req.session.user,
            payments: [],
            totalAmount: 0,
            subscribe: [],
            totalsub: 0
        };

        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getUserData = async (req, res) => {
    const userId = req.params.userId;

    // Ensure userId is provided
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch payments and subscriptions associated with the user
        const payments = await Payment.find({ user: userId }).lean();
        const subscribe = await Subscribe.find({ user: userId }).lean();
        const notifications = await Notification.find().sort({ createdAt: -1 });


        // Calculate totals
        const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalsub = subscribe.reduce((sum, sub) => sum + sub.points, 0);

        // Store data in session
        req.session.user.payments = payments;
        req.session.user.totalAmount = totalAmount;
        req.session.user.subscribe = totalsub;

      

        // Render the view with user and calculated data
        res.render("admin/html/wallet", {user, payments, notifications,
            totalAmount,
            totalsub});

    } catch (error) {
        console.error('Error fetching user data:', error);

        // Handle errors and provide a fallback in case of failure
        req.session.user = {
            ...req.session.user,
            payments: [],
            totalAmount: 0,
            subscribe: [],
            totalsub: 0
        };

        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


// const getUserData = async (req, res) => {
//     const userId = req.params.userId;

//     // Ensure userId is provided
//     if (!userId) {
//         return res.status(400).json({ message: 'User ID is required' });
//     }

//     try {
//         // Fetch user details
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Fetch payments and subscriptions associated with the user
//         const payments = await Payment.find({ user: userId }).lean();
//         //console.log(payments)
//         const subscribe = await Subscribe.find({ user: userId }).lean();
//         const notifications = await Notification.find().sort({ createdAt: -1 });

//         // Check if it's the end of the month
//         const now = new Date();
//         const isEndOfMonth = now.getDate() === new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

//         if (isEndOfMonth) {
//             console.log("End of the month check");
//         }

//         // Calculate totals
//         const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
//         const totalsub = subscribe.reduce((sum, sub) => sum + sub.points, 0);

//         // Ensure req.session.user is initialized
//         req.session.user = req.session.user || {}; // Initialize if undefined

//         // Store data in session
//         req.session.user.payments = payments;
//         req.session.user.totalAmount = totalAmount;
//         req.session.user.subscribe = subscribe; // Use actual subscriptions array
//         req.session.user.totalsub = totalsub;

//         // Render the view with user and calculated data
//         res.render("admin/html/wallet", {
//             user,
//             payments,
//             notifications,
//             totalAmount,
//             totalsub
//         });

//     } catch (error) {
//         console.error('Error fetching user data:', error);

//         // Handle errors and provide a fallback in case of failure
//         req.session.user = {
//             ...req.session.user,
//             payments: [],
//             totalAmount: 0,
//             subscribe: [],
//             totalsub: 0
//         };

//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// };


// const getUserData = async (req, res) => {
//     const userId = req.params.userId;

//     // Ensure userId is provided
//     if (!userId) {
//         return res.status(400).json({ message: 'User ID is required' });
//     }

//     try {
//         // Fetch user details
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Fetch payments and subscriptions associated with the user
//         const payments = await Payment.find({ user: userId }).lean();
//         const subscribe = await Subscribe.find({ user: userId }).lean();
//         const notifications = await Notification.find().sort({ createdAt: -1 });


//         //check if is the end of the month
//         const now = new Date();
//         const isEndOfMonth = now.getDate()

//         if(isEndOfMonth){
//           // Calculate totals
//         const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
//         const totalsub = subscribe.reduce((sum, sub) => sum + sub.points, 0);
//         }

//         // Calculate totals
//         const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
//         const totalsub = subscribe.reduce((sum, sub) => sum + sub.points, 0);

//         // Store data in session
//         req.session.user.payments = payments;
//         req.session.user.totalAmount = totalAmount;
//         req.session.user.subscribe = totalsub;

      

//         // Render the view with user and calculated data
//         res.render("admin/html/wallet", {user, payments, notifications,
//             totalAmount,
//             totalsub});

//     } catch (error) {
//         console.error('Error fetching user data:', error);

//         // Handle errors and provide a fallback in case of failure
//         req.session.user = {
//             ...req.session.user,
//             payments: [],
//             totalAmount: 0,
//             subscribe: [],
//             totalsub: 0
//         };

//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// };


//function to request a password rest
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "Failed", message: "Email does not exist in our records." });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Save the reset token and its expiry date in the user record
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        // Set up email transporter
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Send password reset email
        //const resetUrl = `http://localhost:3500/reset-password`;
        const resetUrl = `http://localhost:3500/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            from: 'affliate@gmail.com',
            to: `${email}`,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                   <a href="${resetUrl}">Reset Password</a>
                   <p>If you did not request this, please ignore this email.</p>`
        });

        res.status(200).json({ status: "Success", message: "Password reset email sent successfully Check Your Mail." });


    } catch (error) {
        console.error("Error sending password reset email:", error);
        res.status(500).json({ status: "Failed", message: error.message });
    }
};


//function to reset password
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Find the user by reset token
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() } // Check if token is expired
        });

        if (!user) {
            return res.status(400).json({ status: "Failed", message: "Invalid or expired token." });
        }

        // Hash the new password
        //const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and clear reset token
        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({
            status: "Success",
            message: "Password update successfully",
          });
        // Redirect to login page after successful password update
        //res.redirect('/login'); // Adjust the path as needed for your login route

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ status: "Failed", message: error.message });
    }
};

const signUp = async (req, res) => {
    try {
      const { fullname, phoneNumber, country, accountNumber, accountName, accountBank, email, password, package } = req.body;
  
      if (!fullname || !phoneNumber || !country || !accountNumber || !accountName || !accountBank || !email || !password || !package) {
        return res.status(400).json({ status: "Failed", message: "Please fill out all fields." });
      }
  
      let imageURL = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
  
      // If an image file is provided
      if (req.file) {
        // Wrap the Cloudinary upload in a promise
       
          const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
                return res.status(500).send('Error uploading image to Cloudinary');
            }
           imageURL = result.secure_url;

        
        
           createuser()

          });
          
          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);        
      }else{
        createuser()
    
        
      }

      async function createuser(){

         // Create a new user with the provided data and the image URL if available
      const user = new User({
        fullname,
        phoneNumber,
        country,
        accountNumber,
        accountName,
        accountBank,
        email,
        package,
        password,
        image: imageURL // Add imageURL to user model if applicable
      });

       // Create a payment entry
    //    const payment = new Payment({
    //     user: user._id,
    //     amount: Number(package),
    //     bankDetails: {
    //         accountNumber,
    //         accountName,
    //         bankName: accountBank,
    //     }
    // });


    // const subscribe = new Subscribe({
    //     user: user._id,
    //     amount: Number(package),
        
        
    // });
    


        try {
            await user.save();
            
            // Generate a JWT token
            const token = jwt.sign({ id: user._id}, 'Adain', { expiresIn: '1h' });

            req.session.user = {
                id: user._id,
                email: user.email,
                fullname: user.fullname, 
                phoneNumber: user.phoneNumber,
                country: user.country,
                accountNumber: user.accountNumber,
                accountBank: user.accountBank,
                referralToken: user.referralToken,
                image:user.image,
                package: user.package,
                points: user.points,
                notificationsCount: user.notificationsCount
               
                
                // Add other fields as needed
            };
            res.status(200).json({
                status: "Success",
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    fullname: user.fullname,
                    phoneNumber: user.phoneNumber,
                    country: user.country,
                    accountNumber: user.accountNumber,
                    accountBank: user.accountBank,
                    notificationsCount: user.notificationsCount,
                    referralCount: user.referralCount,
                    referredUsers: user.referredUsers,
                    points: user.points,
                    accountName: user.accountName
                }
            });
            
        } catch (error) {
            console.error('Error saving product:', error);
                res.status(500).send('Error saving product');
        }
      }
  
     
  
      
  
     
    } catch (error) {
      console.error("Error during signup:", error);
  
      // Handle errors and ensure only one response
      if (!res.headersSent) {
        res.status(500).json({ status: "Failed", message: error.message });
      }
    }
};


const updateUser = async (req, res) => {
    try {
        // Ensure the user is authenticated
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({ status: "Failed", message: "Unauthorized" });
        }

        // Get the user ID from the session
        const userId = req.session.user.id;

        // Build the update object
        const updateData = {};

        if (req.body.fullname) updateData.fullname = req.body.fullname;
        if (req.body.phoneNumber) updateData.phoneNumber = req.body.phoneNumber;
        if (req.body.country) updateData.country = req.body.country;

        // Check if a file was uploaded
        if (req.file) {
            // Upload the image to Cloudinary
            const result = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
                if (error) {
                    return res.status(500).json({ status: "Failed", message: error.message });
                }

                // Save the Cloudinary URL to updateData
                updateData.profilePic = result.secure_url;

                // Update the user in the database
                const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

                if (!user) {
                    return res.status(404).json({ status: "Failed", message: "User not found" });
                }

                // Update user information in the session if needed
                req.session.user = {
                    ...req.session.user,
                    ...updateData,
                };

                // Redirect or respond with success
                res.redirect('/niyu');
            });

            req.file.stream.pipe(result);
        } else {
            // If no file was uploaded, update the user without changing the profile picture
            const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

            if (!user) {
                return res.status(404).json({ status: "Failed", message: "User not found" });
            }

            // Update user information in the session if needed
            req.session.user = {
                ...req.session.user,
                ...updateData,
            };

            // Redirect or respond with success
            res.redirect('/niyu');
        }
    } catch (error) {
        res.status(500).json({ status: "Failed", message: error.message });
    }
};

const generateReferralIdToken = async(req, res)=>{
    const {userId} = req.body;
    try {
         // Validate userId
         if (!userId) {
            return res.status(400).json({ status: 'Failed', message: 'User ID is required.' });
        }
         // Generate a unique referral token
         const referralToken = crypto.randomBytes(16).toString('hex'); // 32 characters long token
         const referralTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 1 day expiry

         const user = await User.findByIdAndUpdate(
             userId,
             { referralToken: referralToken, referralTokenExpiry: referralTokenExpiry },
            
         );
         await user.save();
         res.redirect(`/api/auth/users/wallet/${userId}`);
         
    } catch (error) {
        console.error('Error generating referral token:', error);
        res.status(500).json({ status: 'Failed', message: error.message });
    }
}

const signupWithReferralToken = async (req, res) => {
    const { fullname, phoneNumber, country, accountNumber, accountName, accountBank, email, password, package, referralToken } = req.body;

    try {
        // Validate input
        if (!fullname || !phoneNumber || !country || !accountNumber || !accountName || !accountBank || !email || !password || !package || !referralToken) {
            return res.status(400).json({ status: 'Failed', message: 'All fields are required.' });
        }

        // Function to handle image upload
        const handleImageUpload = () => {
            return new Promise((resolve, reject) => {
                if (req.file) {
                    const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                        if (error) {
                            return reject(new Error('Error uploading image to Cloudinary'));
                        }
                        resolve(result.secure_url);
                    });

                    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
                } else {
                    resolve(''); // No image, resolve with an empty string
                }
            });
        };

        // Create user function
        const createUser = async (imageURL, referredBy) => {
            // Create a new user with the provided details
            const newUser = new User({
                fullname,
                phoneNumber,
                country,
                accountNumber,
                accountName,
                accountBank,
                email,
                password,
                package,
                image: imageURL,
                referredBy: referredBy ? referredBy._id : null,
                referralTier: referredBy.referralTier + 1 // Assign tier based on referrer
            });

            // Save the new user to the database
            await newUser.save();

            // Update the original user
            await User.updateOne(
                { _id: referredBy._id },
                {
                    $inc: { referralCount: 1 },
                    $push: {
                        referredUsers: {
                            _id: newUser._id,
                            fullname: newUser.fullname,
                            email: newUser.email,
                            image: newUser.image,
                            referredUsers:[]
                        }
                    }
                }
            );

            // Recursively update the upline
            const updateUpline = async (user) => {
                if (user.referredBy) {
                    const referrer = await User.findById(user.referredBy._id);
                    if (referrer) {
                        await User.updateOne(
                            { _id: referrer._id },
                            {
                                $push: {
                                    referredUsers: {
                                        _id: newUser._id,
                                        fullname: newUser.fullname,
                                        email: newUser.email,
                                        image: newUser.image,
                                        referredUsers: []
                                    }
                                }
                            }
                        );
                        await updateUpline(referrer); // Recursively update the next referrer
                    }
                }
            };

            await updateUpline(referredBy);

            // Create a session for the new user
            req.session.user = {
                id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                phoneNumber: newUser.phoneNumber,
                country: newUser.country,
                accountNumber: newUser.accountNumber,
                accountBank: newUser.accountBank,
                referralToken: newUser.referralToken,
                image: newUser.image,
                package: newUser.package
            };

            // Respond with success
            res.status(201).json({ status: 'Success', message: 'User created and logged in successfully.' });
        };

        // Find user with the provided referral token
        const referredBy = await User.findOne({
            referralToken: referralToken,
        }).select('fullname email image');

        if (!referredBy) {
            return res.status(400).json({ status: 'Failed', message: 'Invalid or expired referral token.' });
        }

         // Store the referral token in the session if it's valid
         if (referredBy) {
            req.session.referralToken = referralToken; // Store in session
        }

        // Handle image upload and user creation
        const imageURL = await handleImageUpload();
        await createUser(imageURL, referredBy);

    } catch (error) {
        console.error('Error during signup with referral token:', error);
        res.status(500).json({ status: 'Failed', message: error.message });
    }
};


const getUserById = async(userId)=>{
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }else{
        return user;
    }
}

const getReferredUsers = async (userId) => {
    const user = await User.findById(userId).select('fullname image email referredUsers').populate({
                    path: 'referredUsers',
                    select: 'fullname email image referredUsers',
                    populate: {
                        path: 'referredUsers',
                        select: 'fullname email image referredUsers'
                    }
                });

    if (!user) {
        throw new Error('User not found');
    }

    const getNetwork = async (userId) => {
        const user = await User.findById(userId).select('fullname image email referredUsers').populate({
            path: 'referredUsers',
            select: 'fullname email image referredUsers',
            populate: {
                path: 'referredUsers',
                select: 'fullname email image referredUsers'
            }
        });
        if (!user) return [];

        const network = [];
        for (const ref of user.referredUsers) {
            const referrals = await getNetwork(ref._id);
            network.push({
                _id: ref._id,
                fullname: ref.fullname,
                email: ref.email,
                image: ref.image,
                referredUsers: referrals
            });
        }
        return network;
    };

    return {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        image: user.image,
        referredUsers: await getNetwork(userId)
    };
};

//function to send message to us......
const message = (req, res)=>{
    const {fullname, email, message, subject} = req.body;
     console.log(fullname, email, message, subject)
    const transporter = nodemailer.createTransport({
        service:  process.env.SERVICE,
        auth:{
            user: process.env.EMAIL,
            pass :process.env.EMAIL_PASS,
        },
        tls:{
            rejectUnauthorized: false
        }
    })

     // Setup email data
     let mailOptions = {
        from: 'shazaniyu@gmail.com', // Sender address
        to: 'shazaniyu@gmail.com', // List of recipients
        subject: 'Adain Affiliate', // Subject line
        text: `Name: ${fullname}\n Subject:${subject}\nEmail: ${email}\nMessage: ${message}`, // Plain text body
        // You can add HTML to the email if needed
        // html: '<p>Name: ' + name + '</p><p>Email: ' + email + '</p><p>Message: ' + message + '</p>'
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
          //res.status(200).json({status:"Success", message: "Email Deliver"});
          alert("email delivered")
    });
};

//function to reset password
const renderResetPasswordPage = async (req, res) => {
    const { token } = req.query;

    try {
        // Validate the reset token
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() } // Check if token is expired
        });

        if (!user) {
            return res.status(400).render('error', { message: "Invalid or expired token." });
        }

        // Render the password reset page with the token
        res.render('resetPassword', { token });
    } catch (error) {
        console.error("Error rendering password reset page:", error);
        res.status(500).render('error', { message: error.message });
    }
};



const getUserAmount = async (req, res, next) => {
    const userId = req.params.userId;

    // Ensure userId is provided
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch payments and subscriptions associated with the user
        const payments = await Payment.find({ user: userId }).lean();
        const subscribe = await Subscribe.find({ user: userId }).lean();
        const notifications = await Notification.find().sort({ createdAt: -1 });


        // Calculate totals
        const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalsub = subscribe.reduce((sum, sub) => sum + sub.points, 0);

        // Store data in session
        req.session.user.payments = payments;
        req.session.user.totalAmount = totalAmount;
        req.session.user.subscribe = totalsub;

      

        // Render the view with user and calculated data
        res.render("admin/html/withdraw", {user, payments, notifications,
            totalAmount,
            totalsub});

    } catch (error) {
        console.error('Error fetching user data:', error);

        // Handle errors and provide a fallback in case of failure
        req.session.user = {
            ...req.session.user,
            payments: [],
            totalAmount: 0,
            subscribe: [],
            totalsub: 0
        };

        return res.status(500).json({ message: 'Internal Server Error' });
    }
    // // Ensure the user is authenticated
    // if (!req.session.user || !req.session.user.id) {
    //   return res.status(401).json({ status: "Failed", message: "Unauthorized" });
    // }
  
    // const userId = req.session.user.id;
  
    // try {
    //   // Find all payments associated with the userId
    //   const payments = await Payment.find({ user: userId }).lean(); //`.lean()` for better performance
    //   const subscribe = await Subscribe.find({user: userId}).lean();
    //   // Calculate the total amount
    //   const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    //   const totalsub = subscribe.reduce((sum, payment) => sum + payment.points, 0);
    //   // Store payment data and total amount in the session
    //   req.session.user.payments = payments;
    //   req.session.user.totalAmount = totalAmount;
    //   req.session.user.subscribe = totalsub;
  
    //   // Continue to the next middleware or route handler
    //   next();
    // } catch (error) {
    //   console.error('Error fetching user payments:', error);
  
    //   // Store empty payments and zero totalAmount in case of error
    //   req.session.user.payments = [];
    //   req.session.user.totalAmount = 0;
    //   req.session.user.subscribe = [];
  
    //   next();
    // }

};


const airtimeTopUp = async(req, res)=>{
    const {phoneNumber, networkId, amount} = req.body;
     // Validate input
     if (!phoneNumber || !networkId || !amount) {
        return res.status(400).json({ message: 'Phone number, network ID, and amount are required' });
    }
        try {
            const result = vtuServices.buyAirtime(phoneNumber, networkId, amount)
            res.json({ status: 'Success', data: result });

        } catch (error) {
            res.status(500).json({ status: 'Failed', message: error.message });
        }
};

const uploadProofPayment = async (req, res) => {
    const { userId } = req.body;
    const adminId = process.env.ADMIN_ID; // Replace with your actual admin ID

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Convert the buffer to a readable stream
    const stream = streamifier.createReadStream(req.file.buffer);
    
    try {
        // Upload file to Cloudinary
        const fileUploadResult = await new Promise((resolve, reject) => {
            stream.pipe(
                cloudinary.uploader.upload_stream({ resource_type: 'raw' }, (error, result) => {
                    if (error) {
                        console.error('Error uploading to Cloudinary:', error);
                        reject('Failed to upload file.');
                    } else {
                        resolve(result);
                    }
                })
            );
        });

        // Update the admin with the proof of payment URL
        await Admin.findByIdAndUpdate(adminId, {
            proofPayment: {
                url: fileUploadResult.secure_url, // URL of the uploaded file
                user: userId, // Associate the user who uploaded it
            }
        });

        res.status(200).json({ status: "success", message: "Please await admin approval" });
    } catch (error) {
        console.error('Error in uploadProofPayment:', error);
        res.status(500).send('Internal server error.');
    }
};


module.exports =
{
    uploadProofPayment,
    getUserData,
    getUserAmount,
    getUserById,
    signUp, 
    logIn, 
    message, 
    updateUser, 
    requestPasswordReset, 
    resetPassword, 
    renderResetPasswordPage,
    airtimeTopUp,
    generateReferralIdToken,
    signupWithReferralToken,
    getReferredUsers,
    getUser,
    

};