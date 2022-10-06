const Flutterwave = require('flutterwave-node-v3');
// var Airtime = require('../models/airtime')
var mongoose = require('mongoose');
var User = require('../models/users')
var nairaBalance = require('../models/nairaBalance');
var async = require('async');
// const validationResult = require("express-validator");
const { body,validationResult } = require('express-validator');
// const body = require("express-validator");
var axios = require('axios');
var Transactions = require('../models/transactions');

function betweenRandomNumber(min, max) {  

    return Math.floor(
  
      Math.random() * (max - min + 1) + min
  
    )
  
}

exports.get_admin_dashbord = function (req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.cookies["SESSION"])
            .exec(callback)
        },
        transactions: function(callback) {
            Transactions.find({'userID': req.cookies["SESSION"]})
            .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }

        res.render('adminDashboard', {title: "Admin Dashboard", user: results.user, transaction: results.transactions})
    })
}

exports.fund_wallet_get = function (req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.cookies["SESSION"])
            .exec(callback)
        }
    }, function (err, result) {
        if(err) {return next(err); }

        res.render('fund', {title: 'Fund Wallet', user: result.user})
    })
}

exports.fund_wallet_post = [
    body('amount').trim().escape().isLength({min: 1}).withMessage("Please provide a valid amount"),

    (req, res, next) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            res.render('fund', {title: 'Fund Wallet', errors: errors.array()})
            return
        }
        else {

            async.parallel({
                user: function(callback) {
                    User.findById(req.cookies["SESSION"])
                    .exec(callback)
                }
            }, function (err, result) {
                if(err) {return next(err); }

                const url = 'https://api.paystack.co/transaction/initialize';
                axios.post(url, form = {
                    email: result.user.email,
                    first_name: result.user.firstName,
                    last_name: result.user.lastName,
                    amount: req.body.amount * 100,
                    currency: 'NGN',
                    callback_url: "https://flexcoin.herokuapp.com/validate"
                }, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        // 'Authorization': 'Bearer sk_live_1ce10a8355bb8c8880a7a504b7f9b81d85c02b04'
                    'Authorization': 'Bearer sk_test_0fdfa0a78f0eaedb231c73c5c694e99b8926e463'
                    }
                }).then(results => {
                    // console.log(JSON.stringify(results.data))
                    res.redirect(results.data.data["authorization_url"])
                })
            })
        }
    }
]

// const GetUser = userId => {
//     let userData;
//     return User.aggregate([
//       { $match: { _id: mongoose.Types.ObjectId(userId) } },
//       {
//         $project: {
//           _id: 0,
//           firstName: 1,
//           lastName: 1,
//           location: 1,
//           email: 1,
//           password: 1,
//           wallet: {
//             nairaBalance: 1,
//             BTCbalance: 1,
//             ETHbalance: 1
//           }
//         }
//       }
//     ]);
// };

