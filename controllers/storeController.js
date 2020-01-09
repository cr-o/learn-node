
const mongoose = require('mongoose');
const Store = mongoose.model('Store'); // getting export at end of store.js

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore' , {title: 'Add Store'});
};

exports.createStore = async (req, res) => {
    const store = new Store(req.body); // pass from body to store
    await store.save();
    console.log('It worked!');
    res.redirect('/');
    // store.age = 10; // these won't be reflected in DB until saved
    // store.save();
    // // console.log(req.body);
    // // res.json(req.body);
};