import { Module } from '@nestjs/common';
import { RedisConfigModule } from './redis.config';
import {
  FixedWindowRateLimiterService,
  RateLimiterService,
  SlidingWindowRateLimiterService,
} from './services';
import { RateLimmingController } from './rate-limiting.controller';
@Module({
  imports: [RedisConfigModule],
  providers: [
    FixedWindowRateLimiterService,
    SlidingWindowRateLimiterService,
    RateLimiterService,
  ],
  controllers: [RateLimmingController],
})
export class RedisModule {}
