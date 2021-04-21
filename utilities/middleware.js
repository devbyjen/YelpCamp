const dataSchemas = require('../dataSchemas');
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('./ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        console.log(`returnTo: ${req.session.returnTo}`)
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }

    next();
};

//custom validation middleware with JOI
module.exports.validateCampground = (req, res, next) => {
    const {error} = dataSchemas.campground.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(', ');
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};

//custom validation middleware with JOI
module.exports.validateReview = (req, res, next) => {
    const {error} = dataSchemas.review.validate(req.body);
    if(error) {
        const message = error.details.map(el => el.message).join(', ');
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};

module.exports.validateUser = (req, res, next) => {
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, rid} = req.params;
    const review = await (await Review.findById(rid));
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}