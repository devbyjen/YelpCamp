
const Campground = require('../models/campground');
const wrapAsync = require('../utilities/wrapAsync');

//CRUD

// CREATE: Form
module.exports.createForm = (req, res) => {
    res.render('campgrounds/new');
};

//CREATE: Insert new campground
module.exports.create = wrapAsync(async (req, res, next) => {
    const camp = new Campground (req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Campground created.');
    res.redirect(`/campgrounds/${camp._id}`);
});

// READ: Show all campgrounds
module.exports.index = wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});

// READ: Show details for a single campground
module.exports.show = wrapAsync(async (req, res) => {
    const campground = await (await Campground.findById(req.params.id)
    .populate({
        path: 'reviews', 
        populate: { 
            path: 'author'
        }}).populate('author'));
    console.log(campground);
    if(!campground) {
        console.log('in here');
        req.flash('error', 'Campground unavailable');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
});

// UPDATE: show form to update a single campground
module.exports.updateForm = wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground) {
        req.flash('error', 'Campground unavailable');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
});

// UPDATE: submitted form, put data in DB.
module.exports.update = wrapAsync(async (req, res) => {
    const {id} = req.params;
    let campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Campground unavailable');
        return res.redirect('/campgrounds');
    }
    campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {useFindAndModify: false});
    req.flash('success', 'Updated campground.');
    res.redirect(`/campgrounds/${req.params.id}`);
});

// DELETE: a single campground
module.exports.delete = wrapAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id, {useFindAndModify: false});
    if(!campground) {
        req.flash('error', 'Campground unavailable');
        return res.redirect('/campgrounds');
    }
    req.flash('success', 'Campground was deleted.');
    res.redirect('/campgrounds');
});

