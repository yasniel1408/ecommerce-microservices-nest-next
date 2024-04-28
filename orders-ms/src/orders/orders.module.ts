import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersTcpController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrdersTcpController],
  providers: [OrdersService],
})
export class OrdersModule {}
