import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDERS_MICROSERVICE } from './constants.services';
import { OrdersController } from './orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: ORDERS_MICROSERVICE,
        transport: Transport.TCP,
        options: {
          host: 'orders-service',
          port: 3000,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
