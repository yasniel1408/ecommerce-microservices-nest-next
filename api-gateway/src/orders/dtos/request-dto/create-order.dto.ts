import { IsPositive, Min } from 'class-validator';

export class CreateOrderDto {
  @Min(1)
  @IsPositive()
  totalAmount: number;

  @Min(1)
  @IsPositive()
  totalItems: number;
}
