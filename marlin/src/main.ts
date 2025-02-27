import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ThrottlingInterceptor } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally

  const globalPrefix = 'marlin/api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalInterceptors(new ThrottlingInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
