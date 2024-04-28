import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order-status.vo';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private myDataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const queryRunner = this.myDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // 1- Buscar los productos y validar que existan

    // 2- Calcular el total de la orden
    const totalAmount = createOrderDto.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    try {
      // 3- Crear los items de la orden, los prices deben ser validados
      await queryRunner.manager.save(OrderItem, createOrderDto.items);
      // 4- Crear la orden
      const orders = await queryRunner.manager.save(Order, {
        ...createOrderDto,
        paid: false,
        status: OrderStatus.PENDING,
        totalItems: createOrderDto.items.length,
        totalAmount,
      });
      await queryRunner.commitTransaction();
      return orders;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new RpcException({
        message: 'Error creating order',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.orderRepository.find({
      cache: true,
      relations: { items: true },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      cache: true,
      where: { id },
      relations: ['items'],
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
