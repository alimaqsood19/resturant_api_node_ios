var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


const TOKENTIME = 60 * 60 * 24 * 30 //30 days
const SECRET = process.env.JWT_SECRET

var authenticate = expressJwt({secret: SECRET});
// JWT authentication middleware authenticates callers using a JWT

var generateAccessToken = (req, res, next) => {
    req.token = req.token || {};
    req.token = jwt.sign({
        id: req.user.id,
    }, SECRET, {
        expiresIn: TOKENTIME
    });
    next();
}

var respond = (req, res) => {
    res.status(200).json({
        user: req.user.username,
        token: req.token
    });
}

module.exports = {
    authenticate: authenticate,
    generateAccessToken: generateAccessToken,
    respond: respond
}