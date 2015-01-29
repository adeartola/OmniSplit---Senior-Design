var debug        = require('debug')('orderly-comms');
var express      = require('express');
var session      = require('express-session');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var flash        = require('connect-flash');
var engine       = require('ejs-locals');
var busboy       = require('connect-busboy');
var passport     = require('passport');

var app = express();
var router = express.Router();

var mongoose = require('mongoose');
var databaseUrl;
if (process.env.DB_USER && process.env.DB_PASSWORD) {
    databaseUrl = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@ds041157.mongolab.com:41157/orderly_db';
    debug('Connected to main database.');
}
else { // Local dev
    databaseUrl = 'mongodb://orderly_test:test@127.0.0.1:27017/orderly_db';
    debug('Connected to local database.');
}

var db = mongoose.connection;
db.on('error', console.error);

mongoose.connect(databaseUrl);
/***** CONFIGURATION *****/
require('./config/passport')(passport); // passport configuration

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('super secret'));

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// session setup
app.use(session({
    secret: 'super secret message',
    resave: false,
    saveUninitialized: false,
}));

app.use(flash());
app.use(busboy());

app.use(passport.initialize());
app.use(passport.session());

/***** ROUTES *****/
var index = require('./routes/index');
var chat  = require('./routes/chat');

app.use(function(req, res, next) {
    if (req.secure) {
        // request was via https, so do no special handling
        next();
    } else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }
});

app.use('/', index);
app.use('/chat', chat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/***** Export and start in /bin/www *****/
module.exports = app;
