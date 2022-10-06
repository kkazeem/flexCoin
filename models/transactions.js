var mongoose = require('mongoose');

var Schema = mongoose.Schema

var Transacton = new Schema(
    {
        _id: {
            type: String,
            required: true
        },
        userID: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        reference: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            // default: Date.now
            required: true
        },
    }
);

module.exports = mongoose.model('Transaction', Transacton)