var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //Allows promises for mongoose methods

mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose: mongoose
};