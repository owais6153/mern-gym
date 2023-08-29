import { createClient } from "redis";
import { config } from "dotenv";
config();

let client = {};
const redisInit = async () => {
  client = createClient({
    url: process.env.REDIS_URL,
  });
  await client.connect().then(console.log("Redis Connected"));
  client.on("error", (err) => console.log("Redis Client Error", err));
  return client;
};

const getByKey = async (key) => {
  let resp = await client.get(key);
  return JSON.parse(resp);
};

const setByKey = async (key, value, expiry = null) => {
  let response = await client.set(key, value);
  if (expiry) await client.expire(key, expiry);
  return response;
};

const redisConfig = { redisInit, getByKey, setByKey };
export default redisConfig;
