import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepositoryPort } from 'src/products/domain/ports/out/db-repository.port';
import { Repository } from 'typeorm';
import { CreateProductRequestDto } from '../../in/dtos/request-dto/create-product.request.dto';
import { PaginationQueryParamsDto } from '../../in/dtos/request-dto/pagination.query.dto';
import { UpdateProductRequestDto } from '../../in/dtos/request-dto/update-product.request.dto';
import { ProductDao } from './dao/product.dao';

@Injectable()
export class ProductSQLAdapter
  implements
    ProductRepositoryPort<
      CreateProductRequestDto,
      UpdateProductRequestDto,
      PaginationQueryParamsDto
    >
{
  constructor(
    @InjectRepository(ProductDao)
    private productDao: Repository<ProductDao>,
  ) {}

  save(createProductDto: CreateProductRequestDto) {
    return this.productDao.save({ ...createProductDto, available: true });
  }

  async findAll(pagination: PaginationQueryParamsDto) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const data = await this.productDao.findAndCount({
      cache: true,
      take: limit,
      skip,
      order: {
        name: 'ASC',
      },
      where: {
        available: true,
      },
    });

    return {
      data: data[0],
      meta: {
        page,
        limit,
        total: data[1],
      },
    };
  }

  findById(id: number) {
    return this.productDao.findOne({
      where: {
        id,
        available: true,
      },
      cache: true,
    });
  }

  updateById(id: number, updateProductDto: UpdateProductRequestDto) {
    return this.productDao.update(id, updateProductDto);
  }

  removeById(id: number) {
    return this.productDao.update(id, { available: false });
  }
}
