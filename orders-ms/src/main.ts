import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // API Server
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  // setupApp(app);
  // await app.listen(configService.getOrThrow<number>('PORT'));

  const logger = new Logger('Products Microservice');

  /// Microservice
  const microserviceApp =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0', // esto es necesario para k8s
        port: configService.getOrThrow<number>('PORT'),
      },
    });
  microserviceApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await microserviceApp.listen();
  logger.log(
    `Microservice is running on port: ${configService.getOrThrow<number>('PORT')}`,
  );
}
bootstrap();
