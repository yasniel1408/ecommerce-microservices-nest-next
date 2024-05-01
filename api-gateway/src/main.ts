import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { setupApp } from './setup-app';

async function bootstrap() {
  // API Server
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  setupApp(app);
  await app.listen(configService.getOrThrow<number>('PORT'));

  const logger = new Logger('API Gateway');
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
