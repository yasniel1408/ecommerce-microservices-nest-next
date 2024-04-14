import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductSQLAdapter } from '../infrastructure/out/sql-orm/product.repository';
import { ProductAggregate } from '../domain/product.aggregate';
import { CreateProductRequestDto } from '../infrastructure/in/dtos/request-dto/create-product.request.dto';
import { PaginationQueryParamsDto } from '../infrastructure/in/dtos/request-dto/pagination.query.dto';
import { UpdateProductRequestDto } from '../infrastructure/in/dtos/request-dto/update-product.request.dto';

@Injectable()
export class ProductsService {
  constructor(
    private sqlAdapter: ProductSQLAdapter,
    private productAggregate: ProductAggregate,
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
    const newProduct = await this.sqlAdapter.save(createProductDto);

    // 3- Retornamos el producto si todo esta ok
    return newProduct;
  }

  async findAll(pagination: PaginationQueryParamsDto) {
    // 1- Pasamos por la capa de infraestructura para obtener los productos
    const productList = await this.sqlAdapter.findAll(pagination);

    // 2- Pasamos por la capa de dominio para que corran todas nuestras reglas de negocio
    this.productAggregate.addAllProducts(productList.data);

    // 3- Retornamos los productos si todo esta ok
    return productList;
  }

  async findOne(id: number) {
    // 1- Pasamos por la capa de infraestructura para obtener el productos
    const product = await this.sqlAdapter.findById(id);

    // 2- Si no existe el producto lanzamos un error
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // 3- Pasamos por la capa de dominio para que corran todas nuestras reglas de negocio
    this.productAggregate.createProduct(
      product.id,
      product.image,
      product.name,
      product.description,
      product.price,
    );

    // 4- Retornamos el producto si todo esta ok
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductRequestDto) {
    // 1- Pasamos por la capa de infraestructura para obtener el productos
    const product = await this.sqlAdapter.findById(id);

    // 2- Si no existe el producto lanzamos un error
    if (!product) {
      throw new BadRequestException('Product not found');
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

  async remove(id: number) {
    // 1- Pasamos por la capa de infraestructura para obtener el productos
    const product = await this.sqlAdapter.findById(id);

    // 2- Si no existe el producto lanzamos un error
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // 3- Pasamos por la capa de dominio para que corran todas nuestras reglas de negocio
    this.productAggregate.createProduct(
      product.id,
      product.image,
      product.name,
      product.description,
      product.price,
    );

    // 4- Lo eliminamos
    this.sqlAdapter.removeById(id);

    // 4- Retornamos el producto si todo esta ok
    return product;
  }
}
