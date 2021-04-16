const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const Campground = require('../models/campground');
// const ExpressError = require('../utilities/ExpressError');
const flash = require('connect-flash');
const {validateCampground, isLoggedIn, isAuthor} = require('../utilities/middleware');
const campgrounds = require('../controllers/campgrounds');




router.get('/new', isLoggedIn, 
    campgrounds.createForm);

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, validateCampground, campgrounds.create);

router.route('/:id')
    .get(campgrounds.show)
    .put(isLoggedIn, isAuthor, validateCampground, campgrounds.update)
    .delete(isLoggedIn, isAuthor, campgrounds.delete);

router.get('/:id/edit', isLoggedIn, isAuthor,
    campgrounds.updateForm);


module.exports = router;
