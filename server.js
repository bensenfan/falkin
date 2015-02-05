
/**
 * Module dependencies.
 */

var http = require('http');
var https = require('https');
var path = require('path');
var fs = require("fs");
var url = require("url");
var express = require("express");
var session = require("express-session");
var passport = require('passport');
var MongoStore = require('connect-mongo')(express);
var bodyParser = require('body-parser');
var config = require('./config/config');

// load database
require('./app/models');
// bootstrap passport config
require('./config/passport')(passport);
// bootstrap authentication middleware
var auth = require('./config/auth');

var app = express();
var db = require('./app/models').db;
app.use(express.session({
	secret: config.session.secret_token,
	store: new MongoStore({
		db: db.connection.db,
		collection: 'sessions'
	})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// set views folder and rendering engine
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

// just removes an advertising header
app.disable('x-powered-by');  

require("./routes/routes.js")(app, passport, auth);

// this makes the server use /public as root for /img, /css, etc.
app.use(express.static(__dirname + '/public'));

// Start app
http.createServer(app).listen(config.port, function(err){
	if (err) throw err;
  console.log("listening on port " + config.port);
});
