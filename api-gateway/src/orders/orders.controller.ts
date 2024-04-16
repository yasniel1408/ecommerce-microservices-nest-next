import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, catchError, timeout } from 'rxjs';
import { ValidateResponseDto } from 'src/common/decorators/validate-response-dto.decorator';
import { ProductListResponseDto } from 'src/products/dtos/response-dto/product-list.response.dto';
import { ProductResponseDto } from 'src/products/dtos/response-dto/product.response.dto';
import { ORDERS_MICROSERVICE } from './constants.services';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_MICROSERVICE) private readonly orderMService: ClientProxy,
  ) {}

  @Post()
  @ValidateResponseDto(ProductResponseDto)
  createProduct(@Body() dto: any): Observable<ProductResponseDto> {
    return this.orderMService
      .send({ cmd: 'create_order' }, dto)
      .pipe(timeout(5000))
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Get()
  @ValidateResponseDto(ProductListResponseDto)
  public getProducts(): Observable<ProductListResponseDto> {
    return this.orderMService
      .send({ cmd: 'find_all_orders' }, {})
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
    return this.orderMService
      .send({ cmd: 'find_one_order' }, id)
      .pipe(timeout(5000))
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Patch(':id')
  @ValidateResponseDto(ProductResponseDto)
  changeStatus(@Param('id', ParseIntPipe) id: number): Observable<any> {
    return this.orderMService
      .send({ cmd: 'change_status' }, id)
      .pipe(timeout(5000))
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
