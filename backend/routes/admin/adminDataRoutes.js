const express = require('express');
const route = express.Router();

const Table = require('../../models/customer/cartModel');
const { verifyRole } = require('../../middleware/authMiddleware');

route.get('/getOrders', verifyRole(['admin', 'chef']), async(req, res) => {
    try{
        const orders = await Table.find();
        res.json(orders);
    } catch(err){
        console.error('Error getting orders', err);
        res.status(500).json({ error : err.message });
    }
})

module.exports = route;