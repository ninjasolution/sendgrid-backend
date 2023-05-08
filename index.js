const express = require("express");
var path = require('path');
const cors = require("cors");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');

const indexRouter = require("./src/routes");

const { secret } = require("./src/config/index")

require('dotenv').config();

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: secret,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))
app.set("view engine", "ejs")
// var allowedOrigins = ['http://localhost:3000',
//   'http://yourapp.com'];
var allowedOrigins = ['*']


app.use(cors());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method == 'OPTIONS') {
    res.status(200).end()
    return;
  }
  // Pass to next layer of middleware
  next();
});

app.use('/api', indexRouter);

app.get("/check", (req, res) => {
  return res.send("Welcome!");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') == 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

