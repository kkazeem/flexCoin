var mongoose = require('mongoose');

var Schema = mongoose.Schema

var Bvn = new Schema(
    {
        bvn: {
            type: String,
            required: true
        }
    }
);

module.exports = mongoose.model('Bvn', Bvn)
