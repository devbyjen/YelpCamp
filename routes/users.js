const express = require('express');
const router = express.Router({mergeParams: true});
// const dataSchemas = require('../dataSchemas');
// const ExpressError = require('../utilities/ExpressError');
const wrapAsync = require('../utilities/wrapAsync');
const User = require('../models/user');
const passport = require('passport');
const {validateUser} = require('../utilities/middleware');

//CRUD

//CREATE: new user form
router.get('/register', (req, res) => {
    res.render('users/register');
})

//CREATE: new user
router.post('/register', validateUser, wrapAsync(async(req, res, next) => {
    try {
        const {username, email, password} = req.body;  
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password); //this hashes and stores the password
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', `Welcome, ${username}! Your account has been created.`);
            res.redirect('/');
        }); //req.login is automatically called by passport.authenticate, but required here
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

// Non-CRUD routes
//login form
router.get('/login', (req, res, next) => {
    res.render('users/login');
})

//login
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res, next) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

//logout
router.post('/logout', (req, res, next) => { 
    req.logout();
    req.flash('success', 'You are now logged out.');
    res.redirect('/');
})


module.exports = router;
