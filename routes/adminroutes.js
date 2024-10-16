//my express server imports
const express = require('express');
const router = express.Router();
//all my controller imports 
const 
{
   getAllUsers,
   deleteUser,
   logIn,
   search,
   registerAdmin,
   createNotification,
   verifyProof,
   verifypayment
} 
= require("../controller/admincontroller");
const {adminAuth} = require("../util/auth.middleware")

router.post('/login', logIn);
router.post('/registeradmin', registerAdmin);
router.get('/getall', getAllUsers);
router.get('/getprofile', adminAuth);
router.post('/remove/:id/delete', deleteUser); 
router.get('/search', search);
router.get('/message', (req, res)=>{
   if (!req.session.user) {
      return res.redirect('/login'); // Redirect to login if not authenticated
    }
   res.render('user/html/bulkmessage', { user: req.session.user })
})

router.post('/approve-payment/:paymentId', verifypayment)
router.get('/verify', verifyProof);
router.post('/notifications', createNotification);

module.exports = router;