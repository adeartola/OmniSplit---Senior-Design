var express    = require('express');
var jwtauth    = require('../js/jwtauth');
var jwt        = require('jwt-simple');

var router = express.Router();

/* GET home page. */

router.all('/', jwtauth, function(req, res) {
    var token = jwt.decode(req.cookies.token, req.app.get('jwtTokenSecret'));
    res.render('index', { title: 'Welcome to OmniSplit!', id: token.iss });
});

router.all('/login', function(req, res) {
    //TODO: If logged in, redirect to /
    res.render('login', { title: 'OmniSplit - Please Log In', error: req.flash('error') });
});

router.all('/register', function(req, res) {
    res.render('register', { title: 'Register for OmniSplit' });
});

module.exports = router;
