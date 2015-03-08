var User = require('../models/user');
var jwt = require('jwt-simple');
 
 module.exports = function(req, res, next) {
     var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        try {
            var decoded = jwt.decode(token, req.app.get('jwtTokenSecret'));
                         
            if (decoded.exp <= Date.now()) {
                res.redirect('/login');
            }
            User.findOne({ _id: decoded.iss }, function(err, user) {
                req.user = user;
            });
        } catch (err) {
            return next();
        }
    } else {
        res.redirect('/login'); 
    }
 };
