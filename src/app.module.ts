import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './module/redis/redis.module';
import { RateLimiterService } from './module/redis/services';

@Module({
  imports: [RedisModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
