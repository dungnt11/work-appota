import * as redis from 'redis';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const redisCache = redis.createClient({
  url: process.env.REDIS_URL,
});


export default redisCache;