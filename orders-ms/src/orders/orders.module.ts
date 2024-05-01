import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NATS_SERVICE } from 'src/app/constants';
import { ChangeStatusOrderService } from './application/change-status-order.service';
import { CreateOrderService } from './application/create-order.service';
import { CreateProductService } from './application/create-product.service';
import { FindAllOrdersService } from './application/find-all-orders.service';
import { FindByIdOrderService } from './application/find-by-id-order.service';
import { CreateProductSubscriberController } from './infrastructure/in/subscriber/create-product-subscriber.controlle';
import { OrdersTcpController } from './infrastructure/in/tcp/orders-tcp.controller';
import { DeleteProductPublisher } from './infrastructure/out/publisher/deleted-product-saga.publisher';
import { OrderItemDao } from './infrastructure/out/sql-orm/order-item.dao';
import { OrderDao } from './infrastructure/out/sql-orm/order.dao';
import { ProductDao } from './infrastructure/out/sql-orm/product.dao';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderDao, OrderItemDao, ProductDao]),
    ClientsModule.registerAsync([
      {
        name: NATS_SERVICE,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.getOrThrow<string>('NATS_SERVERS')],
            maxPingOut: 5,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrdersTcpController, CreateProductSubscriberController],
  providers: [
    FindAllOrdersService,
    CreateOrderService,
    FindByIdOrderService,
    ChangeStatusOrderService,
    CreateProductService,
    DeleteProductPublisher,
    CreateProductSubscriberController,
  ],
})
export class OrdersModule {}
