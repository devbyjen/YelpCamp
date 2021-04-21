const joi = require('joi');

const campground = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        description: joi.string().required(),
        images: joi.object({
            url: joi.string().required(),
            filename: joi.string().required()
        })
    }).required(),
    deleteImages: joi.array()
})

module.exports.campground = campground;

const review = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required()
    }).required()
})

module.exports.review = review;