import { createClient, ClientOpts } from 'redis';
import { parseJSON } from '.';

declare const process: {
  env: {
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;
    REDIS_RETRY_DELAY: number;
  };
};

const connectionParams: ClientOpts = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
};

const redis = createClient(connectionParams)
  .on('error', (err) => console.log(err))
  .on('connect', () => console.log('=========Redis is connected========='));

export function set(key: string, value: any, duration?: number) {
  return new Promise((ful, rej) => {
    const cb = (err: any) => {
      if (err) return rej(err.message);
      ful(true);
    };

    if (typeof value !== 'string') value = JSON.stringify(value);
    if (duration) redis.setex(key, duration, value, cb);
    else redis.set(key, value, cb);
  });
}

export function get(key: any, field?: any) {
  return new Promise((ful, rej) => {
    if (typeof key !== 'string') key = String(key);
    if (field && typeof field !== 'string') field = String(field);
    const cb = (err: any, result: any) => {
      if (err) return rej(err.message);
      if (field) {
        if (result.expireAt < Date.now()) {
          redis.hdel(key, field);
          return ful(null);
        } else {
          result = result.data;
        }
      }

      ful(parseJSON(result));
    };
    if (field) redis.hget(key, field, cb);
    else redis.get(key, cb);
  });
}

export function purge(key: string, field?: string) {
  return new Promise((ful, rej) => {
    const cb = (err: any, result: any) => {
      if (err) return rej(err.message);
      ful(result);
    };

    if (field) redis.hdel(key, field, cb);
    else redis.del(key, cb);
  });
}

export function exists(key: string) {
  return new Promise((ful, rej) => {
    redis.exists(key, (err: any, result: any) => {
      if (err) return rej(err.message);
      ful(result);
    });
  });
}

export default redis;
