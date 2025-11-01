const express = require('express');
const route = express.Router();

const { verifyRole } = require('../../middleware/authMiddleware');

route.get('/chef/dashboard', verifyRole(['chef']), (req, res) => {
    res.json({ message : 'Welcome Chef!' });
    console.log('Welcome Chef!')
})

module.exports = route;