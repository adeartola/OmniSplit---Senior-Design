var express    = require('express');
var jwtauth    = require('../js/jwtauth');

var router = express.Router();

router.get('/tables', function(req, res) {
    res.render('tables');
});

router.get('/orders', function(req, res) {
    res.render('orders');
});

router.get('/dashboard', function(req, res) {
    res.render('dashboard');
});

router.get('/menu', function(req, res) {
    res.render('menu');
});

router.get('/settings', function(req, res) {
    res.render('settings');
});

module.exports = router;
