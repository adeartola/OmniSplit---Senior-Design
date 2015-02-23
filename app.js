var debug              = require('debug')('orderly-comms');
var express            = require('express');
var session            = require('express-session');
var path               = require('path');
var favicon            = require('serve-favicon');
var logger             = require('morgan');
var bodyParser         = require('body-parser');
var cookieParser       = require('cookie-parser');
var flash              = require('connect-flash');
var engine             = require('ejs-locals');
var busboy             = require('connect-busboy');
var passport           = require('passport');
var LocalStrategy      = require('passport-local');
var mongoose           = require('mongoose');
var mongooseRedisCache = require('mongoose-redis-cache');

var RedisStore = require('connect-redis')(session);

var app = express();
var router = express.Router();

var databaseUrl, redisOptions;

if (process.env.NODE_ENV == 'production') {
    //TODO: redis could be on another server
    databaseUrl = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@ds041157.mongolab.com:41157/orderly_db';
    /*
    mongooseRedisCache(mongoose, {
        host: process.env.REDIS_HOST,
        port: 'redisPort',
        pass: process.env.REDIS_PASSWORD,
        options: 'redisOptions'
    });
    */
    mongooseRedisCache(mongoose);
}
else { // Local dev
    databaseUrl = 'mongodb://orderly_test:test@127.0.0.1:27017/orderly_db';
    mongooseRedisCache(mongoose);
}

var db = mongoose.connection;
db.on('error', console.error);

mongoose.connect(databaseUrl, null, function(err) {
    if (err)
        debug(err);
    else
        debug('Connected to database.');
});

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
    store: new RedisStore(redisOptions)
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use(busboy());

/***** ROUTES *****/
var index = require('./routes/index');
var chat  = require('./routes/chat');
var api   = require('./routes/api');

app.use('/', index);
app.use('/chat', chat);
app.use('/api', api);

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
