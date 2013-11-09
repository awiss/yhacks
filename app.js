
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./app/routes')
  , user = require('./app/routes/user')
  , twil = require('./app/routes/twilio')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/twilio', twil.text);

// var redis = require('redis'),
//     client = redis.createClient(6379, 'subdomain.redistogo.com');

// client.auth('pass', function authenticate(err) {
//   if (err) {
//     throw err;
//   }
// });

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

