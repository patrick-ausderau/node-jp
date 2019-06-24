'use strict';
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require('./db');

const Schema = mongoose.Schema;

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  dateOfBirth: Date
});

const user = mongoose.model('User', userSchema);

db.on('connected', () => app.listen(process.env.PORT));

app.post('/user', (req, res) => {
  console.log('data from http post', req.body);
  user.create({
    firstname: req.body.firstname, 
    lastname: req.body.lastname, 
    dateOfBirth: new Date(req.body.dob).getTime()
  }).then(usr => {
    res.send(`user ${usr.firstname} created with id: ${usr._id}`);
  });
});

app.get('/user', (req, res) => {
  user.find().then(usrs => {
    res.send(usrs);
  });
});

app.get('/', (req, res) => {
  res.send('Hello World from Patrick');
});

app.get('/test', (req, res) => {
  res.send('Testing is fun');
});

