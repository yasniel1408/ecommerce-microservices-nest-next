import { Type } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateProductRequestDto {
  @IsString()
  image: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber({
    maxDecimalPlaces: 4,
    allowNaN: false,
  })
  @Min(0)
  @Type(() => Number) // transformar siempre a number
  price: number;
}
