var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;

function getPrice(num){
    return (num/100).toFixed(2);
}

function setPrice(num){
    return num*100;
}

var Menu = new Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    address: {
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: Number, required: true }
    },
    updated: { type: Date, default: Date.now() },
    group: [{
        name: { type: String, required: true },
        description: String,
        item: [{
            name: { type: String, required: true },
            description: String,
            price: { type: Number, required: true, get: getPrice, set: setPrice }, 
            step: [{
                text: { type: String, required: true },
                required: { type: Boolean, required: true },
                maxOptions: { type: Number, required: true },
                option: [{
                    text: String,
                    priceModifier: { type: Number, default: 0, get: getPrice, set: setPrice } 
                }]
            }]
        }]
    }]
});

module.exports = mongoose.model('Menu', Menu);
