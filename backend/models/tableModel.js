const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableNumber : {
        type : String,
        required : true
    },
    sessionId : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('table', tableSchema);