import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RateLimiter } from './RateLimtter.interface';

@Injectable()
export class FixedWindowRateLimiterService implements RateLimiter {
  private redisClient: Redis;
  private readonly RATE_LIMIT = 10; // Max requests allowed
  private readonly WINDOW_SIZE = 60; // Time window in seconds

  constructor() {
    this.redisClient = new Redis();
  }

  async isRateLimited(userId: string): Promise<boolean> {
    const key = `rate_limit:${userId}`;
    const count = await this.redisClient.get(key);

    if (!count) {
      await this.redisClient.setex(key, this.WINDOW_SIZE, 1); // Set key with expiry
      return false;
    } else if (parseInt(count) < this.RATE_LIMIT) {
      await this.redisClient.incr(key);
      return false;
    } else {
      return true;
    }
  }
}
