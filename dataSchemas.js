const joiBase = require('joi');
const sanitizeHtml = require('sanitize-html');

//our helpful sanitize function
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
});

//add our helpful sanitize function
const joi = joiBase.extend(extension);

const campground = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        price: joi.number().min(0),
        location: joi.string().required(),
        description: joi.string(),
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
        body: joi.string().required().escapeHTML()
    }).required()
})

module.exports.review = review;