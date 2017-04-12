require('./config/config.js'); //Setting proces.env variables
var {mongoose} = require('./db/mongoose.js'); //Setting up connection

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var {Resturant} = require('./model/resturant.js');
var {ObjectID} = require('mongodb');
var {Review} = require('./model/review.js');
var {Account} = require('./model/account.js');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var {generateAccessToken, respond, authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT; 

app.server = http.createServer(app);

app.use(bodyParser.json({
    limit: '100kb' //limits data sent by client to 100kilobytes
}));

//passport config
app.use(passport.initialize());
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    Account.authenticate()
));
//If authentication succeeds, session established maintained via cookie maintains login session
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.get('/', (req,res) => {
    res.send('Hello World');
});

app.post('/resturant/add', authenticate,  (req, res) => {
    var newRest = new Resturant();
        newRest.name = req.body.name,
        newRest.foodtype = req.body.foodtype,
        newRest.avgcost = req.body.avgcost,
        newRest.geometry.coordinates = req.body.geometry.coordinates

    newRest.save().then((resturant) => {
        res.send(resturant);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/resturant', (req, res) => {
    Resturant.find().then((resturants) => {
        res.send(resturants)
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/resturant/:id', (req, res) => {
    var id = req.params.id;

    Resturant.findById({_id: id}).then((resturant) => {
        res.send(resturant);
    }).catch((err) => {
        res.status(400).send(err)
    });
});

app.patch('/resturant/:id',  (req, res) => {
    var id = req.params.id
    var name = req.body.name

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid User ID');
    }

    Resturant.findOneAndUpdate({_id: id}, {$set: {"name": name}}, {new: true}).then((resturant) => {
        if (!resturant) {
            return res.status(404).send('No resturant found');
        }
        res.send({
            resturant: resturant
        });
    }).catch((err) => {
        res.status(400).send('Invalid');
    });
});

app.delete('/resturant/:id', (req, res) => {
    Resturant.remove({
        _id: req.params.id
    }, (err, resturant) => {
        if (err) {
            return res.send(err);
        }
        res.send(resturant + ' removed successfully');
    });
});

//add review for a specific resturant ID
app.post('/reviews/add/:id', (req, res) => {
    Resturant.findById({_id: req.params.id}).then((resturant) => {
        if (!resturant) {
            return res.send('Unable to find resturant');
        }

        var newReview = new Review({
            title: req.body.title,
            text: req.body.text,
            resturant: resturant._id //passes in the id that was found 
        });

        newReview.save((err, review) => {
            if (err) {
                return res.send(err)
            }
            resturant.reviews.push(newReview);
            resturant.save((err, review) => {
                if (err) {
                    return res.send(err)
                }
                res.send('Resturant review saved' + review);
            });
        });
    });
});

//grabs review based on resturant id
app.get('/resturant/reviews/:id', (req, res) => {
    Review.find({resturant: req.params.id}).then((review) => { 
        //find id of resturant in review collection
        if (!review) {
            return res.status(404).send('Unable to find resturant with that id');
        }
        res.send(review);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.post('/account/register', (req, res) => {
    Account.register(new Account({
        username: req.body.email
    }),
    req.body.password, function(err, account) {
        if (err) {
            return res.send(err);
        }
        passport.authenticate(
            'local', {
                session: false //using mobile client don't need session
            })(req, res, () => {
                res.status(200).send('Succesfully created new account' + account);
            });
    });
});

//login

app.post('/account/login', passport.authenticate(
    'local', {
        session: false,
        scope: []
    }), generateAccessToken, respond);

//account logout
app.get('/logout', authenticate, (req, res) => {
    res.logout();
    res.status(200).send('Succesfully logged out');
});

app.get('/account/me', authenticate, (req, res) => {
    res.status(200).json(req.user);
});


app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});

module.exports = {
    app: app
};