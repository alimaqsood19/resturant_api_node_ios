var mongoose = require('mongoose');

var resturantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

var Resturant = mongoose.model('Resturant', resturantSchema);

module.exports = {
    Resturant: Resturant
}