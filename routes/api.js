var debug      = require('debug')('omnisplit:api');
var express    = require('express');
var passport   = require('passport');
var router     = express.Router();
var Restaurant = require('../models/restaurant');
var User       = require('../models/user');
var Menu       = require('../models/menu');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user[1] == req.params.user)
        return next();

    return res.status('403').end(JSON.stringify({ status: '403', message: 'Forbidden' }) );
}

router.get('/', function(req, res) {
    res.render('index', { title: 'Orderly' })
});

router.use('/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

router.post('/login', passport.authenticate('login'), function(req, res) {
    res.render('index', { title: 'LOGGED IN' });
});

router.post('/logout', function(req, res) {
    req.logOut();
    res.status(200).send();
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
                return res.end(JSON.stringify({ error: err }) );
            }
            else {
                debug('Added user ' + newUser.email + ' to users');
                res.status(201);
                return res.end(JSON.stringify({ status: '201', message: 'Created' }) );
            }
        });
    }
    else {
        res.status(400);
        return res.end(JSON.stringify({
            error: {
                name: 'InvalidPasswordError',
                message: 'Password must have at least 8 characters, including 1 lowercase letter, 1 uppercase letter, and one digit.'
            }
        }) ); 
    }
});

router.get('/menu/:id', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) { //Not valid id, so respond with 404
        res.status(404);
        return res.end(JSON.stringify({ status: '404', message: 'Not found' }) );
    }

    var stream = Menu.find({ _id: id }, function(err, menu) {
        if (err) {
            res.status(400);
            return res.end(JSON.stringify({ error: err }) );
        }
        if (!menu || menu == '') {
            res.status(404);
            return res.end(JSON.stringify({ status: '404', message: 'Not found' }) );
        }
    })
    .setOptions({ lean: true })
    .stream({ transform: JSON.stringify })
    .pipe(res);

    stream.on('error', function(err) {
        res.status(400);
        return res.end(JSON.stringify({ error: err }) );
    });
});

router.get('/restaurant/:id', function(req,res) {
    res.setHeader('Content-Type', 'application/json');
    var id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) { //Not valid id, so respond with 404
        res.status(404);
        return res.end(JSON.stringify({ status: '404', message: 'Not found' }) );
    }

    var stream = Restaurant.find({ _id: id }, function(err, restaurant) {
        if (err) {
            res.status(400);
            return res.end(JSON.stringify({ error: err }) );
        }
        if (!restaurant || restaurant == '') {
            res.status(404);
            return res.end(JSON.stringify({ status: '404', message: 'Not found' }) );
        }
    })
    .setOptions({ lean: true })
    .stream({ transform: JSON.stringify })
    .pipe(res);
});

router.get('/restaurants', function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    Restaurant.find({}, function(err, restaurants) {
        if (err) {
            res.status(400);
            return res.end(JSON.stringify({ error: err }) );
        }
        if (!restaurants || restaurants.length == 0) {
            res.status(404);
            return res.end(JSON.stringify({ status: '404', message: 'Not found' }) );
        }
        res.end(JSON.stringify(restaurants));
    })
});

router.get('/populateusers', function(req, res) {
    res.render('populate', { title: 'Orderly - Reset users', link: 'populateusers' });
}).post('/populateusers', function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    var users = [
        { email: 'jordan.buschman@me.com', password: 'test' },
        { email: 'jbuschman@scu.edu', password: 'potato' },
    ];
    User.remove({}, function(err) {
        if (err) {
            res.status(400);
            return res.end(JSON.stringify({ error: err }) );
        }
        else {
            debug('Removed all users');

            var completedUsers = 0;

            users.forEach(function(user, key) {
                User.register(new User({ email: user.email }), user.password, function(err, newUser) {
                    if (err) {
                        res.status(400);
                        return res.end(JSON.stringify({ error: err }) );
                    }
                    else {
                        debug('Added ' + newUser.email + ' to users');
                        users[key]._id = newUser.id;
                        completedUsers++;

                        if (completedUsers == users.length) {
                            return res.end(JSON.stringify({
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
