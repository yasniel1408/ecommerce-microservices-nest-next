import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ProductAggregate } from '../domain/product.aggregate';
import { UpdateProductRequestDto } from '../infrastructure/in/dtos/request-dto/update-product.request.dto';
import { ProductSQLAdapter } from '../infrastructure/out/sql-orm/product.repository';

@Injectable()
export class UpdateProductService {
  constructor(
    private sqlAdapter: ProductSQLAdapter,
    private productAggregate: ProductAggregate,
  ) {}

  async update(id: number, updateProductDto: UpdateProductRequestDto) {
    // 1- Pasamos por la capa de infraestructura para obtener el productos
    const product = await this.sqlAdapter.findById(id);

    // 2- Si no existe el producto lanzamos un error
    if (!product) {
      // throw new BadRequestException('Product not found');
      throw new RpcException({
        message: 'Product not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    // 3- Pasamos por la capa de dominio para que corran todas nuestras reglas de negocio
    this.productAggregate.createProduct(
      product.id,
      product.image,
      product.name,
      product.description,
      product.price,
    );

    // 4- Actualizamos el producto
    return this.sqlAdapter.updateById(id, updateProductDto);
  }
}
