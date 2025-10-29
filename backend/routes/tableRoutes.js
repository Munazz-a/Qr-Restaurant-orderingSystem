const express = require('express');
const route = express.Router();
const crypto = require('crypto');

const table = require('../models/tableModel.js');

route.post('/table', async(req, res) => {
    try{
        const sessionId = crypto.randomBytes(8).toString('hex');
        const { tableNumber } = req.body;
        const newTable = await table.create({
            tableNumber,
            sessionId
        })
        console.log(newTable);
        res.json({ success : true, newTable });
    }catch(err){
        console.error("❌ Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
})

route.get(`/table/:sessionId`, async(req, res) => {
    try{
        const tableData = await table.findOne({ sessionId : req.params.sessionId});

        if(!tableData) return res.status(404).json({ success : false, message : 'Table not found!' });

        res.json({
            success : true,
            tableNumber : tableData.tableNumber
        })
    }catch(err){
        console.log('Error in getting table Number:', err.message);
        res.status(500).json({ success : false, error : err.message })
    }
})

module.exports = route;