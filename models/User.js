const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator')''
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose'); // takes care of adding fields to schema and methods to create new login

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'], // how to validate and error message.
        required: 'Please supply an email address'
    },
    name: {
        type: 'String',
        required: true,
        trim: true
    }
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'}); // add plugin to add authentication to schema. email will be login field
userSchema.plugin(mongodbErrorHandler); // makes errors more viewable to users

module.exports = mongoose.model('User', userSchema); // main export