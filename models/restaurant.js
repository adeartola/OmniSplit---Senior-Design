var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;

var Restaurant = new Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    backgroundImage: String,
    theme: String,
    description: String,
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

Restaurant.set('redisCache', true);

module.exports = mongoose.model('Restaurant', Restaurant);
