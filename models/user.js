/*
var mongoose              = require('mongoose');
var bcrypt                = require('bcrypt');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    email: {type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.pre('save', function(next, done) { //Hash password
    var self = this;
    mongoose.models["User"].findOne({email : self.email},function(err, user) {
        if (err) {
            done(err);
        }
        else if (user) {
            self.invalidate("email","email must be unique");
            done(new Error("email must be unique"));
        }
        else {
            //Generate salt
            bcrypt.genSalt(10, function(err, salt) {
                if (err)
                    return next(err);    

                //Hash the password with the salt
                bcrypt.hash(self.password, salt, function(err, hash) {
                    if (err)
                        return next(err);
                    
                    //Store hash instead of password
                    self.password = hash;
                    console.log('NEW: ' + JSON.Stringify(self));
                    done();
                });
            });
            done();
        }
    });
});

UserSchema.methods.comparePassword = function(pass, cb) {
    //Hash password and check against the one in the database
    bcrypt.compare(pass, this.pass, function(err, match) {
        if (err)
            return cb(err);

        cb(null, isMatch);
    });
};

module.exports = mongoose.model("User", UserSchema);
*/
var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
});

User.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

User.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')

module.exports = mongoose.model('User', User);
