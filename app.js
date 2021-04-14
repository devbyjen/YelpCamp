const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
// const wrapAsync = require('./utilities/wrapAsync');
const ExpressError = require('./utilities/ExpressError');
const dataSchemas = require('./dataSchemas'); 
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user');


const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

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
app.use(morgan('tiny')); //middleware to log requests, then continue
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));//serve the public directory

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // must use session() before doing this
passport.use(new passportLocal(User.authenticate())); //hello, passport. please use the local strategy, and the authentication mode is located on the user model (static method added automatically by passport-local-mongoose) 
passport.serializeUser(User.serializeUser()); //how we store a user in the session
passport.deserializeUser(User.deserializeUser()); //how to unstore a user in the session




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(3000, () => {
    console.log("Serving on port 3000");
});


//middleware to show all flash messages
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/fakeUser', async (req, res) => {
    const user = new User({email: 'devbyjen@gmail.com', username: 'devbyjen'});
    const registeredUser = await User.register(user, 'thisismypassword');
    res.send(registeredUser);
})


app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render("home");
})

//catch any page requests not already listed
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

//basic error handler
app.use((err, req, res, next) => {
    if(!err.message) err.message = "Something Went Wrong";
    if(!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).render('error', {err});
});

