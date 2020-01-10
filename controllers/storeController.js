
const mongoose = require('mongoose');
const Store = mongoose.model('Store'); // getting export at end of store.js

exports.homePage = (req, res) => {
    console.log(req.name);
    // req.flash('error', 'Something Happened');
    // req.flash('info', 'Something Happened');
    // req.flash('warning', 'Something Happened');
    // req.flash('success', 'Something Happened');
    res.render('index'); //flash and then render
};

exports.addStore = (req, res) => {
    res.render('editStore' , {title: 'Add Store'});
};

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save(); // pass from body to store
    //the response from awaiting from save will let us access slug. otherwise we don't have slug because it is automatically generated.
    await store.save();
    console.log('It worked!');
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
    // store.age = 10; // these won't be reflected in DB until saved
    // store.save();
    // // console.log(req.body);
    // // res.json(req.body);
};
exports.getStores = async(req, res) => {
    // 1. query the db for a list of all stores
    const stores = await Store.find(); // query db for all stores, can be modified
    // console.log(stores); // Stores is an array. We can give this to our template and loop over it.
    res.render('stores', {title:'Stores', stores}); //If property name is same as variable name, you can just pass the variable.

};