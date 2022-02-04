const Joi = require('joi');

module.exports.blogpostSchema = Joi.object({
    blogpost: Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});