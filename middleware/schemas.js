const Joi = require('joi');

module.exports.skateSpotSchema = Joi.object({
    skatespot: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});