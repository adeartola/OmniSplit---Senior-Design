var express = require('express');
var os      = require('os');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('chat', { title: 'Orderly - Chat' });
});

module.exports = router;
