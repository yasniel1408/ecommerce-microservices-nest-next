import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ORDERS_MICROSERVICE } from './constants.services';
import { OrdersController } from './orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [
    // Configuring the client Gateway y sus microservices
    ClientsModule.registerAsync([
      {
        name: ORDERS_MICROSERVICE,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('ORDERS_MICROSERVICE_HOST'),
            port: configService.getOrThrow<number>('ORDERS_MICROSERVICE_PORT'),
          },
        }),
      },
    ]),
  ],
})
export class OrdersModule {}
