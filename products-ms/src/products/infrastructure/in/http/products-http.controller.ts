import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from 'src/products/application/products.service';
import { ValidateResponseDto } from 'src/common/decorators/validate-response-dto.decorator';
import { ValidateErrors } from 'src/common/decorators/validate-error.decorator';
import { CreateProductRequestDto } from '../dtos/request-dto/create-product.request.dto';
import { UpdateProductRequestDto } from '../dtos/request-dto/update-product.request.dto';
import { PaginationQueryParamsDto } from '../dtos/request-dto/pagination.query.dto';
import { ProductResponseDto } from '../dtos/response-dto/product.response.dto';
import { ProductListResponseDto } from '../dtos/response-dto/product-list.response.dto';
import { ProductControllerPort } from 'src/products/domain/ports/in/controller.port';

@Controller('products')
@ValidateErrors()
export class ProductsHttpController
  implements
    ProductControllerPort<
      CreateProductRequestDto,
      UpdateProductRequestDto,
      PaginationQueryParamsDto
    >
{
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ValidateResponseDto(ProductResponseDto)
  create(@Body() dto: CreateProductRequestDto): Promise<ProductResponseDto> {
    return this.productsService.create(dto);
  }

  @Get()
  @ValidateResponseDto(ProductListResponseDto)
  findAll(
    @Query() pagination: PaginationQueryParamsDto,
  ): Promise<ProductListResponseDto> {
    return this.productsService.findAll(pagination);
  }

  @Get(':id')
  @ValidateResponseDto(ProductResponseDto)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductRequestDto,
  ) {
    return this.productsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(+id);
  }
}
