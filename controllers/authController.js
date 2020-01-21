const passport = require('passport');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
    req.logout(); // in passport.js
    req.flash('success', 'You are now logged out.');
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
// check if user is authenticated
    if(req.isAuthenticated()){ // check with passport to see if user is authenticated
        next(); // let them carry on
        return;
    }
    req.flash('error', 'You must be logged in to do that!'); // if not logged in, flash message and redirect them
    res.redirect('/login');
};