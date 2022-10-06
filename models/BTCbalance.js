var mongoose = require('mongoose');

var Schema = mongoose.Schema

var btcBalance = new Schema(
    {
        balance: {
            type: Number,
            required: true,
            // minLength: 1
            default: 0.0
        }
    }
);

module.exports = mongoose.model('btcBalance', btcBalance)
