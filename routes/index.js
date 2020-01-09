const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
// Do work here

router.get('/', storeController.homePage);
//router.get('/', (req, res) => {
  // res.send('Hey! It works!');
  // res.render('hello', {name: 'myDog', dog: req.query.dog, title: 'working title'});
//});

module.exports = router;
