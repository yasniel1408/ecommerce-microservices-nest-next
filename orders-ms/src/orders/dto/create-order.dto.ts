import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { OrderStatus } from '../entities/order-status.vo';
import { OrderStatusList } from './order-status-list';

export class CreateOrderDto {
  @Min(1)
  @IsPositive()
  totalAmount: number;

  @Min(1)
  @IsPositive()
  totalItems: number;

  @IsBoolean()
  @IsOptional()
  paid: boolean = false;

  @IsEnum(OrderStatus, {
    message: `Status must be a valid value: ${OrderStatusList.join(', ')}`,
  })
  @IsOptional()
  status: string = OrderStatus.PENDING;
}
