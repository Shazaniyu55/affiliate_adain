//my express server imports
const express = require('express');
const router = express.Router();
const multer = require("multer")
const {authenticate} = require('../util/auth.middleware')
const Payment = require("../model/payment");
//all my controller imports 
const 
{
    getUserData,
    getUserAmount,
    uploadProofPayment,
    getUserById,
    logIn, 
    signUp, 
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
    
} = require("../controller/usercontroller");

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

//all my routes

//authentication routes
router.post("/register", upload.single('image'), signUp);
router.post("/login", logIn);


//user routes
router.post('/update', upload.single('upload'),  updateUser);
router.post('/uploadpayment/:userId', upload.single('upload'),  uploadProofPayment);

router.post("/message", message);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get('/update-password', renderResetPasswordPage);

//dashboard routes
//router.get('/dashboard',getUserData)
router.get('/dashboard/:userId', (req, res)=>{
    if(!req.session.user){
        res.redirect('/login')
    }else{
        res.render('admin/html/admin', {user: req.session.user})
    }
});

router.get('/users/vtu/:userId', (req, res)=>{
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
      }
    res.render("admin/html/vtu", { user: req.session.user })
})
router.get('/users/:userId/referred', async(req, res)=>{
        try {
            const userId = req.params.userId;
            const network = await getReferredUsers(userId);
            res.render('admin/html/refered', { network, user: req.session.user })
        } catch (error) {
            console.error('Error fetching referral network:', error);
            res.status(500).send( error.message );
        }
});
router.get('/users/profile/:userId', async(req, res)=>{
    try {
        const userId = req.params.userId;
        const userniyu = getUserById(userId);
        res.render("admin/html/profile", {userniyu, user: req.session.user })

    } catch (error) {
        res.status(500).send( error.message );
    }
})

router.get('/users/settings-account/:userId', async(req, res)=>{
        try {
            const userId = req.params.userId;
            const userniyu = getUserById(userId);
            res.render("admin/html/settings-account", {userniyu,  user: req.session.user })
        } catch (error) {
            res.status(500).send( error.message );
        }
})

router.get('/users/withdraw/:userId', getUserAmount);

router.get('/users/wallet/:userId',getUserData);

//vtu routes
router.post('/buy/:userId', airtimeTopUp);


//token routes
router.post('/getreferraltoken', generateReferralIdToken);
router.post('/signupreferraltoken', upload.single('image'), signupWithReferralToken);


router.get('/subscriptionpop', (req, res)=>{
    if (!req.session.user) {
        return res.redirect('/register'); // Redirect to login if not authenticated
      }
    res.render("paymentpop", { user: req.session.user })
});

router.get('/accountpay', (req, res)=>{
    if (!req.session.user) {
        return res.redirect('/register'); // Redirect to login if not authenticated
      }
    res.render("paymanual", { user: req.session.user })
});

router.get('/payment-status/:userId', async (req, res) => {
    try {
        const payment = await Payment.findOne({ user: req.params.userId });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ status: payment.status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/subscriptionreferall', (req, res)=>{
    if (!req.session.user) {
        return res.redirect('/register'); // Redirect to login if not authenticated
      }
        // Retrieve referral token from session
    const referralToken = req.session.referralToken;
    res.render("paymentreferral", { user: req.session.user, token: referralToken })
});


module.exports = router