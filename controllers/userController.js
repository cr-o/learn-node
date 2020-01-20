const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
    res.render('login', {title: 'Login'});
};

exports.registerForm = (req, res) => {
    res.render('register', {title: 'Register'});
};

// middleware to do validation in controller
exports.validateRegister = (req, res, next) => {
    // sanitize name
    req.sanitizeBody('name'); // in app.js we imported expressValidator, which applies validation methods to every single request
    req.checkBody('name', 'You must supply a name!').notEmpty();
    req.checkBody('email', 'That email is not valid!').isEmail();
    req.sanitizeBody('name', 'You must supply a name!').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password cannot be blank!').notEmpty();
    req.checkBody('password-confirm', 'Your passwords do not match').equals(req.body.password);

    const errors = req.validationErrors(); //actually runs all above functions to check for errors

    if(errors){
        req.flash('error', errors.map(err => err.msg));
        res.render('register', {title: 'Register', body:req.body, flashes: req.flash()}); // send body back to user to pre populate the form. also need to explicitly pass flashes since validation and rendering are happening on one request
        return; // stop it from running
    }
    next();
};