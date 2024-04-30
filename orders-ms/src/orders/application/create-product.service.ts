import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCreated } from '../domain/events/product-created.event';
import { ProductDao } from '../infrastructure/out/sql-orm/product.dao';

@Injectable()
export class CreateProductService {
  constructor(
    @InjectRepository(ProductDao)
    private orderItemRepository: Repository<ProductDao>,
  ) {}

  async create(item: ProductCreated) {
    const order = await this.orderItemRepository.save({
      id: item.productId,
      name: item.name,
      price: item.price,
      available: item.available,
    });

    return order;
  }
}
