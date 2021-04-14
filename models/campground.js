const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//When a campground is deleted, delete all reviews as well.
CampgroundSchema.post('findOneAndDelete', async doc => {
    if(doc) {
        //remove all where review's id is in the deleted campground's array of review ids.
        await Review.deleteMany({_id: { $in: doc.reviews}});
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);