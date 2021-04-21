const Campground = require('../models/campground');
const Review = require('../models/review');
const wrapAsync = require('../utilities/wrapAsync');

module.exports.insert = wrapAsync(async(req, res, next) => {
    const {id} = req.params;
    const review = new Review (req.body.review);
    review.author = req.user._id;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground) {
        req.flash('error', 'Campground unavailable');
        return res.redirect('/campgrounds');
    }
    await review.save();
    campground.reviews.push(review);
    campground.averageRating = getAverageRating(campground.reviews);
    await campground.save();
    req.flash('success', 'Review created.');
    res.redirect(`/campgrounds/${id}`);
});

function getAverageRating(obj) {
    let total = 0;
    console.log(obj);
    for (let o of obj) { 
        console.log('a ' + o.rating);
        total += o.rating; 
    }
    console.log(total);
    console.log(obj.count);
    console.log(obj.length);
    return Math.round(total/obj.length);
}

module.exports.delete = wrapAsync(async(req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.rid}});
    if(!campground) {
        req.flash('error', 'Campground unavailable');
        return res.redirect('/campgrounds');
    }
    const review = await Review.findByIdAndDelete(req.params.rid, {useFindAndModify: false});
    if(!review) {
        req.flash('error', 'Review unavailable');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    req.flash('success', 'Review deleted.');
    res.redirect(`/campgrounds/${req.params.id}`);
});