const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors : {origin : '*' }
});
app.set('io', io);


// verify paths and files
const fs = require('fs');

app.get('/debug-path', (req, res) => {
  res.json({
    dirname: __dirname,
    frontendExists: fs.existsSync(path.join(__dirname, 'frontend')),
    customerFolderExists: fs.existsSync(path.join(__dirname, 'frontend/customer')),
    jsFolderExists: fs.existsSync(path.join(__dirname, 'frontend/customer/js')),
    menuJsExists: fs.existsSync(
      path.join(__dirname, 'frontend/customer/js/menuOverview.js')
    )
  });
});


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
app.use('/api', require('./backend/routes/admin/adminRoutes.js'))
app.use('/api', require('./backend/routes/chef/chefRoutes.js'))
app.use('/api', require('./backend/routes/authRoutes.js'))
app.use('/api', require('./backend/routes/admin/adminDataRoutes.js'));

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
    res.sendFile(path.join(__dirname, 'frontend', 'admin',  'adminDashboard.html'));
})
app.get(`/chef/dashboard`, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'chef',  'chefDashboard.html'));
})

if (process.env.VERCEL) {
  module.exports = app;
} else {
  server.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
  });
}


