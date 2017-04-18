var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var app = express();

const port = process.env.PORT || 3000;


// use sessions

app.use(session({
  secret: 'coding is fun',
  resave: true,
  saveUninitialized: false
}));

// make user id available in templates
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});


// mongodb connection
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/cisc`);
var db = mongoose.connection;
// errors




// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// listen on port 3000
app.listen(port, function () {
  console.log(`Express app listening on http://localhost:${port}/`);
});
//  start mongo -> mongo/bin/mongod --dbpath ~/mongo-data/