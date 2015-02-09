var debug    = require('debug')('orderly-comms:api');
var express  = require('express');
var passport = require('passport');
var router   = express.Router();
var User     = require('../models/user');
var Menu     = require('../models/menu');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user[1] == req.params.user)
        return next();

    return res.status('403').end(JSON.stringify({ status: '403', message: 'Forbidden' }) );
}

router.get('/', function(req, res) {
    res.render('index', { title: 'Orderly' });
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

router.get('/menu/:id', function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    var id = req.params.id;
    Menu.findById(id, function(err, menu) {
        if (err) {
            res.status(400);
            res.end(JSON.stringify({ error: err }) );
        }
        else if (!menu) {
            res.status(404);
            res.end(JSON.stringify({ status: '404', message: 'Not found' }) );
        }
        else {
            res.end(JSON.stringify(menu));
        }
    });
});

router.get('/populatemenus', function(req, res) {
    res.render('populate', { title: 'Orderly - Reset menus', link: 'populatemenus' });
}).post('/populatemenus', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var menus = [
        new Menu({
            name: 'White Elephant',
            owner: 'jordan.buschman@me.com',
            address: {
                addressLine1: '930 El Camino Real',
                city: 'Santa Clara',
                state: 'CA',
                zip: '95050',
            },
            group: [
                {
                    name: 'Curries',
                    description: 'Served with your choice of protein.',
                    item: [
                        {
                            name: 'Yellow Curry',
                            description: 'Yellow curry paste with coconut milk, potatoes, carrot, and yellow onion.',
                            price: 8.95,
                            step: [
                                {
                                    text: 'Spicy',
                                    required: true,
                                    maxOptions: 1,
                                    option: [
                                        { text: 'Not spicy' },
                                        { text: 'Mild' },
                                        { text: 'Medium' },
                                        { text: 'Spicy' },
                                        { text: 'Very spicy' }
                                    ]
                                }, {
                                    text: 'Make it with',
                                    required: true,
                                    maxOptions: 1,
                                    option: [
                                        { text: 'Chicken' },
                                        { text: 'Vegetable'},
                                        { text: 'Beef', priceModifier: 1.00 }
                                    ]
                                }
                            ]
                        }, {
                            name: 'Panang Curry',
                            description: 'Panang curry paste with coconut milk, zucchini, bell pepper, kaffir.',
                            price: 8.95,
                            step: [
                                {
                                    text: 'Spicy',
                                    required: true,
                                    maxOptions: 1,
                                    option: [
                                        { text: 'Not spicy' },
                                        { text: 'Mild' },
                                        { text: 'Medium' },
                                        { text: 'Spicy' },
                                        { text: 'Very spicy' }
                                    ]
                                }, {
                                    text: 'Make it with',
                                    required: true,
                                    maxOptions: 1,
                                    option: [
                                        { text: 'Chicken' },
                                        { text: 'Vegetable'},
                                        { text: 'Beef', priceModifier: 1.00 }
                                    ]
                                } //Step[1]
                            ] //Step
                        } //Item[1]
                    ] //Item
                } //Group[0]
            ] //Group
        }) //Menu[0]
    ]; //menus

    Menu.remove({}, function(err) {
        if (err) {
            res.status(400);
            res.end(JSON.stringify({ error: err }) );
        }
        else {
            debug('Removed all menus');

            var completedMenus = 0;

            menus.forEach(function(menu, key) {
                menu.save(function(err, newMenu) {
                    if (err) {
                        res.status(400);
                        res.end(JSON.stringify({ error: err }) );
                    }
                    else {
                        debug('Added ' + newMenu.name + ' to menus');
                        completedMenus++;

                        if (completedMenus == menus.length) {
                            res.end(JSON.stringify({
                                message: 'Database reset successfully.',
                                menus: menus
                            }) );
                        }
                    }
                });
            });
        }
    });
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
