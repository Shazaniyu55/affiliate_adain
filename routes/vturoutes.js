const express = require('express');
const router = express.Router();
const 
{
getBillCategories,
buyAirtime,
buyDstv,
buyData
} = require("../util/vtuservices");
//const authenticate = require("../util/auth.middleware");
router.get('/getbills', getBillCategories);
module.exports = router