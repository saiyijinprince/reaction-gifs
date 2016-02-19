/**
 * Created by akabeera on 2/18/2016.
 */
    /*
// ====Imports====
var express         = require( 'express' );
var app             = express();
var bodyParser      = require( 'body-parser' );
var methodOverride  = require( 'method-override' );

// ===Definitions===
var port = process.env.PORT || 8080;
var staticdir = process.env.NODE_ENV === 'production' ? 'dist.prod' : 'dist.dev';
console.log('static dir: ' + staticdir);

// ===Routes===
require('./devServer/routes')(app);

//===add middleware===

app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/' + staticdir));

app.listen(port);
console.log('Starting server on port ' + port);
exports = module.exports = app;
        */

// Simple Node.js server that will serve static assets from either dist.pev or dist.prod directories

// === Imports =====

var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// === Definitions =====

var port = process.env.PORT || 8080;                    // set our port
var staticdir = process.env.NODE_ENV === 'production' ? 'dist.prod' : 'dist.dev'; // get static files dir

// === Routes =====
// Routes here exist mostly for stubbing out the data
require('./devServer/routes')(app);


// === add middleware =====

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json());                             // parse application/json
// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/' + staticdir));

// === Start app =====

app.listen(port);                                       // startup our app at http://localhost:8080
console.log('Starting server on port ' + port);          // shoutout to the user
exports = module.exports = app;                         // expose app