exports.validatPayment = function (req, res, next) {
    var url = `${req.originalUrl}`.split('=')[2]
    const validateURL = `https://api.paystack.co/transaction/verify/${url}`;//g7a8jtx397`//onwyt2t5lf`//sknnlk73me`//`

    axios.get(validateURL, {headers: {
        'Cache-Control': 'no-cache',
        // 'Authorization': 'Bearer sk_live_1ce10a8355bb8c8880a7a504b7f9b81d85c02b04'
        'Authorization': 'Bearer sk_test_0fdfa0a78f0eaedb231c73c5c694e99b8926e463'
        }
    }).then(check => {

        var transaction = new Transactions({
            _id: `${check.data.data["id"]}`,
            userID: req.cookies["SESSION"],
            type: 'Naira',
            amount: check.data.data["amount"] / 100,
            reference: check.data.data["reference"],
            date: check.data.data["created_at"]
        })
            
        transaction.save(function (err, balance) {
            if(err) { 
                // Check if transaction ID have been save before payment
                if (err.code === 11000) {
                    req.flash('saveTransactionError', 'Invalid transaction ID');
                    res.redirect('/admin/dashboard')
                    return
                } else {
                    return next(err);
                }
            }        
            User.findById(req.cookies['SESSION'], function (err, result) {
                if(err) { return next(err); }

                var newBalance = new User({
                    _id: req.cookies['SESSION'],
                    firstName: result.firstName,
                    lastName: result.lastName,
                    location: result.location,
                    email: result.email,
                    password: result.password,
                    wallet: {
                        nairaBalance: result.wallet.nairaBalance + balance.amount,
                        BTCbalance: result.wallet["BTCbalance"],
                        ETHbalance: result.wallet["ETHbalance"]
                    }
                })
                
                User.findByIdAndUpdate(req.cookies["SESSION"], newBalance, {}, function (err) {
                    if(err) { return next(err);}

                    req.flash('paymentSuccess', 'Payment successful');       
                    res.redirect('/admin/dashboard')
                })
            })
            
        })
        
    }).catch(function (error) {
        if (error.response) {
            
            // payment wasn't successful flash error message and redirect to dashboard
            req.flash('paymentError', 'Payment error please contact our support if you where debited.')
            res.redirect("/dashboard")
        }
    })
    
}

exports.fund_with_flutter = function (req, res) {
    res.render('fund')
}

exports.fund_with_flutter_post = [
    body('amount').trim().escape().isLength({ min: 100 }).withMessage('Wallet funding required a minimum of 100'),
    // body('currency').trim().escape().withMessage('Currency is required.'),

    (req, res, next) => {
            
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            console.log(errors.array())
            res.status(422).render('fund', {title: 'Fund With Flutter', user: req.body, errors: errors.array() })
            return;
        } else {
            User.findById(req.cookies['SESSION'], function(err, user) {
                if (err) { return next(err); }

                const hexStr = betweenRandomNumber(1000000000, 9999999999)
                const reference = hexStr.toString(16)
                config = {
                    'method': 'POST',
                    'url': 'https://api.flutterwave.com/v3/payments',
                    'headers': {
                        'Authorization': 'Bearer FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X', //FLWSECK-723f350ac84aa0d8aef922fd34b7bbb4-X FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        tx_ref: reference,
                        amount: req.body.amount,
                        currency: "NGN",
                        redirect_url: "https://webhook.site/d7ecb680-5331-4cb5-8560-be52b5210339",
                        customer: {
                            email: user.email,
                            phonenumber: user.phoneNumber,
                            name: user.firstName+" "+user.lastName
                        },
                        customizations: {
                            title: "Pied Piper Payments",
                            logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png"
                        }
                    }
    
                };
    
                axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                    res.redirect(response.data.data['link'])
                })
                .catch(function (error) {
                    console.log(error.response);
                    console.log(error.data);
                    res.end()
                });
            })
        }
    }
]

