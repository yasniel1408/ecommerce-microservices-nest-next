import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DataSource } from 'typeorm';
import { OrderStatus } from '../domain/value-objects/order-status.vo';
import { CreateOrderDto } from '../infrastructure/in/dto/request/create-order.request.dto';
import { OrderItemDao } from '../infrastructure/out/sql-orm/order-item.dao';
import { OrderDao } from '../infrastructure/out/sql-orm/order.dao';
import { ProductDao } from '../infrastructure/out/sql-orm/product.dao';

@Injectable()
export class CreateOrderService {
  constructor(private myDataSource: DataSource) {}

  async create(createOrderDto: CreateOrderDto) {
    const queryRunner = this.myDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // 1- Calcular el total de la orden
    const totalAmount = createOrderDto.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    try {
      // 2- Validate products id
      await createOrderDto.items.forEach(async (item) => {
        await queryRunner.manager.find(ProductDao, {
          where: { id: item.productId },
        });
      });
      // 3- Crear los items de la orden, los prices deben ser validados
      await queryRunner.manager.save(OrderItemDao, createOrderDto.items);
      // 4- Crear la orden
      const orders = await queryRunner.manager.save(OrderDao, {
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

      if (error?.code === '23503') {
        throw new RpcException({
          message: 'Some Products not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      throw new RpcException({
        message: 'Error creating order',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await queryRunner.release();
    }
  }
}
