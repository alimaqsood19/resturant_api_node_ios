require('./config/config.js'); //Setting proces.env variables
var {mongoose} = require('./db/mongoose.js'); //Setting up connection

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var {Resturant} = require('./model/resturant.js');
var {ObjectID} = require('mongodb');

var app = express();
const port = process.env.PORT; 

app.server = http.createServer(app);

app.use(bodyParser.json({
    limit: '100kb' //limits data sent by client to 100kilobytes
}));

app.get('/', (req,res) => {
    res.send('Hello World');
});

app.post('/resturant/add', (req, res) => {
    var newRest = new Resturant({
        name: req.body.name
    });

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

app.patch('/resturant/:id', (req, res) => {
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

app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});

module.exports = {
    app: app
};