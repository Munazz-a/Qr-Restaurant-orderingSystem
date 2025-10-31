const express = require('express');
const route = express.Router();

const cartItems = require('../../models/customer/cartModel');

route.post('/order', async(req, res) => {
    try{
        const { tableNo, cart, totalAmount, paymentMethod, paymentStatus } = req.body;
        const orderCart = await cartItems.create({
        tableNo,
        cart,
        totalAmount,
        paymentMethod,
        paymentStatus
        })
        console.log(orderCart);
        res.json({ success : true, orderCart})
    } catch (err) {
        console.log('Error uploading cart to db: ', err);
        res.status(500).json({success : false, error : err.message});
    }
})

route.post('/payment', async(req, res) => {
    try{
        const { paymentData } = req.body;

        const paymentToken = paymentData.paymentMethodData?.tokenizationData?.token;
        if(!paymentToken){
            return res.status(400).json({ success : false, message : 'not token received'});
        }
        console.log('Verified Payment: ', paymentToken);
        res.status(200).json({ success : true, paymentToken });

    } catch(err){
        console.error('Payment verification error: ', err);
        res.status(500).json({ success : false, error : err.message});
    }
})

module.exports = route;