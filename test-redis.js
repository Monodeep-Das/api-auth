// test-redis.js
const redis = require('redis');

const client = redis.createClient({
    port: 6379,
    host: '127.0.0.1'
});

client.on('connect', () => {
    console.log('Redis connected');
});

client.on('ready', () => {
    console.log('Redis ready to use');
});

client.on('error', (err) => {
    console.error('Redis error:', err.message);
});

client.on('end', () => {
    console.log('Redis disconnected');
});

client.set('test_key', 'test_value', (err, reply) => {
    if (err) console.error('Error setting key:', err.message);
    console.log('Set key reply:', reply);
    client.get('test_key', (err, reply) => {
        if (err) console.error('Error getting key:', err.message);
        console.log('Get key reply:', reply);
        client.quit();
    });
});
