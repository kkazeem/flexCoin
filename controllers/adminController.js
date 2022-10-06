// var request = require('request')
const nodemailer = require("nodemailer");
// var session = require('express-session')
var axios = require('axios');
var User = require("../models/users");
var {body, validationResult, isEmail} = require("express-validator");
var jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt');
var async = require('async');

exports.index = function(req,res, next) {
    res.render('home')
}


// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};


exports.admin_create_get = function(req, res, next) {
    res.render('signUp_form')
}

exports.admin_signUp_post = [
  
    body("firstName").trim().escape().isLength({min: 3, max: 50}).withMessage("First name required."),
    body("lastName").trim().escape().isLength({min: 3, max: 50}).withMessage("Last name required."),
    body("lastName").trim().escape().isLength({min: 3, max: 50}).withMessage("Last state of residence is required."),
    body("email").trim().escape().isLength({min: 3, max: 50}).withMessage("Email required. And must be valid email."),
    body("password").trim().escape().isLength({min: 6, max: 50}).withMessage("Password must be 6 characters long."),
  
  
    (req, res, next) => {
      const errors = validationResult(req)
    
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('signUp_form', { title: 'Create Account', user: req.body, errors: errors.array()})
        return
  
      }
      else {
        
            var user = new User({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              location: req.body.location,
              email: req.body.email,
              password: req.body.password,
              wallet: {
                nairaBalance: 0.0,
                BTCbalance: 0.0,
                ETHbalance: 0.0
              },
              role: 'admin'
            })

            user.save(function(err, userRole) {
              if (err) { 
                // Error message to display if email has been user
                if (err.code == 11000) {
                  req.flash('message', 'Email Already in use.')
                  res.render('signUp', {title: 'SignUp', user: req.body})
                } else {
                    return next(err)
                }
              }

              if (userRole.role != 'admin') {
                res.redirect('/dashboard')
              } else {
                
              // Data form is valid create a token and redirect to home page.      
                const token = createToken(user._id)
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.cookie('SESSION', user._id, { httpOnly: true, maxAge: maxAge * 1000 });
                res.redirect('/admin/dashboard');
              }

              
            });
        
      }
  }
      
]

exports.admin_login_get = function(req, res, next) {
  res.render('logIn_form')
}


exports.admin_login_post = [

    body("email").trim().escape().isLength({min: 3, max: 50}).withMessage("Email required. And must be valid email."),
    body("password").trim().escape().isLength({min: 6, max: 50}).withMessage("Incorrect email or password."),


    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('logIn_form', { title: 'LogIn', user: req.body, errors: errors.array() });
            return
        }
        else {

          User.findOne({"email": req.body.email}, async function (err, result) {
            if (err) { return next(err); }

            if (result) {
              // Email exist lets compare the request password and the database password
              const auth = await bcrypt.compare(req.body.password, result.password);
              if (auth) {
                  const token = createToken(result._id);
                  if (result.role == 'admin') {
                    // Password Is Correct Set Cookies Then Redirect To Home Page
                    // res.cookie('SESSION', bcrypt.hash(user._id, salt), { httpOnly: true, maxAge: maxAge * 1000 });
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                    res.cookie('SESSION', result._id, { httpOnly: true, maxAge: maxAge * 1000 });
                    res.redirect('/admin/dashboard')
                  } else {
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                    res.cookie('SESSION', result._id, { httpOnly: true, maxAge: maxAge * 1000 });
                    res.redirect('/dashboard')
                  }
              }
              else {
                req.flash("incorrect", "Incorrect Password");
                res.render('logIn_form', { title: 'LogIn', user: req.body })
              }

            }
            // console.log(result)
            // res.end()
          })

        }
    }

]

exports.account_details_json = function (req, res, next) {
  async.parallel({
    user: function(callback) {
      User.findById(req.cookies["SESSION"])
      .exec(callback)
    }
  }, function (err, result) {
    if (err) { return next(err); }

    res.json(result.user)
  })
}

