const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema ({
    url: String,
    filename: String,
    credit: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
ImageSchema.virtual('midsize').get(function() {
    return this.url.replace('/upload', `/upload/c_fill,h_600,w_600`);
});
// https://res.cloudinary.com/demo/image/upload/c_crop,g_face,h_400,w_400/r_max/c_scale,w_200/lady.jpg

//include the virtuals when converting to JSON (I used this for the cluster map popup)
const campgroundOptions = {toJSON: {virtuals: true}};
const CampgroundSchema = new Schema({
    title: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    averageRating: Number
}, campgroundOptions);

CampgroundSchema.virtual('stars').get(function() {
    return this.averageRating?'&#9733;'.repeat(this.averageRating):'Not Yet Rated';
});

CampgroundSchema.virtual('properties.popupHTML').get(function() {
    // const short = this.description.substring(0,50);
    return `<h3><a href="/campgrounds/${this.id}">${this.title}</a></h3>`
        + `<p>${this.stars}</p>`;
        // + `<p>${short}...</p>`;
});


//When a campground is deleted, delete all reviews as well.
CampgroundSchema.post('findOneAndDelete', async doc => {
    if(doc) {
        //remove all where review's id is in the deleted campground's array of review ids.
        await Review.deleteMany({_id: { $in: doc.reviews}});
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);