'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');
const bcrypt = require('bcrypt');
const session = require('express-session');

const saltRound = 12;

passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log('login...', username, process.env.username);
    if (username !== process.env.username || 
        !bcrypt.compareSync(password, process.env.password)) {
      console.log('login failed...');
      done(null, false, {message: 'Incorrect credentials.'});
      return;
    }
    console.log('login ok ☺');
    return done(null, {username: username}); // returned object usally contains something to identify the user
  }
));

// data put in passport cookies needs to be serialized
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const app = express();

app.use(session({
  secret: 'some s3cr3t value',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true, // only over https
    maxAge: 2 * 60 * 60 * 1000} // 2 hours
}));

app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

db.on('connected', () => {
  if(process.env.NODE_ENV === 'development') {
    require('./localhost')(app, process.env.HTTPS, process.env.PORT);
  } else {
    require('./production')(app, process.env.PORT);
  }
});

app.use(bodyParser.urlencoded({extended: false}));


app.use('/user', require('./user/routes'));

app.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/', 
    failureRedirect: '/login.html'
  })
);

app.get('/', (req, res) => {
  if(req.secure) {
    const userdata = req.user.username;
    res.send(`Hello ${userdata}, this is SECURE app from Patrick`);
  } else {
    res.send('Hello Unsecure world ☹');
  }
});

app.get('/test', (req, res) => {
  res.send('Testing is fun');
});

