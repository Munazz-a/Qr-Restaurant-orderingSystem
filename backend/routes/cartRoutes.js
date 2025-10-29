const express = require('express');
const route = express.Router();

const cartItems = require('../models/cartModel');

route.post('/order', async(req, res) => {
    try{
        const { tableNo, cart, totalAmount } = req.body;
        const orderCart = await cartItems.create({
        tableNo,
        cart,
        totalAmount
        })
        console.log(orderCart);
        res.json({ success : true, orderCart})
    } catch (err) {
        console.log('Error uploading cart to db: ', err);
        res.status(500).json({success : false, error : err.message});
    }
})

module.exports = route;