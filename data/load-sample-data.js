require('dotenv').config({ path: __dirname + '/../variables.env' }); // requires env variables since this is not really part of app
const fs = require('fs');

const mongoose = require('mongoose'); // connect to database
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// import all of our models - they need to be imported only once
const Store = require('../models/Store');
// const Review = require('../models/Review'); // temporarily commenting out since Review is not set up
const User = require('../models/User');

// read the json files
const stores = JSON.parse(fs.readFileSync(__dirname + '/stores.json', 'utf-8'));
// const reviews = JSON.parse(fs.readFileSync(__dirname + '/reviews.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync(__dirname + '/users.json', 'utf-8'));
// delete from db. npm run blowitallaway
async function deleteData() {
  console.log('😢😢 Goodbye Data...');
  await Store.remove();
  // await Review.remove();
  await User.remove();
  console.log('Data Deleted. To load sample data, run\n\n\t npm run sample\n\n');
  process.exit();
}
// insert to db. npm run sample
async function loadData() {
  try {
    await Store.insertMany(stores);
    // await Review.insertMany(reviews);
    await User.insertMany(users);
    console.log('👍👍👍👍👍👍👍👍 Done!');
    process.exit();
  } catch(e) {
    console.log('\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n');
    console.log(e);
    process.exit();
  }
}
if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
