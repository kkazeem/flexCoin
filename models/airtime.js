var mongoose = require('mongoose');

var Schema = mongoose.Schema

var Airtime = new Schema(
    {
        country: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 50
        },
        type: {
            type: String,
            required: true
        },
        reference: {
            type: String,
            required: true
        }
        // easybanking_id: [{type: Schema.Types.ObjectId, ref: 'Easybanking'}]
    }
);

module.exports = mongoose.model('Airtime', Airtime)