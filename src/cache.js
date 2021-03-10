// TODO útfæra redis cache
import redis from 'redis';
import util from 'util';

import dotenv from 'dotenv';

dotenv.config();

const {
  REDIS_URL,
} = process.env;

const client = redis.createClient(REDIS_URL);
const asyncGet = util.promisify(client.get).bind(client);
const asyncSet = util.promisify(client.mset).bind(client);

export const getFromCache = async (key) => {
  const cached = await asyncGet(key);

  if (cached) {
    return cached;
  }
  return null;
};

export const writeToCache = async (key, data) => {
  await asyncSet(key, data);
};
