import { createClient } from "redis";

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("ready", () => {
  console.log(
    `✅ Redis is running at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  );
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("❌ Failed to connect to Redis:", err);
  }
})();

process.on("SIGINT", async () => {
  await redisClient.disconnect();
  process.exit(0);
});

export default redisClient;