exports.account_details = function (req, res, next) {
  async.parallel({
    user: function(callback) {
      User.findById(req.cookies["SESSION"])
      .exec(callback)
    }
  }, function (err, result) {
    if (err) { return next(err); }

    res.render("account", {title: "My account", user: result.user})
  })
}

exports.bvn_get = function(req, res) {
  res.render('bvn')
}

exports.bvn_post = [
  body('bvn').trim().escape(),//.isLength({min: 10, max: 10}).withMessage('Please enter a valid bvn number.'),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.render('bvn', {title: 'KYC', errors: errors.array()})
      return
    }
    else {
    //   // const url = 'https://api.myidentitypay.com/api/v1/biometrics/merchant/data/verification/bvn_validation'
    //   const url = 'https://jsonplaceholder.typicode.com/posts/1'
    //   // const url = 'https://jsonplaceholder.typicode.com/todos/1'
    //   // request.setHeader = 'x-api-key: N9seTaxh.bCNpaIwd1aaXkgoQK9bITlVGPNwGw1a2'
    //   var form = {'number': req.body.bvn}
    //   var formData = JSON.stringify(form);

    //   request(
    //     {headers: {
    //     'content-type': 'application/json',
    //     // 'x-api-key': 'N9seTaxh.bCNpaIwd1aaXkgoQK9bITlVGPNwGw1a2'
    //     },
    //     url: url,
    //     // body: formData,
    //     method: 'GET'
    //   }, function (err, result, body) {
    //     // if(err) {return next(err);}
    //     if (!err && result.statusCode == 200){

    //       req.flash('message', 'Successful')
    //       console.log(body["title"])
    //       res.render('bvn2', {titile: 'BVN Validation', result: body})          
    //       // res.json(JSON.stringify(body))
    //     }

    //     // res.redirect('/')
    //     // console.log(result)
    //     // var response = JSON.stringify(result)
    //     // res.send(JSON.stringify(result))
    //     // res.json(result.body['bvn_data'].lastName)
    //     // res.json({'FirstName': result.body.firstName,
    //     //             'middleName': result.body.middleName,
    //     //            'lastName': result.body.lastName,
    //     //           'Date': result.body.dateOfBirth})
    //     // res.send(response)
    //   })

    
      const formData = JSON.stringify({
        'name': 'Elo',
        'job': 'Web Dev'
      });

      const url = 'https://reqres.in/api/users'
      axios.post(url, formData).then(response => {
        console.log(`STATUS: ${response.status}`)
        console.log(`STATUS: ${JSON.stringify(response.data)}`)
        // res.render('bvn2', {titile: 'BVN Validation', result: res.data})          
        var resBody = `<a href='/'> home</a> <br><label>Name</label></br><br><input type="bumber" name="bvn" disabled="true" value=${response.data["id"]}>`
          // res.send(JSON.stringify(response.data))
          // res.send(resBody)
        // res.end()
      }).catch(err => {
        console.log(err)
      })
    
    }
  }
]

exports.account_details_put = function (req, res, next) {
  User.findById(req.cookies['SESSION'], function (err, result) {
    if (err) {return next(err);}

    var user = new User({
      _id: req.cookies['SESSION'],
      first_name: result.first_name,
      last_name: result.first_name,
      location: result.first_name,
      email: req.body.email,
      password: result.password
    })

    User.findByIdAndUpdate(req.cookies['SESSION'], user, {}, function (err) {
      if (err) { return next(err); }

      res.redirect('/account')
    })
  })
}

exports.account_details_post = function (req, res, next) {
  User.findById(req.cookies['SESSION'], function (err, result) {
    if (err) {return next(err);}

    var user = new User({
      _id: req.cookies['SESSION'],
      first_name: result.first_name,
      last_name: result.first_name,
      location: result.first_name,
      email: result.email,
      password: req.body.password
    })

    User.findByIdAndUpdate(req.cookies['SESSION'], user, {}, function (err) {
      if (err) { return next(err); }

      res.redirect('/account')
    })
  })
}

exports.admin_logout_get = function (req , res, next) {
             
  // const token = createToken(user._id)
  res.cookie('jwt', '', { maxAge: 1 });
  res.cookie('SESSION', '', { maxAge: 1 });
  res.redirect('/');
}

