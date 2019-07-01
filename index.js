'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');

passport.use(new LocalStrategy(
  (username, password, done) => {
    if (username !== process.env.username || password !== process.env.password) {
      done(null, false, {message: 'Incorrect credentials.'});
      return;
    }
    return done(null, {username: username}); // returned object usally contains something to identify the user
  }
));

const app = express();
app.use(express.static('public'));
app.use(passport.initialize());

db.on('connected', () => {
  if(process.env.NODE_ENV === 'development') {
    require('./localhost')(app, process.env.HTTPS, process.env.PORT);
  } else {
    console.log('production server on port:', process.env.PORT);
    app.enable('trust proxy');
    app.listen(process.env.PORT);

    /*app.use((req, res, next) => {
      if (req.secure) {
        console.log('req secure, nothing to do');
        next();
      } else {
        console.log('req unsecure, force redirect');
        const proxypath = process.env.PROXY_PASS || '' 
        res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
      }
    });

    const prod =require('./production')(app, process.env.PORT);*/
  }
});

if(process.env.NODE_ENV === 'production') {
  console.log('redirect out of db callback? maybe?');
  app.use((req, res, next) => {
    if (req.secure) {
      console.log('req secure, nothing to do');
      next();
    } else {
      console.log('req unsecure, force redirect');
      const proxypath = process.env.PROXY_PASS || '' 
      res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
    }
  });
}

app.use(bodyParser.urlencoded({extended: false}));


app.use('/user', require('./user/routes'));

app.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/', 
    failureRedirect: '/login.html', 
    session: false })
);

app.get('/', (req, res) => {
  if(req.secure) {
    res.send('Hello SECURE World from Patrick');
  } else {
    res.send('Hello Unsecure world ☹');
  }
});

app.get('/test', (req, res) => {
  res.send('Testing is fun');
});

