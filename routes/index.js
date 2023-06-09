const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// Do work here

//object destructuring lets us import an entire object. we are importing the one method we need.
const {catchErrors} = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', authController.isLoggedIn, storeController.addStore);

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

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);
router.post('/login', authController.login); // give it the same login data
router.get('/register', userController.registerForm);
// 1. validate registration data
// 2. register the user
// 3. log in the user
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account); // if logged in, redirect to account page

router.post('/account', catchErrors(userController.updateAccount)); // when user posts form to update in account page
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token', 
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

/*
  API ENDPOINTS
*/
// run searchStores method with error catching when we run search
router.get('/api/search', catchErrors(storeController.searchStores));

module.exports = router;
