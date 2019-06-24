//use strict is implicit in module :)
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  dateOfBirth: Date
});

module.exports = mongoose.model('User', userSchema);

