const Joi = require('joi');

const authschema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
});

module.exports = {
    authschema,
};