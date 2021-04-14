const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const Campground = require('../models/campground');
// const ExpressError = require('../utilities/ExpressError');
const flash = require('connect-flash');
const {validateCampground, ensureLoggedIn} = require('../utilities/middleware');



//CRUD

// CREATE: Form
router.get('/new', ensureLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

//CREATE: Insert new campground
router.post('/', ensureLoggedIn, validateCampground, wrapAsync(async (req, res, next) => {
    const camp = new Campground (req.body.campground);
    await camp.save();
    req.flash('success', 'Campground created.');
    res.redirect(`/campgrounds/${camp._id}`);
}));

// READ: Show all campgrounds
router.get('/', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

// READ: Show details for a single campground
router.get('/:id', wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground) {
        console.log('in here');
        req.flash('error', 'Campground unavailable');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}));

// UPDATE: show form to update a single campground
router.get('/:id/edit', ensureLoggedIn, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground) {
        req.flash('error', 'Campground unavailable');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}));

// UPDATE: submitted form, put data in DB.
router.put('/:id', ensureLoggedIn, validateCampground, wrapAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground}, {useFindAndModify: false});
    if(!campground) {
        req.flash('error', 'Campground unavailable');
        return res.redirect('/campgrounds');
    }
    req.flash('success', 'Updated campground.');
    res.redirect(`/campgrounds/${req.params.id}`);
}));

// DELETE: a single campground
router.delete('/:id', ensureLoggedIn, wrapAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id, {useFindAndModify: false});
    if(!campground) {
        req.flash('error', 'Campground unavailable');
        return res.redirect('/campgrounds');
    }
    req.flash('success', 'Campground was deleted.');
    res.redirect('/campgrounds');
}));

module.exports = router;
