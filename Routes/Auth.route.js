const express = require('express');
const router = express.Router();
const createError = require('http-errors'); 
const User = require('../Models/User.model');
const { authschema } = require('../helpers/validation_schema');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper');


router.post('/register', async (req, res, next) => {
    try {
        const result = await authschema.validateAsync(req.body);

        const doesExist = await User.findOne({ email: result.email });
        if (doesExist) throw createError.Conflict(`${result.email} is already registered`);
    
        const user = new User(result);
        const savedUser = await user.save();
        const accessToken = await signAccessToken(savedUser.id);
        const refreshToken = await signRefreshToken(savedUser.id);
        res.send({accessToken, refreshToken});
    } catch (err) {
        if (err.isJoi === true) err.status = 422;
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const result = await authschema.validateAsync(req.body);
        const user = await User.findOne({ email: result.email });
        if (!user) throw createError.NotFound('User not registered');
        const isMatch = await user.isValidPassword(result.password);
        if (!isMatch) throw createError.Unauthorized('Username/Password not valid');
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);
        res.send({accessToken, refreshToken});
    } catch (error) {
        if (error.isJoi === true) return next(createError.BadRequest('Invalid Username/Password'));
        next(error);
    }
});

router.post('/refresh-token', async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) throw createError.BadRequest();
        const userId = await verifyRefreshToken(refreshToken);
        const accessToken = await signAccessToken(userId);
        const refToken = await signRefreshToken(userId);
        res.send({accessToken: accessToken, refreshToken: refToken});
    } catch (error) {
        next(error);
        
    }
});

router.delete('/logout', async (req, res, next) => {
    res.send('logout route');
});

module.exports = router;
