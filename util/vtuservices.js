const axios = require('axios');
require('dotenv').config();

const getBills = 'https://api.flutterwave.com/v3/top-bill-categories?country=NG';



const getBillCategories = async(req, res)=>{

    const response = axios.get(getBills, {
        headers:{
            Authorization:`Bearer ${process.env.SECRETE_KEY}`,
            'Content-Type': "application/json"
        }
    })

    console.log(response.data)
}
const buyAirtime = async (phoneNumber, amount, NetworkProvider) => {
    try {
        const response = axios.post(apiBaseUrl, {
            phoneNumber,
            amount
        })
        console.log('Airtime purchase response:', response.data);
    } catch (error) {
        console.error('Error purchasing airtime:', error.response.data);
    }
};

const buyData = async (phoneNumber, amount, dataPlan) => {
    try {
        const response = axios.post(apiBaseUrl, {
            phoneNumber,
            amount
        })
        console.log('Airtime purchase response:', response.data);
    } catch (error) {
        console.error('Error purchasing airtime:', error.response.data);
    }
};

const buyDstv = async (smartcardNumber, amount, package) => {
    try {
        const response = axios.post(apiBaseUrl, {
            phoneNumber,
            amount
        })
        console.log('Airtime purchase response:', response.data);
    } catch (error) {
        console.error('Error purchasing airtime:', error.response.data);
    }
};

module.exports = { buyAirtime, getBillCategories, buyData, buyDstv };
