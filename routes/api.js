var debug    = require('debug')('orderly-comms:api');
var express  = require('express');
var passport = require('passport');
var st
var router   = express.Router();
var User     = require('../models/user');


router.get('/', function(req, res) {
  res.render('index', { title: 'Orderly' });
});

router.post('/login', passport.authenticate('login'), function(req, res) {
    res.render('index', { title: 'LOGGED IN' });
});

router.post('/register', function(req, res) {
    //Add user to database
    res.setHeader('Content-Type', 'application/json');
    var email = req.body.email;
    var password = req.body.password;
    var regex = /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/;

    var valid = regex.test(password);

    if (valid) {
        User.register(new User({ email: email }), password, function(err, newUser) {
            if (err) {
                res.status(400);
                res.end(JSON.stringify({ error: err }) );
            }
            else {
                debug('Added user ' + newUser.email + ' to users');
                res.status(201);
                res.end(JSON.stringify({ status: '201', message: 'Created' }) );
            }
        });
    }
    else {
        res.status(400);
        res.end(JSON.stringify({
            error: {
                name: 'InvalidPasswordError',
                message: 'Password must have at least 8 characters, including 1 lowercase letter, 1 uppercase letter, and one digit.'
            }
        }) ); 
    }
});

router.get('/populate', function(req, res) {
    res.render('populate', { title: 'Orderly - Populate Database' });
}).post('/populate', function(req, res) {
    //Reset database to default (called from GET /api/populate)
    res.setHeader('Content-Type', 'application/json');

    var users = [
        { email: 'jordan.buschman@me.com', password: 'test' },
        { email: 'jbuschman@scu.edu', password: 'potato' },
    ];
    
    User.remove({}, function(err) {
        if (err) {
            res.status(400);
            res.end(JSON.stringify({ error: err }) );
        }
        else {
            debug('Removed all users');

            var completedUsers = 0;

            users.forEach(function(user, key) {
                User.register(new User({ email: user.email }), user.password, function(err, newUser) {
                    if (err) {
                        res.status(400);
                        res.end(JSON.stringify({ error: err }) );
                    }
                    else {
                        debug('Added ' + newUser.email + ' to users');
                        completedUsers++;

                        if (completedUsers == users.length) {
                            res.end(JSON.stringify({
                                message: 'Database reset successfully.',
                                users: users
                            }) );
                        }
                    }
                });
            });
        }
    });
});

module.exports = router;
