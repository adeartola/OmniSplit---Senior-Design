var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Welcome to OmniSplit!' });
});

router.get('/dashboard', function(req, res) {
    res.end(JSON.stringify({ response: 200 }) );
});

module.exports = router;
