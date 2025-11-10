const keys = require('./keys');
const redis = require('redis');

// Create Redis clients with new v4 API
const redisClient = redis.createClient({
  socket: {
    host: keys.redisHost,
    port: keys.redisPort,
  },
  legacyMode: false
});

const sub = redis.createClient({
  socket: {
    host: keys.redisHost,
    port: keys.redisPort,
  },
  legacyMode: false
});

// Connect Redis clients
redisClient.on('error', (err) => console.log('Redis Client Error', err));
sub.on('error', (err) => console.log('Redis Subscriber Error', err));

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

(async () => {
  await redisClient.connect();
  await sub.connect();
  console.log('Worker Redis clients connected');

  await sub.subscribe('insert', async (message) => {
    await redisClient.hSet('values', message, fib(parseInt(message)));
  });
  console.log('Worker subscribed to insert channel');
})();
