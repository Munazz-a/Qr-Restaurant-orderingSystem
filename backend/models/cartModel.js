const mongoose = require('mongoose');

const cartItemsSchema = new mongoose.Schema({
    name : String,
    price : Number,
    quantity : Number
}, {_id : false});

const cartScheme = new mongoose.Schema({
    tableNo : {
        type : Number,
        required : true
    },
    cart : {
        type : [cartItemsSchema],
        required : true
    },
    totalAmount : {
        type : Number,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('cart', cartScheme)