import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
  console.log("redis connected");
});

export default redis;

/*
- Redis is a fast, in-memory key-value data store used mainly for caching, sessions, temporary data, and real-time operations.
- MongoDB stores the user permanently; Redis stores the user's temporary session.
*/
