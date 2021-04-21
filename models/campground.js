const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema ({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
ImageSchema.virtual('midsize').get(function() {
    return this.url.replace('/upload', `/upload/w_500`);
});

const CampgroundSchema = new Schema({
    title: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    images: [ImageSchema],
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
});

//When a campground is deleted, delete all reviews as well.
CampgroundSchema.post('findOneAndDelete', async doc => {
    if(doc) {
        //remove all where review's id is in the deleted campground's array of review ids.
        await Review.deleteMany({_id: { $in: doc.reviews}});
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);