var mongoose = require('mongoose');

var Schema = mongoose.Schema

var ETHbalance = new Schema(
    {
        balance: {
            type: Number,
            required: true,
            default: 0.0
            // minLength: 1
        }
    }
);

module.exports = mongoose.model('ETHbalance', ETHbalance)
