const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
// const { request } = require('node:http');

//later will have logic to set db
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method')); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(3000, () => {
    console.log("Serving on port 3000");
});

app.get('/', (req, res) => {
    res.render("home");
})

//CRUD

// CREATE: Form
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

//CREATE: Insert data
app.post('/campgrounds', async (req, res) => {
    const camp = new Campground (req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
});

// READ: Show all campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});

// READ: Show details for a single campground
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
});

// UPDATE: show form to update a single campground
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
});

// UPDATE: submitted form, put data in DB.
app.put('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground}, {useFindAndModify: false});
    res.redirect(`/campgrounds/${req.params.id}`);
});

// DELETE: a single campground
app.delete('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id, {useFindAndModify: false});
    res.redirect('/campgrounds');
})