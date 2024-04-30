import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDao } from '../infrastructure/out/sql-orm/order.dao';

@Injectable()
export class FindAllOrdersService {
  constructor(
    @InjectRepository(OrderDao)
    private orderRepository: Repository<OrderDao>,
  ) {}

  findAll() {
    return this.orderRepository.find({
      cache: true,
      relations: { items: true },
    });
  }
}
