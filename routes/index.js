const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
// Do work here

//object destructuring lets us import an entire object. we are importing the one method we need.
const {catchErrors} = require('../handlers/errorHandlers');

router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));
//router.get('/', (req, res) => {
  // res.send('Hey! It works!');
  // res.render('hello', {name: 'myDog', dog: req.query.dog, title: 'working title'});
//});

module.exports = router;
