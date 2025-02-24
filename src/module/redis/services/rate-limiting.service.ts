import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RateLimitStrategy } from '../enum';
import { SlidingWindowRateLimiterService } from './sliding-window-limiter.service';
import { FixedWindowRateLimiterService } from './fixed-window-limiter.service';

@Injectable()
export class RateLimiterService {
  constructor(
    private readonly slidingWindowRateLimiterService: SlidingWindowRateLimiterService,
    private readonly fixedWindowRateLimiterService: FixedWindowRateLimiterService,
  ) {}

  async isRateLimited(
    userId: string,
    rateLimitStrategy: RateLimitStrategy = RateLimitStrategy.FIXED_WINDOW, // Default to Fixed Window
  ): Promise<boolean> {
    switch (rateLimitStrategy) {
      case RateLimitStrategy.FIXED_WINDOW:
        return this.fixedWindowRateLimiterService.isRateLimited(userId);
      case RateLimitStrategy.SLIDING_WINDOW:
        return this.slidingWindowRateLimiterService.isRateLimited(userId);
      default:
        return this.fixedWindowRateLimiterService.isRateLimited(userId);
    }
  }
}
