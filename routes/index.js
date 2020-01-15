const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
// Do work here

//object destructuring lets us import an entire object. we are importing the one method we need.
const {catchErrors} = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);

router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);

router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

router.get('/stores/:id/edit', catchErrors(storeController.editStore));
//router.get('/', (req, res) => {
  // res.send('Hey! It works!');
  // res.render('hello', {name: 'myDog', dog: req.query.dog, title: 'working title'});
//});

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

module.exports = router;
