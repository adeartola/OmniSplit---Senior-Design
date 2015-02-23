var express = require('express');
var router = express.Router();

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user[1] == req.params.user)
        return next();

    //TODO: Make redirect go somewhere
    return res.status('403').end(JSON.stringify({ status: '403', message: 'Forbidden' }) );
}

/* GET home page. */
router.get('/', isLoggedIn, function(req, res) {
  res.render('index', { title: 'Orderly' });
});

module.exports = router;
