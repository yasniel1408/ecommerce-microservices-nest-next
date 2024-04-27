import { Expose, Type } from 'class-transformer';
import { OrderResponseDto } from './order.response.dto';

export class OrdersListResponseDto {
  @Expose()
  @Type(() => OrderResponseDto)
  data: OrderResponseDto[];
}
