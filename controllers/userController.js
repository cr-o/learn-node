const mongoose = require('mongoose');
const User = mongoose.model('User'); // possible because already imported
const promisify = require('es6-promisify');

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
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password cannot be blank!').notEmpty();
    req.checkBody('password-confirm', 'Confirmed password cannot be blank!').notEmpty();
    req.checkBody('password-confirm', 'Your passwords do not match').equals(req.body.password);

    const errors = req.validationErrors(); //actually runs all above functions to check for errors

    if(errors){
        req.flash('error', errors.map(err => err.msg));
        res.render('register', {title: 'Register', body:req.body, flashes: req.flash()}); // send body back to user to pre populate the form. also need to explicitly pass flashes since validation and rendering are happening on one request
        return; // stop it from running
    }
    next();
};

exports.register = async (req, res, next) => {
    // import user
    const user = new User({email: req.body.email, name: req.body.name});
    // using the plugin passportLocalMongoose exposes register method, which takes care of low level registration
    // User.register(user, req.body.password, function(){ // doesn't return promise, is callback based library
    // }); // make user using model
    const register = promisify(User.register, User); // use promisify. pass method and object to bind to. if method lives on some object like User, you need to pass User again
    await register(user, req.body.password); // it stores hash of password in database
    next(); // pass to authController.login
};

exports.account = (req, res) => {
    res.render('account', {title: 'Edit your account'});
};

exports.updateAccount =  async (req, res, next) => {
    const updates = {
        name: req.body.name, 
        email: req.body.email
    };

    const user = await User.findOneAndUpdate( // query, updates, options
        { _id: req.user._id}, // get it from the request
        {$set: updates}, // take updates and set it on top of what already exists
        {new: true, runValidators:true, context: 'query'} // returns new actual user, run validators, context is required for mongoose to do query
    );
    req.flash('success', 'Updated the profile!');
    res.redirect('back');
};