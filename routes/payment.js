const express = require('express');
const router = express.Router();
const 
{
    submitPayment, 
    handlePaymentCallback, 
    subscriptionFee,
    getAllBanks,
    subscriptionFeeReferral,
    withdraw,
    billPayment,
    handleWebhook,
    buyAirtime,
    upgradePackage,
    verifyPayment,
    verifyUpgradePayment,
    verifyMonthlyPackage
} = require("../controller/payment");
//const authenticate = require("../util/auth.middleware");

router.post("/banktransfer", submitPayment);
router.post("/withdraw", withdraw);
router.post("/subscription", subscriptionFee);
router.post("/subscription/referral", subscriptionFeeReferral);
router.get("/payment/callback", handlePaymentCallback);
router.get("/getAllBanks", getAllBanks);
router.get("/billPayment", billPayment);
router.post('/webhook', handleWebhook);
router.post('/upgradepackage/:userId', upgradePackage);
router.get('/verify-payment', verifyPayment);
router.get('/verify-upgrade-payment', verifyUpgradePayment);
router.post('/buy-airtime', buyAirtime);
router.post('/bverify-monthly-payment', verifyMonthlyPackage);

module.exports = router