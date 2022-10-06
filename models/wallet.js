var mongoose = require('mongoose');

var Schema = mongoose.Schema

var wallet = new Schema(
    {
        email_server: {
            type: String,
            required: true,
            // isLenght: {min: 5}
        },
        password: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true,
            // isLenght: {min: 5}
        }
    }
);

module.exports = mongoose.model('wallet', wallet)
