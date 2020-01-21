const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
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

userSchema.virtual('gravatar').get(function(){ // make a virtual field to make a globally recognized avatar
    // this isn't adding a new field. this is not stored in the database, but instead it is generated and pulled up by a virtual field called gravatar
    // gravatar using a hashing algorithm called md5 to hash the user's email
    const hash = md5(this.email); // proper function allows us to access email via this
    return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'}); // add plugin to add authentication to schema. email will be login field
userSchema.plugin(mongodbErrorHandler); // makes errors more viewable to users

module.exports = mongoose.model('User', userSchema); // main export