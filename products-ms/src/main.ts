import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { natsOptions } from './app/constants';
import { setupMicroservice } from './setup-microservice';

async function bootstrap() {
  const logger = new Logger('Products Microservice');

  // API
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  // setupApp(app);
  // await app.listen(configService.getOrThrow<number>('PORT'));

  // MICROSERVICE TCP
  const microserviceAppTCP =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0', // esto es necesario para k8s
        port: configService.getOrThrow<number>('PORT'),
      },
    });
  setupMicroservice(microserviceAppTCP);
  await microserviceAppTCP.listen();
  logger.log(
    `Microservice with TCP is running on port: ${configService.getOrThrow<number>('PORT')}`,
  );

  // MICROSERVICE NATS
  const microserviceAppNATS =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.NATS,
      options: {
        servers: [configService.getOrThrow<string>('NATS_SERVERS')],
        ...natsOptions,
      },
    });
  setupMicroservice(microserviceAppNATS);
  await microserviceAppNATS.listen();
  logger.log(`Microservice with NATS is running`);
}
bootstrap();
