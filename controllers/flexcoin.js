exports.index = function(req, res) {
    res.render('home', { title: 'Flex Coin' });
};


exports.contact_get = function (req, res) {
    res.render('contact', {title: 'Contact'})
}