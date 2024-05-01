import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCreated } from '../domain/events/product-created.event';
import { DeleteProductPublisher } from '../infrastructure/out/publisher/deleted-product-saga.publisher';
import { ProductDao } from '../infrastructure/out/sql-orm/product.dao';

@Injectable()
export class CreateProductService {
  constructor(
    @InjectRepository(ProductDao)
    private orderItemRepository: Repository<ProductDao>,
    private readonly deleteProductPublisher: DeleteProductPublisher,
  ) {}

  async create(item: ProductCreated) {
    try {
      const order = await this.orderItemRepository.save({
        id: item.productId,
        name: item.name,
        price: item.price,
        available: item.available,
      });

      return order;
    } catch (error) {
      // Implement SAGA pattern
      await this.deleteProductPublisher.publish({ productId: item.productId });
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
