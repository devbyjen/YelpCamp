//development mode vs production mode
//development mode the environment variables are listed in a file.
//production mode they're not.
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
    // console.log(process.env.SECRET); //how you access the env variables
}
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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || process.env.TEST_DB_URL;
const secret = process.env.SECRET || "thisshouldbeabettersecret";



// const { request } = require('node:http');

//later will have logic to set db
mongoose.connect(dbUrl, {
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
app.use(mongoSanitize());
app.use(helmet());



const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/devbyjen/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// const store = new MongoDBStore({
//     url: process.env.TEST_DB_URL,
//     secret: process.env.MONGO_SECRET,
//     touchAfter: 24 * 60 * 60 //1 day in milliseconds
// });


const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        secret,
        touchAfter: 24 * 60 * 60 //1 day in milliseconds),
    }),
    name: 'session', //not the default name
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        // secure: true, //only use this flag on deploy, not on localhost
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
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