exports.flutterValidatPayment = function (req, res, next) {
    // Install with: npm i flutterwave-node-v3

    const Flutterwave = require('flutterwave-node-v3');

    const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
    var transaction_id = `${req.originalUrl}`.split('=')[3]
    flw.Transaction.verify({ id: req.query.transaction_id })
        .then(response => {
            console.log(response, response.data);
            if (
                response.data.status === "successful"
                && response.data.processor_response === "Approved"
                && response.status === "success") {

                    var transaction = new Transactions({
                        _id: `${response.data["id"]}`,
                        userID: req.cookies["SESSION"],
                        type: 'Naira',
                        amount: response.data["amount"] / 100,
                        reference: response.data["flw_ref"],
                        date: response.data["created_at"]
                    })
                        
                    transaction.save(function (err, balance) {
                        if(err) { 
                            // Check if transaction ID have been save before payment
                            if (err.code === 11000) {
                                req.flash('saveTransactionError', 'Invalid transaction ID');
                                res.redirect('/admin/dashboard')
                                return
                            } else {
                                return next(err);
                            }
                        }        
                        User.findById(req.cookies['SESSION'], function (err, result) {
                            if(err) { return next(err); }
            
                            var newBalance = new User({
                                _id: req.cookies['SESSION'],
                                firstName: result.firstName,
                                lastName: result.lastName,
                                location: result.location,
                                email: result.email,
                                password: result.password,
                                wallet: {
                                    nairaBalance: result.wallet.nairaBalance + balance.amount,
                                    BTCbalance: result.wallet["BTCbalance"],
                                    ETHbalance: result.wallet["ETHbalance"]
                                }
                            })
                            
                            User.findByIdAndUpdate(req.cookies["SESSION"], newBalance, {}, function (err) {
                                if(err) { return next(err);}
                                
                                // Success! Confirm the customer's payment
                                req.flash('paymentSuccess', 'Payment successful');       
                                res.redirect('/dashboard')
                            })
                        })
                    })
            } else {
                // Inform the customer their payment was unsuccessful
                req.flash('flutterError', 'Payment error please contact our support if you where debited.');
                res.redirect('/dashboard')
            }
        }).catch(next);


}

exports.airtime_get = function(req, res) {
    res.render('airtime', {title: 'Airtime'})
}


exports.airtime_post = [
    // body('phoneNumber').trim().escape(),
    body('amount').trim().escape().isLength({min: 50}).withMessage('Please enter a valid amount.'),

    (req, res, next) => {
        // const errors = validationResult(req);

        // if (!errors.isEmpty()) {
        //     res.render('airtime', {title: 'Airtime', bill: req.body, errors: errors.array()})
        // } else {
            User.findById(req.cookies['SESSION'], function (err, result) {
                console.log(result)
                if (err) { return next(err); }

                if (req.body.amount > result.wallet['nairaBalance']) {
                    req.flash('airtimeError', 'Insufficient found please credit your wallet(Naira Wallet) to continue.');
                    res.status(422).render('airtime', {title: 'Airtime', bill: req.body})
                } else {
                    var config = {
                    'method': 'POST',
                    'url': 'https://api.flutterwave.com/bills',
                    'headers': {
                        'Authorization': 'Bearer FLWSECK-723f350ac84aa0d8aef922fd34b7bbb4-X', //FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X',
                        'Content-Type': 'application/json'
                    },
                        data: {
                        country: 'NG',
                        customer: req.body.phoneNumber, //'+23490803840303',
                        amount: req.body.amount, //'500',
                        recurrence: 'ONCE',
                        type: 'AIRTIME',
                        reference: '9300049404444'
                        // biller_name: 'DSTV, MTN VTU, TIGO VTU, VODAFONE VTU, VODAFONE POSTPAID PAYMENT'
                        // callback_url: "https://flexcoin.herokuapp.com/dashboard"
                        
                    }

                    };

                    axios(config)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        res.redirect('/admin/dashboard')

                    })
                    .catch(function (error) {
                        console.log(error.response);
                        console.log(error.data);
                        res.end()
                    });

                    // });

                }
            })
        // }
    }
]

exports.bitcoin_get = function (req, res) {
    res.render('bitcoin')
}

exports.bills_get = function (req, res) {
    res.render('bills', {title: 'Bills'})
}

