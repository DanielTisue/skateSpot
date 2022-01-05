const Joi = require('joi');

module.exports.skateSpotSchema = Joi.object({
    skatespot: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.array().min(1).max(4),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        text: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});