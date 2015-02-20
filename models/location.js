var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;

var Location = new Schema({
    address: {
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: Number, required: true },
        _id: false
    },
    menu: { type: Schema.Types.ObjectId, ref: 'Menu', required: true },
});

Location.set('redisCache', true);

module.exports = mongoose.model('Location', Location);
