import { Expose } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class OrderItemDto {
  @Expose()
  @IsNumber()
  @IsPositive()
  productId: number;

  @Expose()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @Expose()
  @IsNumber()
  @IsPositive()
  price: number;
}
