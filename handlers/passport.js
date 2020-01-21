// handler to configure passport
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(User.createStrategy()); // using plugin allows us to use createStrategy method
// with every request, confirms they are properly logged in and asks what to do next
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());