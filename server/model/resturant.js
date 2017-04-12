var mongoose = require('mongoose');
var {Review} = require('./review');

var resturantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    foodtype: {
        type: String
    },
    avgcost: {
        type: Number
    },
    geometry: {
        type: {type: String, default: 'Point'},
        coordinates: [Number]
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

var Resturant = mongoose.model('Resturant', resturantSchema);

module.exports = {
    Resturant: Resturant
}