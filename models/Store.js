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
    }
});

storeSchema.pre('save', function(next){ // pure function needed because we need this to be equal to be store that we are trying to save
    if(!this.isModified('name')){ // if stores name is not modified, just skip
        next();
        return; // stop the function from running
    }
    this.slug = slug(this.name); // to only run if name has been changed
    next();
    // TODO make resiliant for unique slugs
});

module.exports = mongoose.model('Store', storeSchema);