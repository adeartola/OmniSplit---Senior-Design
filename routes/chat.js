var express = require('express');
var os      = require('os');

var getIp = require('../js/get-ip');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var ip = getIp();
    var host;

    if (req.hostname != ip)
        host = req.hostname;
    else
        host = ip;

    res.render('chat', { title: 'Orderly - Chat', host: 'https://' + host });
});

module.exports = router;
