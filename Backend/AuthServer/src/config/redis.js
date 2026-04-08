const Redis = require("ioredis");

let redis;

if (!global._redis) {
  global._redis = new Redis(process.env.REDIS_URL, {
    tls: {}, // REQUIRED for Upstash
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

module.exports = redis;