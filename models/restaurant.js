var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;

var Restaurant = new Schema({
    name: { type: String, ref: 'Restaurant' },
    owner: { type: String, required: true },
    description: String,
    restaurants: [{ type: Schema.Types.ObjectId, ref: 'Location' }]
});

Restaurant.set('redisCache', true);

module.exports = mongoose.model('Restaurant', Restaurant);
