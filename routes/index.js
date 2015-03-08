var express    = require('express');
var jwtauth    = require('../js/jwtauth');

var router = express.Router();

/* GET home page. */

router.get('/', jwtauth, function(req, res) {
    res.render('index', { title: 'Welcome to Omnisplit!' });
});

router.get('/login', function(req, res) {
    res.render('login', { title: 'Omnisplit - Please Log In' });
});

router.get('/dashboard', jwtauth, function(req, res) {
    res.end(JSON.stringify({ response: 200 }) );
});

module.exports = router;
