import { IsEnum } from 'class-validator';
import { OrderStatus } from '../order-status.vo';

export class ChangeStatusOrderRequestDto {
  @IsEnum(OrderStatus, {
    message: `Status must be a valid value: ${OrderStatus.CANCELED}, ${OrderStatus.DELIVERED}, ${OrderStatus.PENDING}`,
  })
  status: OrderStatus;
}
