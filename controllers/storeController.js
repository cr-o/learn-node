
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

exports.editStore = async(req, res) => {
    // 1. find ths store given the ID
    // res.json(req.params);
    const store = await Store.findOne({_id: req.params.id}) // mongoDB query method to find store by id. the id is coming from our route
    // res.json(store);
    // 2. confirm they are the owner of the store
    // TODO once we have login session stuff
    // 3. render out the edit form so the user can update their store
    res.render('editStore', {title: `Edit ${store.name}`, store});
};

exports.updateStore = async(req, res) => {
    // find and update the store
    // mongoDB method to find and update at the same time
    const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true}).exec();
    // new option returns the new object, we want the new since we need to redirect to a specific page
    // redirect them to the store and tell them it worked
    // since we have a required field, it only runs the validation on the initial creation. so we want to make our model run the validators again now
    // exec to actually run the method
    // need to await since findONeAndUpdate returns a promise
    req.flash('success', `Successfully updated <strong> ${store.name}</strong>. <a href="stores/${store.slug}">View Store →</a>`);
    res.redirect(`/stores/${store.id}/edit`);
}