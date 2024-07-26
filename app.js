var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const MongoStore = require('connect-mongo');
const passport = require('passport')


if(process.env.NODE_ENV != 'production')
  require('dotenv').config()  // import .env environment variable file

var indexRouter = require('./routes/index');

var app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// sesssion set up
const sessionStore = MongoStore.create({ mongoUrl: process.env.MONGODB_URL})

app.use(session({ 
  secret: process.env.SECRET, 
  resave: false, 
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 24 * 60 * 60 // 1 day .
  }
}));

// passpoth configuration set up
require('./passportConfig')
app.use(passport.initialize())
app.use(passport.session())

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
