import redis from 'redis'
import { promisify } from 'util'

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', () => {
      console.log('Redis client could not connect to server');
    });
  }


  /** Function to test connection */
  isAlive() {
    return this.client.connected;
  }

  /** function to return a value*/
  async get(key) {
    const redisGet = promisify(this.client.get).bind(this.client);
    const value = await redisGet(key);
    return value;
  }

  /** Asynchronous function to set a value in redis*/
  async set(key, value, duration) {
    const redisSet = promisify(this.client.set).bind(this.client);
    await redisSet(key, value);
    this.client.expire(key, duration);
  }

  /** Function to delete a key*/
  async del(key) {
    const redisDelete = promisify(this.client.del).bind(this.client);
    await redisDelete(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
