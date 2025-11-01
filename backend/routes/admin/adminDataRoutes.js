const express = require('express');
const route = express.Router();

const Table = require('../../models/customer/cartModel');

route.get('/getOrders', async(req, res) => {
    try{
        const orders = await Table.find();
        res.json(orders);
    } catch(err){
        console.error('Error getting orders', err);
        res.status(500).json({ error : err.message });
    }
})

module.exports = route;