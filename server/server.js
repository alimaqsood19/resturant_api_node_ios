require('./config/config.js'); //Setting proces.env variables
var {mongoose} = require('./db/mongoose.js'); //Setting up connection

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();
const port = process.env.PORT; 

app.server = http.createServer(app);

app.use(bodyParser.json({
    limit: '100kb' //limits data sent by client to 100kilobytes
}));

app.get('/', (req,res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});

module.exports = {
    app: app
};