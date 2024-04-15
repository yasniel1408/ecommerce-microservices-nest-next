import {
  Post,
  Get,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Body,
  Patch,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, catchError, timeout } from 'rxjs';
import { ORDERS_MICROSERVICE } from './constants.services';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_MICROSERVICE) private readonly orderMService: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() dto: any): Observable<any> {
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
  // @ValidateResponseDto(ProductListResponseDto)
  public getProducts(): Observable<any> {
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
  findOne(@Param('id', ParseIntPipe) id: number): Observable<any> {
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
