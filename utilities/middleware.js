const dataSchemas = require('../dataSchemas');

module.exports.ensureLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
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