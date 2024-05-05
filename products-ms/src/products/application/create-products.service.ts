import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ProductAggregate } from '../domain/product.aggregate';
import { CreateProductRequestDto } from '../infrastructure/in/dtos/request-dto/create-product.request.dto';
import { CreatedProductPublisher } from '../infrastructure/out/publisher/created-product.publisher';
import { ProductSQLAdapter } from '../infrastructure/out/sql-orm/product.repository';

@Injectable()
export class CreateProductsService {
  constructor(
    private sqlAdapter: ProductSQLAdapter,
    private productAggregate: ProductAggregate,
    private createdProductPublisher: CreatedProductPublisher,
  ) {}

  async create(createProductDto: CreateProductRequestDto) {
    // 1- Pasamos por la capa de dominio para que corran todas nuestras reglas de negocio
    this.productAggregate.createProduct(
      null,
      createProductDto.image,
      createProductDto.name,
      createProductDto.description,
      createProductDto.price,
    );

    // 2- Pasamos por la capa de infraestructura para guardar en la base de datos
    try {
      const newProduct = await this.sqlAdapter.save(createProductDto);

      // 3- Enviamos un mensaje al microservicio de ordenes
      this.createdProductPublisher.publish({
        productId: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
        available: newProduct.available,
        version: newProduct.version,
      });

      // 4- Retornamos el producto si todo esta ok
      return newProduct;
    } catch (error) {
      // throw new ConflictException('El nombre de usuario ya existe');
      if (
        error.sqlMessage &&
        error.sqlMessage.includes('UQ_NAME') &&
        error.code === 'ER_DUP_ENTRY'
      ) {
        throw new RpcException({
          message: 'The product name already exists',
          statusCode: HttpStatus.BAD_REQUEST,
          code: 'UQ_NAME',
        });
      }
    }
  }
}
