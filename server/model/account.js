var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var accountSchema = new mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    }
});

accountSchema.plugin(passportLocalMongoose);
//Schemas are pluggable, that is, they allow for applying pre-packaged capabilities to extend their functionality. 
//Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.

var Account = mongoose.model('Account', accountSchema);

module.exports = {
    Account: Account
}