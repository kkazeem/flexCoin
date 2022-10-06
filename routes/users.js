var express = require('express');
var router = express.Router();


// var user_controller = require("../controllers/usersController");
var user_controller = require('../controllers/usersController')
// var products_ontroller = require('../controllers/productController')
var dashboard_controller = require('../controllers/dashboard')
// var authentication = require("../middleware/authmiddleware")



// USERS ROUTER

router.get('/', dashboard_controller.dashbord_get);


router.get('/myAccount', user_controller.account_details);
// router.get('/myAccount/:id', user_controller.account_details);
router.get('/logOut', user_controller.user_logout_get)

// WALLET FOUNDING ROUTER
// router.get('/fund', authentication, dashboard_controller.fund_wallet_get)
// router.post('/fund', authentication, dashboard_controller.fund_wallet_post)
// router.get('/validate', authentication, dashboard_controller.validatPayment)


router.get("/kyc", user_controller.bvn_get)
router.post("/kyc", user_controller.bvn_post)

router.get('/dashboard', dashboard_controller.dashbord_get)

router.get('/airtime', dashboard_controller.airtime_get)
// router.post('/airtime', dashboard_controller.airtime_post)

router.get('/transfer', dashboard_controller.transfer_get)
router.post('/transfer', dashboard_controller.transfer_post)


router.get('/bitcoin', dashboard_controller.bitcoin_get)
// router.post('/bitcoin', dashboard_controller.bitcoin_post)


router.get('/bills', dashboard_controller.bills_get)
// router.post('/bills', dashboard_controller.transaction_get)


router.get('/transactions', dashboard_controller.transaction_get)
// router.post('/transactions', dashboard_controller.transaction_post)



router.get('/mail', user_controller.mail_get)
router.post('/mail', user_controller.mail_post)


// PRODUCTS ROUTER
// router.get("/products", products_ontroller.products)

// router.get('/myAccount/:id/createProduct', products_ontroller.create_product_get)
// router.post('/myAccount/:id/createProduct', products_ontroller.create_product_post)

// router.get("/myAccount/:id/myProducts", products_ontroller.get_user_product)




module.exports = router;
