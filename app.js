var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// postgreSQL + express session
const expressSession = require('express-session');
const passport = require('passport')
// postgreSQL + express session

if (process.env.NODE_ENV != 'production')
  require('dotenv').config()  // import .env environment variable file

// postgreSQL + express session
const pgPool = require('./db/pool.js');
const pgSession = require('connect-pg-simple')(expressSession);
// postgreSQL + express session

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// postgreSQL + express session
app.use(expressSession({
  store: new pgSession({
    pool: pgPool,                // Connection pool
    tableName: 'session'   // Use another table-name than the default "session" one
    // Insert connect-pg-simple options here
  }),
  secret: process.env.SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 } // 1 day
  // cookie: { maxAge: 1 * 1 * 1 * 60 * 1000 } // 1 min
  // Insert express-session options here
}));

// passpoth configuration set up
app.use(passport.session())
require('./passportConfig')
// app.use(passport.initialize())
// postgreSQL + express session

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
