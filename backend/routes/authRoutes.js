const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../../backend/models/adminChefModel');

route.post('/auth/login', async(req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if(!user || user.password !== password){
        return res.status(401).json({ message : 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id : user._id, role : user.role },
        process.env.JWT_SECRET
    );

    res.json({ token, role : user.role, message : "Login successfully" });
    console.log(token);
})

module.exports = route