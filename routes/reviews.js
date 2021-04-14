const express = require('express');
//mergeParams option gives us the params from the full url, not just the chunk after the base route
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utilities/wrapAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
// const dataSchemas = require('../dataSchemas');
// const ExpressError = require('../utilities/ExpressError');
const {validateReview} = require('../utilities/middleware');


//CRUD

//CREATE: Insert new review
router.post('/', validateReview, wrapAsync(async(req, res, next) => {
    const {id} = req.params;
    const review = new Review (req.body.review);
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Campground unavailable');
        return res.redirect('/campgrounds');
    }
    await review.save();
    campground.reviews.push(review);
    await campground.save();
    req.flash('success', 'Review created.');
    res.redirect(`/campgrounds/${id}`);
}));

//DELETE: a single review
router.delete('/:rid', wrapAsync(async(req, res) => {
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
}))


module.exports = router;
