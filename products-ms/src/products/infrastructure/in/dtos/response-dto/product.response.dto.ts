import { Expose } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class ProductResponseDto {
  @IsNumber()
  @Expose()
  id: number;

  @IsString()
  @Expose()
  image: string;

  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  description: string;

  @IsNumber()
  @Expose()
  @IsPositive()
  price: number;

  @IsString()
  @Expose()
  createdAt: Date;

  @IsString()
  @Expose()
  updatedAt: Date;
}
