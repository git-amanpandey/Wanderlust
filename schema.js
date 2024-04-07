const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  list: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      url:Joi.string().allow("",null),
      filename:Joi.string(),
    }).allow("", null),
    category: Joi.string().valid('Trending','Room','Castle','Mountain-city','Amazing-pools','Farms','Camping','Arctic').required(),
  }).required(),
});


module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment:Joi.string().required(),
    rating:Joi.number().required().min(1).max(5),
  }).required(),
});