import {
  Post,
  Get,
  Put,
  Delete,
  Controller,
  Inject,
  Query,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PRODUCT_MICROSERVICE } from './constants.services';
import { Observable, catchError, timeout } from 'rxjs';
import { PaginationQueryParamsDto } from './dtos/request-dto/pagination.query.dto';
import { ValidateResponseDto } from 'src/common/decorators/validate-response-dto.decorator';
import { ProductListResponseDto } from './dtos/response-dto/product-list.response.dto';
import { ProductResponseDto } from './dtos/response-dto/product.response.dto';
import { CreateProductRequestDto } from './dtos/request-dto/create-product.request.dto';
import { UpdateProductRequestDto } from './dtos/request-dto/update-product.request.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_MICROSERVICE) private readonly productMService: ClientProxy,
  ) {}

  @Post()
  @ValidateResponseDto(ProductResponseDto)
  createProduct(
    @Body() dto: CreateProductRequestDto,
  ): Observable<ProductResponseDto> {
    return this.productMService
      .send({ cmd: 'create_product' }, dto)
      .pipe(timeout(5000))
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Get()
  @ValidateResponseDto(ProductListResponseDto)
  public getProducts(
    @Query() pagination: PaginationQueryParamsDto,
  ): Observable<ProductListResponseDto> {
    // el send es para esperar una respuesta el emit no espera respuesta
    return this.productMService
      .send({ cmd: 'find_all_products' }, pagination)
      .pipe(timeout(5000))
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Get(':id')
  @ValidateResponseDto(ProductResponseDto)
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<ProductResponseDto> {
    return this.productMService
      .send({ cmd: 'find_one_product' }, id)
      .pipe(timeout(5000))
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Put(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductRequestDto,
  ) {
    return this.productMService
      .send({ cmd: 'update_product' }, { id, ...dto })
      .pipe(timeout(5000))
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productMService
      .send({ cmd: 'delete_product' }, id)
      .pipe(timeout(5000))
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
