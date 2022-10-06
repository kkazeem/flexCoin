var axios = require('axios');


// var userDetails = (req, res, next) => {

// }

const recipient = (req, res, next) => {
    var url = 'https://api.paystack.co/transferrecipient'
// var form = {
//     type: 'nuban',
//     name: 'Chukwuka Ndubueze Godwill',
//     account_number: '0252377020',
//     bank_code: '035',
//     currency: 'NGN' 
// }

// var formData = JSON.stringify(form);
// const headers = {'Cache-Control': 'no-cache','Authorization': 'Bearer sk_live_1ce10a8355bb8c8880a7a504b7f9b81d85c02b04'}
// const header = {'Cache-Control': 'no-cache','Authorization': 'Bearer sk_test_0fdfa0a78f0eaedb231c73c5c694e99b8926e463'}

    axios.post(url, form = {
        type: 'nuban',
        name: 'Chukwuka Ndubueze Godwill',
        account_number: '0252377020',
        bank_code: '035',
        currency: 'NGN' 
    }, {
        headers: {
            'Cache-Control': 'no-cache',
            'Authorization': 'Bearer sk_live_1ce10a8355bb8c8880a7a504b7f9b81d85c02b04'
        // 'Authorization': 'Bearer sk_test_0fdfa0a78f0eaedb231c73c5c694e99b8926e463'
        }
    }).then(res => {
        // console.log(`STATUS: ${res.status}`)
        // console.log(`BODY: ${JSON.stringify(res.data)}`)
        // console.log(`\n\n BODY: ${JSON.stringify(res.data.data["recipient_code"])}`)
        return JSON.stringify(res.data.data["recipient_code"])
    }).catch(err => {
        return next(err)
    })
}

module.exports = recipient