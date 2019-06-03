'use strict';

require('dotenv').config();

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World from Patrick');
});

app.get('/test', (req, res) => {
  res.send('Testing is fun');
});

app.listen(process.env.PORT);
