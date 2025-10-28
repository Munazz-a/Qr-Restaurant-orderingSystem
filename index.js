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
app.use('/api', require('./backend/routes/tableRoutes.js'))

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

app.listen(3000, () => {
    console.log('Working Fine!!');
})


