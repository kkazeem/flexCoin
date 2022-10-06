var mongoose = require('mongoose');

var Schema = mongoose.Schema

var BitcoinTransaction = new Schema(
    {
        amount: {
            type: Number,
            required: true
        },
        wallet: {
            type: String,
            required: true
        },
        reference: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model('BitcoinTransaction', BitcoinTransaction)