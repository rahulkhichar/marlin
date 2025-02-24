import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/utils';
import axios from 'axios';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private readonly RATE_LIMITING_URL =
    'http://localhost:3002/marlin/rate-limiting';
  constructor(private readonly logger: LoggerService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const userId = (req.headers['x-user-id'] as string) || 'default_user';

    if (await this.isRateLimited(userId)) {
      res.status(429).json({ error: 'Rate limit exceeded' });
      return false;
    }

    return true;
  }

  async isRateLimited(userId: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.RATE_LIMITING_URL}/${userId}`);

      // Log the successful response
      this.logger.info(
        `✅ Rate limit check for user ${userId}: ${response.data}`,
      );

      return response.data;
    } catch (error) {
      // Log the error
      this.logger.error(
        `❌ Error checking rate limit for user ${userId}: ${error.message}`,
      );

      // Handle specific HTTP errors
      if (error.response) {
        const status = error.response.status;
        if (status === 404)
          throw new NotFoundException(`User ${userId} not found`);
        if (status === 409)
          throw new ConflictException(`Rate limit conflict for user ${userId}`);
      }

      // Generic fallback: Assume not rate-limited in case of failure
      throw new InternalServerErrorException(
        'Rate limit check failed. Please try again later.',
      );
    }
  }
}
