const express = require('express');
const route = express.Router();

const { verifyRole } = require('../../middleware/authMiddleware');

route.get('/admin/dashboard', verifyRole(['admin']), (req, res) => {
    res.json({ message : 'Welcome Admin!' });
    console.log('Welcome Admin!!');
})

module.exports = route;