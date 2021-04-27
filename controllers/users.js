const User = require('../models/user');
const wrapAsync = require('../utilities/wrapAsync');

//CRUD

//CREATE: new user form
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
};

//CREATE: new user
module.exports.create = wrapAsync(async(req, res, next) => {
    try {
        const {username, email, password} = req.body;
        console.log(`username: ${username}`);
        console.log(`email: ${email}`);
        const newUser = new User({email, username});
        console.log("here");
        const registeredUser = await User.register(newUser, password); //this hashes and stores the password
        req.login(registeredUser, err => {
            if(err){
                return next(err);
            } 
            req.flash('success', `Welcome, ${username}! Your account has been created.`);
            res.redirect('/');
        }); //req.login is automatically called by passport.authenticate, but required here
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
});

// Non-CRUD routes
//login form
module.exports.renderLoginForm = (req, res, next) => {
    res.render('users/login');
};

//login
module.exports.login = (req, res, next) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

//logout
module.exports.logout = (req, res, next) => { 
    req.logout();
    req.flash('success', 'You are now logged out.');
    res.redirect('/');
};