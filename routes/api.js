var debug   = require('debug')('orderly-comms:api');
var express = require('express');
var router  = express.Router();
var User    = require('../models/user');


router.get('/', function(req, res) {
  res.render('index', { title: 'Orderly' });
});

router.get('/populate', function(req, res) {
    res.render('index', { title: 'Orderly' });
}).post('/populate', function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    var users = [
        { email: 'jordan.buschman@me.com', password: 'test' },
        { email: 'jbuschman@scu.edu', password: 'potato' },
    ];
    
    User.remove({}, function(err) {
        if (err) {
            res.status(400);
            res.end(JSON.stringify({ error: err }));
        }
        else {
            debug('Removed all users');

            var usersAdded = [];
            var completedUsers = 0;

            users.forEach(function(user, key) {
                User.register(new User({ email: user.email }), user.password, function(err, tu) {
                    if (err) {
                        res.status(400);
                        res.end(JSON.stringify({ error: err }));
                    }
                    else {
                        debug('Added ' + tu.email + ' to users');
                        usersAdded.push(tu);
                        completedUsers++;

                        if (completedUsers == users.length) {
                            res.end(JSON.stringify({ users: usersAdded }));
                        }
                    }
                });
            });
        }
    });
});

module.exports = router;
