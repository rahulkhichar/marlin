import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RateLimiter } from './RateLimtter.interface';

@Injectable()
export class SlidingWindowRateLimiterService implements RateLimiter {
  private redisClient: Redis;
  private readonly RATE_LIMIT = 10; // Max requests allowed
  private readonly WINDOW_SIZE = 60; // Time window in seconds

  constructor() {
    this.redisClient = new Redis();
  }

  async isRateLimited(userId: string): Promise<boolean> {
    const key = `sliding_rate_limit:${userId}`;
    const now = Date.now();
    const windowStart = now - this.WINDOW_SIZE * 1000; // Oldest allowed request

    // Remove outdated requests
    await this.redisClient.zremrangebyscore(key, 0, windowStart);

    // Count remaining requests
    const requestCount = await this.redisClient.zcard(key);

    if (requestCount >= this.RATE_LIMIT) {
      return true;
    }

    // Add current request
    await this.redisClient.zadd(key, now, now.toString());
    await this.redisClient.expire(key, this.WINDOW_SIZE); // Expire key if no more requests

    return false;
  }
}
