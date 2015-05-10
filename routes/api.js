var debug      = require('debug')('omnisplit:api');
var express    = require('express');
var passport   = require('passport');
var jwt        = require('jwt-simple');
var jwtauth    = require('../js/jwtauth');
var redis      = require('redis'); 
var Mongoose   = require('mongoose');
var Restaurant = require('../models/restaurant');
var User       = require('../models/user');
var Menu       = require('../models/menu');

var router     = express.Router();
var client     = redis.createClient();

router.post('/login', function(req, res) {
    if (req.body.email == undefined || req.body.password == undefined)
        return res.status(400).json({ status: 400, message: 'Bad request' });

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
                    return res.status(400).json({ error: err });
                }
                else if (authenticated) {
                    var maxAge = 1000 * 10 * 60; //10 minutes
                    var expiration = Date.now() + maxAge;
                    var token = jwt.encode({
                        iss: user.id,
                        exp: expiration
                    }, req.app.get('jwtTokenSecret'));

                    client.setex(token, 60 * 10, JSON.stringify({ iss: user.id, exp: expiration }) );

                    res.cookie('token', token, {
                        path: '/',
                        maxAge: maxAge,
                        expires: expiration,
                        httpOnly: true,
                    }).json({
                        token: token,
                        expires: expiration,
                    });
                }
                else {
                    req.flash('error', 'Invalid email or password.');
                    res.status(401).json({ message: 'Invalid email or password' });
                }
            });
        }
    });
});

router.post('/logout', function(req, res) {
    try {
        var token = req.cookies.token;
        client.del(token);
        res.clearCookie('token');
    }
    catch (err) {
        debug(err.stack);
    }
    res.status(200).send();
});

router.post('/register', function(req, res) {
    if (req.body.email == undefined || req.body.password == undefined)
        return res.status(400).end(JSON.stringify({ status: 400, message: 'Bad request' }) );

    //Add user to database
    res.setHeader('Content-Type', 'application/json');
    var email = req.body.email;
    var password = req.body.password;
    var regex = /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/;

    var valid = regex.test(password);

    if (valid) {
        var id = Mongoose.Types.ObjectId();
        console.log(id);
        console.log(id);
        User.create(new User({ _id: id, email: email, password: password, restaurant: id}), function(err, newUser) {
            var menuAdded = false, restaurantAdded = false;
            if (err) {
                debug(err.stack);
                res.status(400);
                return res.end(JSON.stringify({ error: err }) );
            }
            else {
                debug('Added user ' + newUser.email + ' to users');
                Restaurant.create(new Restaurant({ _id: id, name: 'My Restaurant', menu: id, address: {}}), function(err, newRestaurant) {
                    if (err) {
                        res.status(400);
                        return res.end(JSON.stringify({ error: err }) );
                    }
                    restaurantAdded = true;
                    debug(JSON.stringify(newRestaurant));
                    debug('Added restaurant to restaurants.');
                    if (restaurantAdded && menuAdded) {
                        var maxAge = 1000 * 60 * 60; //1 hour
                        var expiration = Date.now() + maxAge;
                        var token = jwt.encode({
                            iss: id,
                            exp: expiration
                        }, req.app.get('jwtTokenSecret'));

                        client.setex(token, 60 * 10, JSON.stringify({ iss: id, exp: expiration }) ); //Cache for 10 minutes

                        return res.json({
                            token: token,
                            expires: expiration,
                            user: newUser.toJSON()
                        });
                    }
                }); 
                Menu.create(new Menu({ _id: id, group: [] }), function(err, newMenu) {
                    if (err) {
                        res.status(400);
                        return res.end(JSON.stringify({ error: err }) );
                    }
                    debug(JSON.stringify(newMenu));
                    debug('Added new menu to menus.');
                    menuAdded = true;
                    if (restaurantAdded && menuAdded) {
                        var maxAge = 1000 * 60 * 60; //1 hour
                        var expiration = Date.now() + maxAge;
                        var token = jwt.encode({
                            iss: newUser.id,
                            exp: expiration
                        }, req.app.get('jwtTokenSecret'));

                        client.setex(token, 60 * 10, JSON.stringify({ iss: newUser.id, exp: expiration }) ); //Cache for 10 minutes

                        return res.json({
                            token: token,
                            expires: expiration,
                            user: newUser.toJSON()
                        });
                    }
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

router.post('/userinfo', jwtauth, function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    var decoded = jwt.decode(req.cookies.token, req.app.get('jwtTokenSecret'));

    Restaurant.findOne({ _id: decoded.iss }, 'name address description', function (err, restaurant) {
        if (err)
            return res.status(400).end(JSON.stringify({ error: err.stack }) );

        else if (!restaurant) { //User does not have restauraunt, create it
            debug('Restaurant missing. Creating restaurant for ' + id);
            Restaurant.create(new Restaurant({ _id: id, name: 'My Restaurant', address: {}}), function(err, newRestaurant) {
                if (err)
                    return res.status(400).end(JSON.stringify({ error: err.stack }) );

                return res.json({ address: newRestaurant.address, name: newRestaurant.name, description: newRestaurant.description });
            });
        }
        else {
            return res.json({ address: restaurant.address, name: restaurant.name, description: restaurant.description });
        }
    });
});

router.all('/menuinfo', jwtauth, function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    var decoded = jwt.decode(req.cookies.token, req.app.get('jwtTokenSecret'));
    Menu.findOne({ _id: decoded.iss }, 'group' , function (err, menu) {
            res.end(JSON.stringify(menu));
	});
	
});

router.post('/addCat', jwtauth, function(req, res) {
    res.setHeader('Content-Type', 'text/html');

    var decoded = jwt.decode(req.cookies.token, req.app.get('jwtTokenSecret'));
	console.log(req.body.name);
	Menu.findOneAndUpdate({_id: decoded.iss}, {$push : {group: {name: req.body.name}}}, null, function(err, restaurant) {


        return res.json({ message: 'OK'});
    });

});

router.post('/addItem', jwtauth, function(req, res) {
    res.setHeader('Content-Type', 'text/html');

    var decoded = jwt.decode(req.cookies.token, req.app.get('jwtTokenSecret'));
	console.log(req.body.name);
	Menu.findOneAndUpdate({_id: decoded.iss, 'group.name': 'heller'},{$push: {'group.$.item': {name: req.body.name, price: req.body.price, step: []}}}, null, function(err, restaurant) {


        return res.json({ message: 'OK'});
    });

});




router.post('/changeinfo', jwtauth, function(req, res) {
    res.setHeader('Content-Type', 'text/html');

    if (req.body.name == undefined || req.body.description == undefined)
        return res.status(400).json({ message: 'Bad request' });

    var decoded = jwt.decode(req.cookies.token, req.app.get('jwtTokenSecret'));

    Restaurant.update({ _id: decoded.iss }, { name: req.body.name, description: req.body.description }, null, function(err, restaurant) {
        if (err)
            return res.status(400).json({ error: err.stack }); 

        return res.json({ message: 'OK'});
    });
});

router.post('/changeaddress', jwtauth, function(req, res) {
    res.setHeader('Content-Type', 'text/html');

    if (req.body.address == undefined)
        return res.status(400).json({ message: 'Bad request' });

    req.body.address = JSON.parse(req.body.address);

    var decoded = jwt.decode(req.cookies.token, req.app.get('jwtTokenSecret'));

    Restaurant.update({ _id: decoded.iss }, { address: req.body.address }, null, function(err, restaurant) {
        if (err)
            return res.status(400).json({ error: err.stack }); 

        return res.json({ message: 'OK'});
    });
});


module.exports = router;
