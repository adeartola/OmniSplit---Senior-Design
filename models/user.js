var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    email: {type: String, required: true, index: { unique: true } },
});

UserSchema.pre('save', { //Hash password
    var user = this;
    if (!user.isModified('password')) //Only hash the password if it has been modified / is new
        return next();

    //Generate salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err)
            return next(err);    

        //Hash the password with the salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err)
                return next(err);
            
            //Store hash instead of password
            user.password = hash;
            next();
        });
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

module.exports = mongoose.model(User&, UserSchema);
