const mongoose = require('mongoose');

const adminChefSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : [ 'admin', 'chef' ],
        required : true
    }
})

module.exports = mongoose.model('adminChef', adminChefSchema)