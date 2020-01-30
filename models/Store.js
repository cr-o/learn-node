const mongoose = require('mongoose');
mongoose.Promise = global.Promise; //global window to make mongoose use Promose
const slug = require('slugs') // make url friendly names for slugs

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a store name'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags : [String],
    created : {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [
            {
                type: Number,
                required: 'You must supply coordinates!'
            }
        ],
        address: {
            type: String,
            required: 'You must supply an address!'
        }
    },
    photo: String,
    author: {
        type: mongoose.Schema.ObjectId, // ids are actually of their own type, an ObjectId
        ref: 'User', // author is going to be referenced to the user
        required: 'You must supply an author'
    }
});

// make this async to see if stores with slug already exists
storeSchema.pre('save', async function(next){ // pure function needed because we need this to be equal to be store that we are trying to save
    if(!this.isModified('name')){ // if stores name is not modified, just skip
        next();
        return; // stop the function from running
    }
    this.slug = slug(this.name); // to only run if name has been changed
    // need to find other stores of the same base (store, store-1, store-2)
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i') // case insensitive
    // starting with this.slug
    // and ending in something optional (?) ( the optional thing will have a dash then some numerals repeating any number of times, and it then will be the end of the string)

    // Store does not exist yet, but this.constructor will be Store once it runs
    const storesWithSlug = await this.constructor.find({slug:slugRegEx});
    if(storesWithSlug.length){
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }
    next();
});

// add method to schema by adding to statics
storeSchema.statics.getTagsList = function (){ // need to use proper function to have this bound to the model Store, do not use arrow function here
    return this.aggregate([ // mongoDB method that takes array of possible operators
        // passing an object for each pipeline operator
        // using unwind first before grouping all the items by the number of tags
        // unwind lets us tally up one store for each type of tag it contains
        {$unwind: '$tags'},  // dollar sign to indicate field in document
        {$group:{_id:'$tags', count:{$sum:1}}}, // we then group everything based on tag field and are creating a new field called count in each of those groups called count. each time group is called, count sums itself (adds one)
        {$sort: {count: -1}} // sort by descending
    ]); 
};

module.exports = mongoose.model('Store', storeSchema);