var mongoose = require('mongoose');

var Schema = mongoose.Schema

var nairaBalance = new Schema(
    {
        balance: {
            type: Number,
            required: true,
            default: 0.0
            // minLength: 1
        }

    }
);

module.exports = mongoose.model('nairaBalance', nairaBalance)