exports.bills_post = [
    body('customer').trim().escape(),
    body('amount').trim().escape().isLength({min: 50}).withMessage('Please enter a valid amount.'),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('bills', {title: 'Bills', bill: req.body, errors: errors.array()})
            return;
        } else {
            User.findById(req.cookies['SESSION'], function (err, result) {
                if (err) { return next(err); }

                if (result.wallet['nairaBalance'] < req.body.amount) {
                    req.flash('transferError', 'Insufficient found please credit your wallet(Naira Wallet) to continue.');
                    res.render('bills', {title: 'Bills', bill: req.body})
                } else {
                    var config = {
                    'method': 'POST',
                    'url': 'https://api.flutterwave.com/bills',
                    'headers': {
                        'Authorization': 'Bearer FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X',
                        'Content-Type': 'application/json'
                    },
                        data: {
                        country: 'NG',
                        customer: req.body.customer, //'+23490803840303',
                        amount: req.body.amount, //'500',
                        recurrence: 'ONCE',
                        type: 'AIRTIME',
                        reference: '9300049404444'
                        // biller_name: 'DSTV, MTN VTU, TIGO VTU, VODAFONE VTU, VODAFONE POSTPAID PAYMENT'
                        // callback_url: "https://flexcoin.herokuapp.com/dashboard"                        
                    }

                    };

                    axios(config)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        res.redirect('/admin/dashboard')

                    })
                    .catch(function (error) {
                    console.log(error);
                    });

                    // });

                }
            })
        }
    }
]

exports.data_get = function (req, res) {
    res.render('data')
}


exports.data_post = [
    body('phoneNumber').trim().escape(),
    body('amount').trim().escape().isLength({min: 50}).withMessage('Please enter a valid amount.'),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('bills', {title: 'Bills', bill: req.body, errors: errors.array()})
            return;
        } else {
            User.findById(req.cookies['SESSION'], function (err, result) {
                if (err) { return next(err); }

                if (result.wallet['nairaBalance'] < req.body.amount) {
                    req.flash('transferError', 'Insufficient found please credit your wallet(Naira Wallet) to continue.');
                    res.render('bills', {title: 'Bills', bill: req.body})
                } else {
                    var config = {
                    'method': 'POST',
                    'url': 'https://api.flutterwave.com/bills',
                    'headers': {
                        'Authorization': 'Bearer FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X',
                        'Content-Type': 'application/json'
                    },
                        data: {
                        country: 'NG',
                        customer: req.body.customer, //'+23490803840303',
                        amount: req.body.amount, //'500',
                        recurrence: 'ONCE',
                        type: 'DATA',
                        reference: '9300049404444'
                        // biller_name: 'DSTV, MTN VTU, TIGO VTU, VODAFONE VTU, VODAFONE POSTPAID PAYMENT'
                        // callback_url: "https://flexcoin.herokuapp.com/dashboard"
                        
                    }

                    };

                    axios(config)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        res.redirect('/admin/dashboard')

                    })
                    .catch(function (error) {
                    console.log(error);
                    });

                    // });

                }
            })
        }
    }
]

exports.transaction_get = function (req, res, next) {
    async.parallel({
        transaction: function (callback) {
            Transactions.find({"userID": req.cookies["SESSION"]})
            .exec(callback)
        } 
    }, function(err, results) {
        if (err) { return next(err)}

        console.log(results.user, req.cookies["SESSION"])
        res.render('transaction', {title: 'Transactions', transaction: results.transaction })
    })
}

exports.admin_transfer_get = function (req, res) {
    const paystackURL = "https://api.paystack.co/balance";

    axios.get(paystackURL, {
        headers: {
            'Cache-Control': 'no-cache',
            'Authorization': 'Bearer sk_live_1ce10a8355bb8c8880a7a504b7f9b81d85c02b04'
            // 'Authorization': 'Bearer sk_test_0fdfa0a78f0eaedb231c73c5c694e99b8926e463'
        }
    }).then(PaystackResponse => {
        const flutterURL = "https://api.flutterwave.com/v3/balances"
        axios.get(flutterURL, {
            headers: {
                'Cache-Control': 'no-cache',
                // 'Authorization': 'Bearer FLWSECK-723f350ac84aa0d8aef922fd34b7bbb4-X'// FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X',
                // 'Authorization': 'Bearer FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X', //FLWSECK-723f350ac84aa0d8aef922fd34b7bbb4-X FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X',
                'Authorization': 'Bearer FLWSECK-4cbac34194c07e10bf8a7d465c7b0130-X'
            }
        }).then(FlutterResponse => {
            User.findById(req.cookies["SESSION"], function (err, user) {
                if (err) { return next(err); }

                res.render("adminTransfer", {title: "Make Transfer", user: user, PaystackBalance: PaystackResponse.data.data[0], FlutterBalance: FlutterResponse.data.data[0]})
            })
        }).catch(error => {
            if (error) {
                console.log(error.response)
                console.log(error.status)
                console.log(error.data)
                
                res.end()
            }
        })
    }).catch(error => {
        if (error) {
            console.log(error.response)
            console.log(error.status)
            console.log(error.data)
            
            res.end()
        }
    })
}