// exports.reset_password_get = function (req, res) {
//   res.render("resetPassword")
// }

// exports.reset_password_post = [
//   body("email").trim().escape(),

//   (req, res, next) => {
//     User.findOne({"email": req.body.email}).then( function (err, result) {
//       if (err){ return next(err); }
//       if (result) {

//         const output = `
//           <p>You have a new contact request</p>
//           <h3>Contact Details</h3>
//           <ul>  
//           <li>Name: ${req.body.name}</li>
//           <li>Company: "EasyBanking" </li>
//           <li>Email: ""</li>
//           <li>Phone: ${req.body.phone}</li>
//           </ul>
//           <h3>Message</h3>
//           <p>${req.body.message}</p>
//         `;

//         var transporter = nodemailer.createTransport({
//           service: 'gmail',
          
//           auth: {
//               user: 'emmanuelsomadina133@gmail.com',
//               pass: '(emma@133)'
//           }
//         });

//         var mailOptions = {
//           from: 'walex6542@gmail.com',
//           to: req.body.email,
//           subject: 'Reset Password',
//           // text: `HI
          
//           // You requested for password reset click the button to reset your password or cope the link below if not you please ignore the message ${}`,
//           html: output
//         };

//         transporter.sendMail(mailOptions, function(error, info){
//           if (error) {
//           console.log(error);
//           } else {
//           console.log('Email sent: ' + info.response);
  
//             req.flash('message', `A password reset link has been sent to your ${req.body.email}`)
//             res.render('resetPassword')
//           }
//         }); 
    
//       }
//     })
//   }
// ]

exports.get_all_users = function (req, res, next) {
    async.parallel({
        users: function(callback) {
            User.find({})
            .exec(callback)
        }
    }, function (err, result) {
        if (err) { return next(err); }

        res.render('users', {title: 'List Users', users: result.users})
    })
}


exports.mail_get = function(req, res) {
  res.render('mail')
}

exports.mail_post = function(req, res, next) {
  
  body("name").escape().trim().isLength({min: 3}).withMessage('Name requird a min length ')
  body("email").trim().escape().isEmail().withMessage("Please provide a valid email")
  body("phone").trim().escape().isLength({min: 11, max: 11}).withMessage("Please enter a valid phone.")

  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
    <li>Name: ${req.body.name}</li>
    <li>Company: "EasyBanking" </li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  var transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
      type: 'OAuth2',
      user: 'emmanuelsomadina133@gmail.com',
      pass: '(emma@133)',
      // pass: process.env.MAIL_PASSWORD,
      clientId: '611863369618-k5hof8ll9id9btvhs9teh1tusmgkincf.apps.googleusercontent.com', //process.env.OAUTH_CLIENTID,//611863369618-k5hof8ll9id9btvhs9teh1tusmgkincf.apps.googleusercontent.com
      clientSecret: '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', //process.env.OAUTH_CLIENT_SECRET,//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
      refreshToken: '1//042br6qnQ0kt_CgYIARAAGAQSNwF-L9Ir8jwFnLPe7WzZUEwRhrPp14csdKLy4Utuzmw1WirZZ-3Px1EXq4eiYUR1zg1h3u1u8kE'// process.env.OAUTH_REFRESH_TOKEN
    }
    
    // auth: {
    //     user: 'emmanuelsomadina133@gmail.com',
    //     pass: '(emma@133)'
    //     // user: process.env.REACT_APP_EMAIL,
    //     // pass: process.env.REACT_APP_EMAIL_PASS
    // }
  });

  var mailOptions = {
    from: 'emmanuelsomadina133@gmail.com',
    to: 'adewunmioluwadamilola1@gmail.com',
    subject: 'Welcome Bouns',
    // text: `HI
    
    // You requested for password reset click the button to reset your password or cope the link below if not you please ignore the message ${}`,
    html: output
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
    console.log('Email sent: ' + info.response);

    
    }
  })
  req.flash('message', `Thanks we received your mail please email us back if you don't receive your fund wthin 24 hours.`)
  res.render('mail')
}