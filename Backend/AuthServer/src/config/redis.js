

// const Redis = require("ioredis");

// let redis;

// if (!global._redis) {
//   global._redis = new Redis(process.env.REDIS_URL, {
//     maxRetriesPerRequest: 2,
//     enableReadyCheck: false,
//     retryStrategy: (times) => {
//       if (times > 5) return null; // stop retrying
//       return Math.min(times * 200, 2000);
//     },
//   });

//   global._redis.on("connect", () => {
//     console.log("✅ Redis connected");
//   });

//   global._redis.on("error", (err) => {
//     console.error("❌ Redis FULL ERROR:", err);
//   });
// }

// redis = global._redis;

// module.exports = { redis };

// console.log("REDIS_URL:", process.env.REDIS_URL);

const Redis = require("ioredis");

let redis;

if (!global._redis) {
  global._redis = new Redis(process.env.REDIS_URL, {
    tls: {}, // ✅ REQUIRED for Upstash
    maxRetriesPerRequest: 1, // reduce noise
    enableReadyCheck: false,
  });

  global._redis.on("connect", () => {
    console.log("✅ Redis connected");
  });

  global._redis.on("error", (err) => {
    console.error("❌ Redis ERROR:", err.message);
  });
}

redis = global._redis;

module.exports = { redis };