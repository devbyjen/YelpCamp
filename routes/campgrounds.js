const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const Campground = require('../models/campground');
// const ExpressError = require('../utilities/ExpressError');
const flash = require('connect-flash');
const {validateCampground, isLoggedIn, isAuthor} = require('../utilities/middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});




router.get('/new', isLoggedIn, 
    campgrounds.createForm);

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, upload.array('image', 3), validateCampground, campgrounds.create);
    // .post(upload.array('image'), (req, res) => {

    //     console.log(req.body, req.files);
    //     res.send('it worked?');
    // })

router.route('/:id')
    .get(campgrounds.show)
    .put(isLoggedIn, isAuthor, upload.array('image', 3), validateCampground, campgrounds.update)
    .delete(isLoggedIn, isAuthor, campgrounds.delete);

router.get('/:id/edit', isLoggedIn, isAuthor,
    campgrounds.updateForm);


module.exports = router;
