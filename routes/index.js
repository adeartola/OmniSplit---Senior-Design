var express    = require('express');
var jwtauth    = require('../js/jwtauth');

var router = express.Router();

/* GET home page. */

router.all('/', jwtauth, function(req, res) {
    res.render('index', { title: 'Welcome to Omnisplit!' });
});

router.all('/login', function(req, res) {
    res.render('login', { title: 'Omnisplit - Please Log In' });
});

module.exports = router;
