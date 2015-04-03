var User  = require('../models/user');
var debug = require('debug')('omnisplit:jwt');
var jwt = require('jwt-simple');
 
module.exports = function(req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || (req.cookies && req.cookies.token) || req.headers['x-access-token'];

    if (token) {
        try {
            var decoded = jwt.decode(token, req.app.get('jwtTokenSecret'));
                         
            if (decoded.exp <= Date.now()) {
                res.clearCookie('token');
                res.redirect('/login');
            }
            User.findOne({ _id: decoded.iss }, function(err, user) {
                if (user) {
                    req.user = user;
                    return next();
                }
                else {
                    res.clearCookie('token');
                    res.redirect('/login');
                }
            });
        } catch (err) {
            res.clearCookie('token');
            debug(err.stack);
            res.redirect('/login');
        }
    } else {
        return res.redirect('/login'); 
    }
 };
