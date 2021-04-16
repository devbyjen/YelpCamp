const express = require('express');
const router = express.Router({mergeParams: true});
// const dataSchemas = require('../dataSchemas');
// const ExpressError = require('../utilities/ExpressError');
const wrapAsync = require('../utilities/wrapAsync');
const User = require('../models/user');
const passport = require('passport');
const {validateUser} = require('../utilities/middleware');
const users = require('../controllers/users');


router.route('/register')
    .get(users.renderRegisterForm)
    .post(validateUser, users.create);


router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.login);


router.post('/logout', users.logout);


module.exports = router;
