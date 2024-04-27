import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order-status.vo';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    return this.orderRepository.save({
      ...createOrderDto,
      status: OrderStatus.PENDING,
    });
  }

  findAll() {
    return this.orderRepository.find({ cache: true });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      cache: true,
      where: { id },
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

  async changeStatus(id: number, status: OrderStatus) {
    const order = await this.findOne(id);

    await this.orderRepository.update(id, {
      ...order,
      status,
      updatedAt: new Date(),
    });

    return order;
  }
}
