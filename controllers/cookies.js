
exports.set_users_cookies_get('/set-cookies', (req, res) => {

    // res.setHeader('Set-Cookie', 'newUser=true');    
    res.cookie('newUser', false);
    res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
  
    res.send('you got the cookies!');
  
});
  
exports.read_users_cookies_get('/read-cookies', (req, res) => {
  
    const cookies = req.cookies;
    console.log(cookies.newUser);
  
    res.json(cookies);
  
});