var https = require('https');

const formData = JSON.stringify({
    'name': 'Elo',
    'job': 'Web Dev'
})

const options = {
    hostname: 'reqres.in',
    path: '/api/users',
    method: 'POST',
    header: {
        'Content-Type': 'application/json'
    }
};

const req = https.request(options,(res) => {
    var data = '';

    console.log('STATUS: ', res.statusCode)

    res.on('data', (chunk) => {
        data += chunk
    })

    res.on('end', () => {
        console.log('BODY: ',JSON.parse(data))
    })
})

req.write(formData);
req.end()




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
    res.send(resBody)
// res.end()
}).catch(err => {
console.log(err)
})