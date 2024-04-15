import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupApp } from './setup-app';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

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
