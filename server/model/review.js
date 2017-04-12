var mongoose = require('mongoose');
var {Resturant} = require('./resturant')

var reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String
    },
    resturant: {
        type: mongoose.Schema.Types.ObjectId, //id of resturant here
        ref: 'Resturant',
        required: true
    }
});

var Review = mongoose.model('Review', reviewSchema);

module.exports = {
    Review: Review
}