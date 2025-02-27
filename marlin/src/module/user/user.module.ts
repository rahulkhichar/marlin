import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { LoggerService } from 'src/utils';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: { host: 'localhost', port: 6379 },
          ttl: 600000, // Cache expiration in seconds
        }),
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, LoggerService],
  exports: [UserService],
})
export class UserModule {}
