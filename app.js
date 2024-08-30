const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
require('dotenv').config();
require('./helpers/init_mongodb');
const AuthRoute = require('./Routes/Auth.route');
const redis = require('./helpers/init_redis');
const { verifyAccessToken } = require('./helpers/jwt_helper');

const app = express();

// Ensure Redis is connected before performing any operations
redis.set('foo', 'bar', (err, reply) => {
    if (err) {
        console.error(err);
    }
    console.log(reply);
});

redis.get('foo', (err, reply) => {
    if (err) {
        console.error(err);
    }
    console.log(reply);
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', verifyAccessToken, async (req, res, next) => {
    res.send('Hello From Express');
});

app.use('/auth', AuthRoute);

app.use(async (req, res, next) => {
    next(createError.NotFound());
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
