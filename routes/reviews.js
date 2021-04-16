const express = require('express');
//mergeParams option gives us the params from the full url, not just the chunk after the base route
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utilities/wrapAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
// const dataSchemas = require('../dataSchemas');
// const ExpressError = require('../utilities/ExpressError');
const {validateReview, isLoggedIn, isAuthor, isReviewAuthor} = require('../utilities/middleware');
const reviews = require('../controllers/reviews');


router.post('/', isLoggedIn, validateReview, 
    reviews.insert);


router.delete('/:rid', isLoggedIn, isReviewAuthor, 
    reviews.delete);


module.exports = router;
