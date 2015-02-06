var LocalStrategy = require('passport-local').Strategy;
var User          = require('../models/user');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function(email, password, done) {
        User.findOne({ email: email }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, { message: 'Incorrect username or password.' });
            user.authenticate(password, function(err, validUser) {
                if (err)
                    return done(err);
                if (!validUser)
                    return done(null, false, { message: 'Incorrect username or password.' });
                return done(null, validUser);
            });
        });
    }) );
};
