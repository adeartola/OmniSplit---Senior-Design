var User  = require('../models/user');
var debug = require('debug')('omnisplit:jwt');
var jwt   = require('jwt-simple');
var redis = require('redis'); 

module.exports = function(req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || (req.cookies && req.cookies.token) || req.headers['x-access-token'];

    var client = redis.createClient();

    if (token) {
        try {
            var decoded = jwt.decode(token, req.app.get('jwtTokenSecret'));
                         
            if (decoded.exp <= Date.now()) {
                res.clearCookie('token');
                client.del(token);
                if (req.method == 'GET')
                    res.redirect('/login');
                else
                    res.status(403).json({ message: 'Forbidden' });
            }
            client.get(token, function(err, result) {
                if (err) {
                    res.clearCookie('token');
                    client.del(token);
                    debug(err.stack);
                    if (req.method == 'GET')
                        res.redirect('/login');
                    else
                        res.status(403).json({ message: 'Forbidden' });
                }
                else if (result) { //Cookie is cached
                    var obj = JSON.parse(result);
                    if (obj.iss == decoded.iss && obj.exp == decoded.exp) {
                        client.setex(token, 60 * 10, result);
                        return next();
                    }
                    else { //Invalid cookie
                        res.clearCookie('token');
                        client.del(token);
                        if (req.method == 'GET')
                            res.redirect('/login');
                        else
                            res.status(403).json({ message: 'Forbidden' });
                    }
                }
                else { //Not cached, look for user in database
                    User.findOne({ _id: decoded.iss }, function(err, user) {
                        if (user) {
                            client.setex(token, 60 * 10, JSON.stringify({ iss: decoded.iss, exp: decoded.exp }) );
                            return next();
                        }
                        else { //Not found in database
                            res.clearCookie('token');
                            client.del(token);
                            if (req.method == 'GET')
                                res.redirect('/login');
                            else
                                res.status(403).json({ message: 'Forbidden' });
                        }
                    });
                }
            });
        } catch (err) { //Token parsing probably failed
            res.clearCookie('token');
            client.del(token);
            debug(err.stack);
            if (req.method == 'GET')
                res.redirect('/login');
            else
                res.status(403).json({ message: 'Forbidden' });
        }
    } else {
        if (req.method == 'GET')
            return res.redirect('/login'); 
        else
            res.status(403).json({ message: 'Forbidden' });
    }
 };
