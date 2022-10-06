var mongoose = require('mongoose');
var { isEmail }  = require('validator')
var bcrypt = require('bcrypt')

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        firstName: {
          type: String,
          required: true
        },
        lastName: {
          type: String,
          required: true
        },
        location: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true,
          unique: true, 
          validate: isEmail
        },
        password: {
          type: String,
          required: true
        },
        wallet: {
          nairaBalance: {
            type: Number,
            required: true
          },
          BTCbalance: {
            type: Number,
            required: true
          },
          ETHbalance: {
            type: Number,
            required: true
          }
        },
        role: {
            type: String,
            required: true
        }
    }

);

// fire a function before doc saved to db
UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// Virtual for users URL
UserSchema
.virtual('url')
.get(function () {
  return '/myAccount/' + this._id;
});


// Virtual for user's NAME
UserSchema
.virtual('name')
.get(function () {
  return this.firstName + " " + this.lastName;
});

module.exports = mongoose.model('EasyBanking', UserSchema);