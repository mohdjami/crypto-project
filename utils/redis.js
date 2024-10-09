import Redis from "ioredis";
const uri = process.env.REDIS_URI;
if (!uri) {
  throw new Error("Please provide a redis uri");
}
const redis = new Redis(uri);
export const acquireLock = async (lock, ttl) => {
  const value = await redis.set(lock, "lock", "PX", ttl, "NX");
  console.log(value);
  if (value === "OK") {
    return true;
  }
  return false;
};

export const releaseLock = async (lock) => {
  await redis.del(lock);
  // await redis.set("foo", "bar");
};

export default redis;
