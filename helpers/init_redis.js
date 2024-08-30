const Redis = require("ioredis");
// import {Redis} from 'ioredis';

// Create a Redis instance.
// By default, it will connect to localhost:6379.
// We are going to cover how to specify connection options soon.
const redis = new Redis();

redis.on("connect", () => {
    console.log('Redis connected');
});



module.exports = redis;
