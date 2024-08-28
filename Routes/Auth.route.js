const express = require('express');
const router = express.Router();
const createError = require('http-errors'); 
const User = require('../Models/User.model');
const { authschema } = require('../helpers/validation_schema');
const { signAccessToken } = require('../helpers/jwt_helper');

router.post('/register', async (req, res, next) => {
    try {
        const result = await authschema.validateAsync(req.body);

        const doesExist = await User.findOne({ email: result.email });
        if (doesExist) throw createError.Conflict(`${result.email} is already registered`);
    
        const user = new User(result);
        const savedUser = await user.save();
        const accessToken = await signAccessToken(savedUser.id);
        res.send({accessToken});
    } catch (err) {
        if (err.isJoi === true) err.status = 422;
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const result = await authschema.validateAsync(req.body);

    } catch (error) {
        next(error);
    }
});

router.post('/refresh-token', async (req, res, next) => {
    res.send('refresh-token route');
});

router.delete('/logout', async (req, res, next) => {
    res.send('logout route');
});

module.exports = router;
