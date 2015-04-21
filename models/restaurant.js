var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;

var Restaurant = new Schema({
    name: { type: String, required: true },
    backgroundImage: String,
    theme: String,
    description: { type: String, default: '' },
    menu: { type: Schema.Types.ObjectId, ref: 'Menu' },
    address: {
        addressLine1: { type: String, default: '500 El Camino Real' },
        addressLine2: { type: String, default: '' },
        city: { type: String, default: 'Santa Clara' },
        state: { type: String, default: 'CA' },
        zip: { type: Number, default: 95050 },
        _id: false
    },
});

Restaurant.set('redisCache', true);

module.exports = mongoose.model('Restaurant', Restaurant);
