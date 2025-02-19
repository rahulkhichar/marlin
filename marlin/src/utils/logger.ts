import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logger = new Logger('App');

  info(message: string, meta?: any) {
    this.logger.log({ level: 'info', message, meta });
  }

  warn(message: string, meta?: any) {
    this.logger.warn({ level: 'warn', message, meta });
  }

  error(message: string, trace?: any) {
    this.logger.error({ level: 'error', message, trace });
  }
}
