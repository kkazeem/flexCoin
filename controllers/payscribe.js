var axios = require ('axios');

config = {
    'method': 'GET',
    'url': 'https://www.nellobytesystems.com/APIBuyAirTime.asp',
    data: {
        // 'UserID': "CK10148228",
        'UserID': "CK100280007",
        // 'APIKey': "V618TYVQ4W4X545EH2722H2J38QIB2IEJ6V5E48F61F7988KU3S7VL1W4IIY22QN",
        'APIKey': "62CI20O1O9IJ33T20034JLC2CSIT8QOHW1A8K8596D2R7POW80Z998O70H1CZD2B",
        'MobileNetwork': "airtel",
        'Amount': 50,
        'MobileNumber': "07086720528"
    }

};

var url = 'https://www.nellobytesystems.com/APIBuyAirTime.asp?UserID=CK10148228&MobileNetwork=airtel&Amount=50&MobileNumber=07086720528&APIKey=V618TYVQ4W4X545EH2722H2J38QIB2IEJ6V5E48F61F7988KU3S7VL1W4IIY22QN',
var url = 'https://www.nellobytesystems.com/APIBuyAirTime.asp?UserID=CK100280007&MobileNetwork=airtel&Amount=50&MobileNumber=07086720528&APIKey=62CI20O1O9IJ33T20034JLC2CSIT8QOHW1A8K8596D2R7POW80Z998O70H1CZD2B',


// axios.get(url, {headers: {
//     'Cache-Control': 'no-cache'
//     })
axios(config)
.then(function (response) {

    console.log(JSON.stringify(response.data));
    // res.end()
})
.catch(function (error) {
    console.log(error.response);
    console.log(error.data);
    // res.end()
});
