const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());


// connect to mongoDB
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to mongoDB!!');
}).catch(err => {
    console.error('mongoDB connection error: ', err);
})

app.use(express.static('frontend'));

// route
app.use('/api', require('./backend/routes/customer/tableRoutes.js'))
app.use('/api', require('./backend/routes/customer/cartRoutes.js'))
app.use('/api', require('./backend/routes/adminRoutes.js'))
app.use('/api', require('./backend/routes/chefRoutes.js'))
app.use('/api', require('./backend/routes/authRoutes.js'))

// static pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'customer', 'splash.html'));
})
app.get(`/menuOverview`, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'customer', 'menuOverview.html'));
})
app.get(`/myOrder`, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'customer', 'myOrder.html'));
})
app.get(`/login`, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'adminChef.html'));
})
app.get(`/admin/dashboard`, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin',  'dashboard.html'));
})
app.get(`/chef/dashboard`, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'chef',  'dashboard.html'));
})

app.listen(3000, () => {
    console.log('Working Fine!!');
})


