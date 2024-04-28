import { IsEnum, IsNumber } from 'class-validator';
import { OrderStatus } from '../entities/order-status.vo';

export class ChangeOrderStatusDto {
  @IsEnum(OrderStatus, {
    message: `Status must be a valid value: ${OrderStatus.CANCELED}, ${OrderStatus.DELIVERED}, ${OrderStatus.PENDING}`,
  })
  status: OrderStatus;

  @IsNumber()
  id: number;
}
