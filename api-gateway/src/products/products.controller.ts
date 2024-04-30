import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { Observable, catchError, timeout } from 'rxjs';
import { ValidateResponseDto } from 'src/common/decorators/validate-response-dto.decorator';
import { PRODUCT_MICROSERVICE } from './constants.services';
import { CreateProductRequestDto } from './dtos/request-dto/create-product.request.dto';
import { PaginationQueryParamsDto } from './dtos/request-dto/pagination.query.dto';
import { UpdateProductRequestDto } from './dtos/request-dto/update-product.request.dto';
import { ProductListResponseDto } from './dtos/response-dto/product-list.response.dto';
import { ProductResponseDto } from './dtos/response-dto/product.response.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_MICROSERVICE) private readonly productMService: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
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
  async getProducts(@Query() pagination: PaginationQueryParamsDto) {
    // 1-  check if data is in cache:
    const cachedData = await this.cacheService.get(
      `products-list-${pagination.page}-${pagination.limit}`,
    );

    const getData = () =>
      new Promise((resolve, reject) => {
        this.productMService
          .send({ cmd: 'find_all_products' }, pagination)
          .pipe(timeout(5000))
          .subscribe({
            next: (data) => {
              this.cacheService.set(
                `products-list-${pagination.page}-${pagination.limit}`,
                data,
              );
              resolve(data);
            },
            error: (err) => {
              reject(new RpcException(err));
            },
          });
      });

    if (cachedData) {
      getData();
      return cachedData;
    }

    // if not, call API and set the cache:
    return getData();
  }

  @Get(':id')
  @ValidateResponseDto(ProductResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // 1-  check if data is in cache:
    const cachedData = await this.cacheService.get(`product-${id}`);
    const getData = () =>
      new Promise((resolve, reject) => {
        this.productMService
          .send({ cmd: 'find_one_product' }, id)
          .pipe(timeout(5000))
          .subscribe({
            next: (data) => {
              this.cacheService.set(`product-${id}`, data);
              resolve(data);
            },
            error: (err) => {
              reject(new RpcException(err));
            },
          });
      });

    if (cachedData) {
      console.log('cachedData', cachedData);
      getData();
      return cachedData;
    }

    // if not, call API and set the cache:
    return getData();
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
