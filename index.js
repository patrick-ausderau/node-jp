'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

db.on('connected', () => {
  if(process.env.NODE_ENV === 'development') {
    require('./localhost')(app, process.env.HTTPS, process.env.PORT);
  } else {
    require('./production')(app, process.env.PORT);
  }
});

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));


app.use('/user', require('./user/routes'));

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

