//use strict implicit :)
const router = require('express').Router();

const user = require('./model');

router.route('/')
  .post((req, res) => {
    console.log('data from http post', req.body);
    user.create({
      firstname: req.body.firstname, 
      lastname: req.body.lastname, 
      dateOfBirth: new Date(req.body.dob).getTime()
    }).then(usr => {
      res.send(`user ${usr.firstname} created with id: ${usr._id}`);
    });
  })
  .get((req, res) => {
    user.find().then(usrs => {
      res.send(usrs);
    });
  });

router.route('/:id')
  .get((req, res) => {
    //user.findById(req.
    res.send('user');
  });

module.exports = router;
