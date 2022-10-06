const async = require('async');
const axios = require('axios');
const Users = require('../models/users')

const walletFunding = (req, res, next) => {
    const id = req.cookies.SESSION;
    console.log(id)

    async.parallel({
        user: function(callback) {
            Users.findById(id)
            .exec(callback)
        }
    }, function (err, result) {
        if(err) {return next(err); }
            // console.log(`Email: ${result.user.email} Amount: ${req.body.amount}`)
        const url = 'https://api.paystack.co/transaction/initialize';
        axios.post(url, form = {
            // email: 'elo@email.com',
            email: result.user.email,
            first_name: result.user.firstName,
            last_name: result.user.lastName,
            amount: req.body.amount * 100,
            // currency: 'NGN' 
        }, {
            headers: {
                'Cache-Control': 'no-cache',
                // 'Authorization': 'Bearer sk_live_1ce10a8355bb8c8880a7a504b7f9b81d85c02b04'
            'Authorization': 'Bearer sk_test_0fdfa0a78f0eaedb231c73c5c694e99b8926e463'
            }
        }).then(results => {
            console.log(JSON.stringify(results.data))
            res.redirect(results.data.data["authorization_url"])

            return results.data

        }).catch(next)
        // res.render('fund', {title: 'Fund Wallet', user: result.user})
    })

}

module.exports = walletFunding