exports.admin_transfer_post = function(req, res, next) {
    User.findById(req.cookies['SESSION'], function (err, result) {
        if (err) {return next(err); }

        if (req.body.paywith == "Paystack".toLocaleLowerCase()) {
            var url = 'https://api.paystack.co/transferrecipient'
    
            axios.post(url, form = {
                type: 'nuban',
                name: req.body.name, //'Chukwuka Ndubueze Godwill',
                account_number: req.body.account_number, //'0252377020',
                bank_code: '035',
                currency: 'NGN' 
            }, {
                headers: {
                    'Cache-Control': 'no-cache',
                'Authorization': 'Bearer sk_test_0fdfa0a78f0eaedb231c73c5c694e99b8926e463'
                }
            }).then(function (result) {
                console.log(result.data.data["recipient_code"])
                // if (err) {return next(err); }
                var transfer_url = 'https://api.paystack.co/transfer'
                
                axios.post(transfer_url, form = {
                    source: 'balance',
                    amount: 50,
                    recipient: result.data.data["recipient_code"],
                    reason: 'Birthday flexing'
                }, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Authorization': 'Bearer sk_test_0fdfa0a78f0eaedb231c73c5c694e99b8926e463'
                        // 'Authorization': 'Bearer sk_live_1ce10a8355bb8c8880a7a504b7f9b81d85c02b04'
                    }
                }).then(function(data) {
                    console.log(data.data)

                    res.json(data.data)
                }).catch(error => {
                    console.log(error.response)
                    console.log(error.data)
                    res.end()
                })
            }).catch(error => {
                console.log(error.response)
                console.log(error.data)
                res.end()
            })
        } else if (req.body.paywith == "Flutterwave".toLocaleLowerCase()) {
            
            const url = "https://api.flutterwave.com/v3/transfers" 

            const hexStr = betweenRandomNumber(1000000000, 9999999999)
            const reference = hexStr.toString(16);
            
            axios.post(url, form = {
                "account_bank": req.body.bank_code, //"044",
                "account_number": req.body.account_number,//"0690000040",
                "amount": req.body.amount,
                "narration": "Nomal tranfsfer Testing", //"Business Transfer",
                "currency": "NGN",
                "reference": reference,
                "callback_url": "https://webhook.site/d250e687-75b3-4cbc-9efc-55eeac24b01b",
                // "callback_url": "https://treaders.herokuapp.com/admin/transferValidate",
                "debit_currency": "NGN"
            }, {
                headers: {
                    'Cache-Control': 'no-cache',
                    // 'Authorization': 'Bearer FLWSECK-723f350ac84aa0d8aef922fd34b7bbb4-X' // FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X',
                    // 'Authorization': 'Bearer FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X', //FLWSECK-723f350ac84aa0d8aef922fd34b7bbb4-X FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X',
                'Authorization': 'Bearer FLWSECK-4cbac34194c07e10bf8a7d465c7b0130-X'
                }
            }).then(function (result) {
                console.log(result.data)
                const transferURL = `https://api.flutterwave.com/v3/transfers/${result.data.data.id}`
                // console.log(req.body)

                axios.get(transferURL, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Authorization': 'Bearer FLWSECK-4cbac34194c07e10bf8a7d465c7b0130-X'
                        // 'Authorization': 'Bearer FLWSECK-723f350ac84aa0d8aef922fd34b7bbb4-X' // FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X',
                        // 'Authorization': 'Bearer FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X' //FLWSECK-723f350ac84aa0d8aef922fd34b7bbb4-X FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X',

                    }
                }).then(response => {
                    console.log(response.data)


                    req.flash("transferResponse", response.data.data["complete_message"])
                    res.redirect("/admin/dashboard")
                }).catch(error => {
                    console.log(error.data)
                    console.log(error.response)
                    res.end()
                })

                // res.redirect("/admin/da")
            }).catch(error => {
                console.log(error.response)
                console.log(error.data)
                res.end()
            })
        } else {
            if (result.wallet['nairaBalance'] < req.body.amount) {
                // Balance is not up to the amount entered redirect TRANSFER with an error message.
                req.flash('transferError', 'Insufficient fund please credit your wallet(Naira Wallet) to continue.');
                res.render('transfer', {title: 'Naira Transfer', user: req.body})
            } else {
                var url = 'https://api.paystack.co/transferrecipient'
        
                axios.post(url, form = {
                    type: 'nuban',
                    name: req.body.name, //'Chukwuka Ndubueze Godwill',
                    account_number: req.body.account_number, //'0252377020',
                    bank_code: '035',
                    currency: 'NGN' 
                }, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Authorization': 'Bearer sk_test_0fdfa0a78f0eaedb231c73c5c694e99b8926e463'
                    }
                }).then(function (result) {
                    console.log(result.data.data["recipient_code"])
                    // if (err) {return next(err); }
                    var transfer_url = 'https://api.paystack.co/transfer'
                    
                    axios.post(transfer_url, form = {
                        source: 'balance',
                        amount: 50,
                        recipient: result.data.data["recipient_code"],
                        reason: 'Birthday flexing'
                    }, {
                        headers: {
                            'Cache-Control': 'no-cache',
                            'Authorization': 'Bearer sk_test_0fdfa0a78f0eaedb231c73c5c694e99b8926e463'
                        }
                    }).then(function(data) {
                        console.log(data.data)
    
                        res.json(data.data)
                    }).catch(error => {
                        console.log(error.response)
                        console.log(error.data)
                        res.end()
                    })
                }).catch(next)
            }
        }
        
    })
    
    
}

