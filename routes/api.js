var debug      = require('debug')('omnisplit:api');
var express    = require('express');
var passport   = require('passport');
var jwt        = require('jwt-simple');
var Restaurant = require('../models/restaurant');
var User       = require('../models/user');
var Menu       = require('../models/menu');

var router     = express.Router();

router.get('/', function(req, res) {
    res.render('index', { title: 'Orderly' })
});

router.post('/login', function(req, res) {
    if (req.body.email == undefined || req.body.password == undefined)
        return res.status(400).end(JSON.stringify({ status: 400, message: 'Bad request' }) );

    res.setHeader('Content-Type', 'application/json');

    User.findOne({ email: req.body.email }, function(err, user) {
        if (err)
            return res.status(400).end(JSON.stringify({ error: err }) );
        else if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.status(401).end(JSON.stringify({ status: 401, message: 'Invalid email or password' }) );
        }
        else {
            user.comparePassword(req.body.password, function(err, authenticated) {
                if (err) {
                    debug(err.stack);
                    return res.status(400).end(JSON.stringify({ error: err }) );
                }
                else if (authenticated) {
                    var maxAge = 1000 * 10 * 60; //10 minutes
                    var expiration = Date.now() + maxAge;
                    var token = jwt.encode({
                        iss: user.id,
                        exp: expiration
                    }, req.app.get('jwtTokenSecret'));

                    res.cookie('token', token, {
                        path: '/',
                        maxAge: maxAge,
                        expires: expiration,
                        httpOnly: true,
                    }).send(JSON.stringify({
                        token: token,
                        expires: expiration,
                    }) );
                }
                else {
                    req.flash('error', 'Invalid email or password.');
                    return res.status(401).end(JSON.stringify({ status: 401, message: 'Invalid email or password' }) );
                }
            });
        }
    });
});

router.post('/logout', function(req, res) {
    req.logOut();
    res.status(200).send();
});

router.post('/register', function(req, res) {
    //TODO: /api/register POST gives bad gateway response
    if (req.body.email == undefined || req.body.password == undefined)
        return res.status(400).end(JSON.stringify({ status: 400, message: 'Bad request' }) );

    //Add user to database
    res.setHeader('Content-Type', 'application/json');
    var email = req.body.email;
    var password = req.body.password;
    var regex = /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/;

    var valid = regex.test(password);

    if (valid) {
        User.create(new User({ email: email, password: password }), function(err, newUser) {
            if (err) {
                res.status(400);
                return res.end(JSON.stringify({ error: err }) );
            }
            else {
                debug('Added user ' + newUser.email + ' to users');
                var maxAge = 1000 * 10 * 60; //10 minutes
                var expiration = Date.now() + maxAge;
                var token = jwt.encode({
                    iss: user.id,
                    exp: expiration
                }, req.app.get('jwtTokenSecret'));

                return res.json({
                    token: token,
                    expires: expiration,
                    user: user.toJSON()
                });
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

module.exports = router;
