var express = require('express');
var os      = require('os');

var getIp = require('../js/get-ip');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('chat', { title: 'Orderly - Chat', ip: getIp() });
});

module.exports = router;
