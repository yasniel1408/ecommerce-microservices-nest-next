import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // API Server
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  // setupApp(app);
  // await app.listen(configService.getOrThrow<number>('PORT'));

  const logger = new Logger('Products Microservice');

  // Microservice
  const microserviceApp =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.TCP,
      options: {
        port: configService.getOrThrow<number>('PORT'),
      },
    });
  await microserviceApp.listen();
  logger.log(
    `Microservice is running on port: ${configService.getOrThrow<number>('PORT')}`,
  );
}
bootstrap();
