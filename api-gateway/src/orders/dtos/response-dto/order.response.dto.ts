import { Expose } from 'class-transformer';
import { IsPositive, Min } from 'class-validator';
import { OrderStatus } from '../order-status.vo';

export class OrderResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Min(1)
  @IsPositive()
  totalAmount: number;

  @Expose()
  @Min(1)
  @IsPositive()
  totalItems: number;

  @Expose()
  paid: boolean;

  @Expose()
  status: OrderStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
