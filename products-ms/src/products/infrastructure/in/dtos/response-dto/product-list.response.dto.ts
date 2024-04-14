import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from './product.response.dto';
import { IsNumber } from 'class-validator';

export class MetaDataDto {
  @Expose()
  @IsNumber()
  page: number;

  @Expose()
  @IsNumber()
  limit: number;

  @Expose()
  @IsNumber()
  total: number;
}

export class ProductListResponseDto {
  @Expose()
  @Type(() => ProductResponseDto)
  data: ProductResponseDto[];

  @Expose()
  @Type(() => MetaDataDto)
  meta: MetaDataDto;
}
