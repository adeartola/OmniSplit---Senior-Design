var express    = require('express');
var jwtauth    = require('../js/jwtauth');

var router = express.Router();

/* GET home page. */

router.all('/', jwtauth, function(req, res) {
    res.render('index', { title: 'Welcome to OmniSplit!' });
});

router.all('/login', function(req, res) {
    //TODO: If logged in, redirect to /
    res.render('login', { title: 'OmniSplit - Please Log In', error: req.flash('error') });
});

router.all('/register', function(req, res) {
    res.render('register', { title: 'Register for OmniSplit' });
});

module.exports = router;
