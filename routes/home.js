var express = require('express');
var router = express.Router();


// var user_controller = require("../controllers/usersController");
var user_controller = require('../controllers/usersController')
// var products_ontroller = require('../controllers/productController')
var dashboard_controller = require('../controllers/dashboard')
var admin_dashboard_controller = require('../controllers/adminDashboard')
var authentication = require("../middleware/authmiddleware")
var flexcoin_controller = require('../controllers/flexcoin')
var admin_controller = require('../controllers/adminController')




/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('home', { title: 'Flex Coin' });
// });

// USERS ROUTER

router.get('/', user_controller.index);


router.get("/signUp", user_controller.user_create_get);
router.post("/signUp", user_controller.user_signUp_post);

router.get("/logIn", user_controller.user_login_get);
router.post("/logIn", user_controller.user_login_post);

router.get('/account', authentication, user_controller.account_details);
router.post('/account', authentication, dashboard_controller.submit_post);
// router.get('/myAccount/:id', user_controller.account_details);
router.get('/logOut', user_controller.user_logout_get)
router.get('/user', authentication, user_controller.account_details_json);

// FUND WITH PAYSTACK

router.get('/fund', authentication, dashboard_controller.fund_wallet_get)
router.post('/fund', authentication, dashboard_controller.fund_wallet_post)
router.get('/validate', authentication, dashboard_controller.validatPayment)

router.get('/withdraw', authentication, dashboard_controller.withdraw_naira)
router.get('/withdraw', authentication, dashboard_controller.withdraw_coin)



// FUND WITH FLUTTERWAVE

router.get('/withflutter', authentication, dashboard_controller.fund_with_flutter)
router.post('/withflutter', authentication, dashboard_controller.fund_with_flutter_post)
router.get('/validate_flutter', authentication, dashboard_controller.flutterValidatPayment)
router.get('/flutterPaymentValidate', authentication, dashboard_controller.flutterPaymentValidate)



router.get("/kyc", authentication, user_controller.bvn_get)
router.post("/kyc", authentication, user_controller.bvn_post)

router.get('/dashboard', authentication, dashboard_controller.dashbord_get)

router.get('/airtime', authentication, dashboard_controller.airtime_get)
router.post('/airtime', authentication, dashboard_controller.airtime_post)

router.get('/data', authentication, dashboard_controller.data_get)
router.post('/data', authentication, dashboard_controller.data_post)


router.get('/bitcoin', authentication, dashboard_controller.bitcoin_get)
// router.post('/bitcoin', dashboard_controller.bitcoin_post)


router.get('/bills', authentication, dashboard_controller.bills_get)
router.post('/bills', authentication, dashboard_controller.bills_post)


router.get('/transactions', authentication, dashboard_controller.transaction_get)


router.get('/transfer', authentication, dashboard_controller.transfer_get)
router.post('/transfer', authentication, dashboard_controller.transfer_post)


// router.get('/submit', authentication, dashboard_controller.submit_get)
// router.get('/submit', dashboard_controller.submit_get)



// router.get("/user/resetPassword", user_controller.reset_password_get);
// router.post("/user/resetPassword", user_controller.reset_password_post);

    // ADMIN ROUTE



// router.get("/admin/createAdmin", admin_controller.admin_create_get);
// router.post("/admin/createAdmin", admin_controller.admin_signUp_post);

// router.get("/admin/logIn", admin_controller.admin_login_get);
// router.post("/admin/logIn", admin_controller.admin_login_post);


// router.get('/admin/dashboard', authentication, admin_dashboard_controller.get_admin_dashbord)

// router.get('/myAccount', authentication, user_controller.account_details);
// // router.get('/myAccount/:id', user_controller.account_details);
// router.get('/admin/logOut', admin_controller.admin_logout_get)
// // router.get('/user', authentication, user_controller.account_details_json);
// router.get('/admin/users', authentication, admin_controller.get_all_users);


// router.get('/admin/transfer', authentication, admin_dashboard_controller.admin_transfer_get)
// router.post('/admin/transfer', authentication, admin_dashboard_controller.admin_transfer_post)

// // router.get('/admin/transferValidate', admin_dashboard_controller.flutterValidatTransfer)
router.get('/admin/getBanks', admin_dashboard_controller.get_banks)

// router.get('/mail', user_controller.mail_get)
// router.post('/mail', user_controller.mail_post)


// PRODUCTS ROUTER
// router.get("/products", products_ontroller.products)

// router.get('/myAccount/:id/createProduct', products_ontroller.create_product_get)
// router.post('/myAccount/:id/createProduct', products_ontroller.create_product_post)

// router.get("/myAccount/:id/myProducts", products_ontroller.get_user_product)


// ROUTER HOLDING THE SITE CONTROLLERS

router.get('/contact', flexcoin_controller.contact_get)



module.exports = router;
