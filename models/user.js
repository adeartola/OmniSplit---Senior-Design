var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    createdAt: { type: Date, default: new Date() },
    restaurants: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }]
});

User.set('redisCache', true);

User.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

User.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')

module.exports = mongoose.model('User', User);
