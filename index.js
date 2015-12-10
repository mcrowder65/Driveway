// setup Express
var app = require('./models/express.js');

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/list');
var api = require('./models/api.js');


// start the server
var server = app.listen(3090, function() {
console.log("Started on port 3090");
var host = server.address().address;
var port = server.address().port;
});