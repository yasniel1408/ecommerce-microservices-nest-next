import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDao } from '../infrastructure/out/sql-orm/order.dao';

@Injectable()
export class FindByIdOrderService {
  constructor(
    @InjectRepository(OrderDao)
    private orderRepository: Repository<OrderDao>,
  ) {}

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      cache: true,
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      // throw new BadRequestException('Product not found');
      throw new RpcException({
        message: 'Order not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return order;
  }
}
