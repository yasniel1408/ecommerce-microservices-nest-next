import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../domain/value-objects/order-status.vo';
import { OrderDao } from '../infrastructure/out/sql-orm/order.dao';
import { FindByIdOrderService } from './find-by-id-order.service';

@Injectable()
export class ChangeStatusOrderService {
  constructor(
    @InjectRepository(OrderDao)
    private orderRepository: Repository<OrderDao>,
    private findByIdOrderService: FindByIdOrderService,
  ) {}

  async changeStatus(id: number, status: OrderStatus) {
    const order = await this.findByIdOrderService.findOne(id);

    if (order.status === status) {
      // microoptimization, asi no cambia el updatedAt en vano
      return order;
    }

    await this.orderRepository.update(id, {
      ...order,
      status,
      updatedAt: new Date(),
    });

    return order;
  }
}
