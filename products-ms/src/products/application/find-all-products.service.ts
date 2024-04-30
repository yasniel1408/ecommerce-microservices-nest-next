import { Injectable } from '@nestjs/common';
import { ProductAggregate } from '../domain/product.aggregate';
import { PaginationQueryParamsDto } from '../infrastructure/in/dtos/request-dto/pagination.query.dto';
import { ProductSQLAdapter } from '../infrastructure/out/sql-orm/product.repository';

@Injectable()
export class FindAllProductsService {
  constructor(
    private sqlAdapter: ProductSQLAdapter,
    private productAggregate: ProductAggregate,
  ) {}

  async findAll(pagination: PaginationQueryParamsDto) {
    // 1- Pasamos por la capa de infraestructura para obtener los productos
    const productList = await this.sqlAdapter.findAll(pagination);

    // 2- Pasamos por la capa de dominio para que corran todas nuestras reglas de negocio
    this.productAggregate.addAllProducts(productList.data);

    // 3- Retornamos los productos si todo esta ok
    return productList;
  }
}
