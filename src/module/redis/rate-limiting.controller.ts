import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { RateLimiterService } from './services';
import { RateLimitStrategy } from './enum';
import { LoggingInterceptor } from 'src/utils';

@Controller()
@UseInterceptors(LoggingInterceptor)
export class RateLimmingController {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  @Get(':userId')
  async getHello(
    @Param('userId') userId: string,
    @Query('RateLimitStrategy') rateLimitStrategy?: RateLimitStrategy,
  ): Promise<boolean> {
    return this.rateLimiterService.isRateLimited(userId, rateLimitStrategy);
  }
}
