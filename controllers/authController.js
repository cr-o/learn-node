const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User'); 
const promisify = require('es6-promisify');

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

exports.forgot = async (req, res) => {
    // 1. see if user with that email exists
    const user = await User.findOne({email: req.body.email});
    if(!user){
        req.flash('error', 'No account with that email exists');
        return res.redirect('/login');
    }
    // 2. set reset tokens and expiry on that account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex'); // module called crypto built into Node that generates random strings
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();
    // 3. send email with the token
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    req.flash('success', `You have been emailed a password reset link. ${resetURL}`);
    res.redirect('/login');
    // 4. redirect to login page
};

exports.reset = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()} // use object structure to query, look for where key is greater than current time
    });
    if(!user){
        req.flash('error', 'Password reset is invalid or has expired');
        return res.redirect('/login');
    }
    // if there is a user, show the reset password form
    res.render('reset', {title: 'Reset your password'});
};

exports.confirmedPasswords = (req, res, next) => {
    if(req.body.password === req.body['password-confirm']){
        next();
        return;
    }
    req.flash('error', 'Passwords do not match!');
    res.redirect('back');
};

exports.update = async (req, res, next) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()} // use object structure to query, look for where key is greater than current time
    });
    if(!user){
        req.flash('error', 'Password reset is invalid or has expired');
        return res.redirect('/login');
    }
    const setPassword = promisify(user.setPassword, user); // made available because of plugin in user.js. but it is a callback so promisify it
    await setPassword(req.body.password);
    // erase fields in mongo by setting them to undefined
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save(); // update to database
    // log the user in
    await req.login(updatedUser); // login method from passport.js middleware
    req.flash('success', 'Password has been reset');
    res.redirect('/');
};