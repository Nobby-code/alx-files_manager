import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', () => {
      console.log('Redis client could not connect to server');
    });
  }

  /** checks whether redis server is still alive */
  isAlive() {
    return this.client.connected;
  }

  /** set value in redis server */
  async set(key, value, duration) {
    const redisSet = promisify(this.client.set).bind(this.client);
    await redisSet(key, value);
    this.client.expire(key, duration);
  }

  /** fetch value from redis server */
  async get(key) {
    const redisGet = promisify(this.client.get).bind(this.client);
    const valu = await redisGet(key);
    return valu;
  }

  /** unsets key from redis server */
  async del(key) {
    const redisDel = promisify(this.client.del).bind(this.client);
    await redisDel(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
