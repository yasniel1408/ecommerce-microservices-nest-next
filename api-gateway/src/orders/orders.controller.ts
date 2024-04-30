import { CACHE_MANAGER } from '@nestjs/cache-manager';
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
import { Cache } from 'cache-manager';
import { Observable, catchError, timeout } from 'rxjs';
import { ValidateResponseDto } from 'src/common/decorators/validate-response-dto.decorator';
import { ORDERS_MICROSERVICE } from './constants.services';
import { ChangeStatusOrderRequestDto } from './dtos/request-dto/change-status-order.request.dto';
import { CreateOrderDto } from './dtos/request-dto/create-order.dto';
import { OrderResponseDto } from './dtos/response-dto/order.response.dto';
import { OrdersListResponseDto } from './dtos/response-dto/orders-list.response.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_MICROSERVICE) private readonly orderMService: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  @Post()
  @ValidateResponseDto(OrderResponseDto)
  createOrder(@Body() dto: CreateOrderDto): Observable<any> {
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
  @ValidateResponseDto(OrdersListResponseDto)
  async getOrders() {
    // 1-  check if data is in cache:
    const cachedData = await this.cacheService.get('orders-list');

    const getData = () =>
      this.orderMService
        .send({ cmd: 'find_all_orders' }, {})
        .pipe(timeout(5000))
        .pipe(
          catchError((err) => {
            throw new RpcException(err);
          }),
        )
        .subscribe((data) => {
          this.cacheService.set('orders-list', data);
        });

    if (cachedData) {
      getData();
      return cachedData;
    }

    // if not, call API and set the cache:
    return getData();
  }

  @Get(':id')
  @ValidateResponseDto(OrderResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // 1-  check if data is in cache:
    const cachedData = await this.cacheService.get(`order-${id}`);

    const getData = () =>
      this.orderMService
        .send({ cmd: 'find_one_order' }, id)
        .pipe(timeout(5000))
        .pipe(
          catchError((err) => {
            throw new RpcException(err);
          }),
        )
        .subscribe((data) => {
          this.cacheService.set(`order-${id}`, data);
        });

    if (cachedData) {
      getData();
      return cachedData;
    }

    // if not, call API and set the cache:
    return getData();
  }

  @Patch(':id')
  @ValidateResponseDto(OrderResponseDto)
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeStatusOrderRequestDto,
  ): Observable<any> {
    return this.orderMService
      .send({ cmd: 'change_status' }, { status: dto.status, id })
      .pipe(timeout(5000))
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