exports.get_banks = function (req, res) {
    var request = require('request');
        var options = {
        'method': 'GET',
        'url': 'https://api.flutterwave.com/v3/banks/THAI',
        'headers': {
            'Authorization': 'Bearer FLWSECK_TEST-SANDBOXDEMOKEY-X'
        }
        };
        request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        res.json(response.data)
});

}

// exports.flutterValidatTransfer = function (req, res, next) {
//     // const transferURL = "https://api.flutterwave.com/v3/transfers/34071962" //,34054408"
//     // const transferURL = `https://api.flutterwave.com/v3/transfers/${req.body.id}`
//     const transferURL = "https://api.flutterwave.com/v3/banks/:country"
//     console.log(req.body)

//     axios.get(transferURL, {
//         headers: {
//             'Cache-Control': 'no-cache',
//             // 'Authorization': 'Bearer FLWSECK-4cbac34194c07e10bf8a7d465c7b0130-X'
//             'Authorization': 'Bearer FLWSECK-723f350ac84aa0d8aef922fd34b7bbb4-X' // FLWSECK_TEST-b5b37ac39c39b572b6f620a04884d5cf-X',

//         }
//     }).then(response => {
//         console.log(response.data)

//         res.redirect("/admin/dashboard")
//     }).catch(error => {
//         console.lo(error.data)
//         res.end()
//     })
// }

exports.get_all_users = function (req, res, next) {
    async.parallel({
        users: function(callback) {
            User.find({})
            .exec(callback)
        }
    }, function (err, result) {
        if (err) { return next(err); }

        res.render('users', {title: 'My Users', users: result.users})
    })
}