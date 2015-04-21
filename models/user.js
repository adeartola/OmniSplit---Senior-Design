var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var Schema   = mongoose.Schema;

var User = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant' }
});

User.set('redisCache', true);

User.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
}, 'The e-mail field must have a valid email..')

User.pre('save', function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
 
    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err != undefined) return next(err);
          
            // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

User.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', User);
