
const mongoose = require('mongoose');
const Store = mongoose.model('Store'); // getting export at end of store.js
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid'); // unique identifiers for every single image

const multerOptions = { // decide where to store files and which types of files are allowed
    storage: multer.memoryStorage(), // saving to memory, since we will read, resize, and save the final resized version
    // fileFilter: function(req, file, next){ // old style, using ES6 style instead
    // }
    fileFilter(req, file, next){
        const isPhoto = file.mimetype.startsWith('image/') // this tells us what type of photo the file is. extension types are not dependable
        if(isPhoto){
            next(null, true); // old school callback often seen in node.js. null as first generally signals it worked, and we are passing the second value
        }else{
            next({message: 'That filetype isn\'t allowed!'}, false);
        }
    }
};

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

exports.upload = multer(multerOptions).single('photo'); // we just want a single field called photo
// this is just in the memory of the server, so it is temporary

exports.resize = async (req, res, next) => { // next because this is middleware, we won't be rendering or sending things back to the client, and instead are just saving the image, recording its name, and passing along data to the store
// we are not uploading a new file every time we edit our store, so check if there is no new file to resize
    if(!req.file){ // multer puts the actual file onto the file property of the request
        next(); // skip to the next middleware, createStore
        return;
    }
    const extension = req.file.mimetype.split('/')[1]; // get extension piece of array after split
    req.body.photo = `${uuid.v4()}.${extension}`;// put on body to store to database. generate unique string
    const photo = await jimp.read(req.file.buffer); // to resize photo. Buffer is representation of file in memory. jimp is promise based so we can await it.
    await photo.resize(800, jimp.AUTO); // resize, height is auto
    await photo.write(`./public/uploads/${req.body.photo}`);
    // resized photo is written to file system, so keep going
    next();
}

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save(); // pass from body to store
    //this fails if validation does not pass. error handler calls next and goes to chain of error handlers in app.js and to flashValidationErrors, and redirects back without updating
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
    // set the location data to be a point
    req.body.location.type = 'Point'; // needs this as default
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
};

exports.getStoreBySlug = async(req, res, next) => {
    const store = await Store.findOne({slug: req.params.slug});
    if(!store) return next();
    res.render('store', {store, title:store.name});
};