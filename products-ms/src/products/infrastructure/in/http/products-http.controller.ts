import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ValidateErrors } from 'src/common/decorators/validate-error.decorator';
import { ValidateResponseDto } from 'src/common/decorators/validate-response-dto.decorator';
import { CreateProductsService } from 'src/products/application/create-products.service';
import { DeleteProductService } from 'src/products/application/delete-product.service';
import { FindAllProductsService } from 'src/products/application/find-all-products.service';
import { FindByIdProductService } from 'src/products/application/find-by-id-product.service';
import { UpdateProductService } from 'src/products/application/update-product.service';
import { ProductControllerPort } from 'src/products/domain/ports/in/controller.port';
import { CreateProductRequestDto } from '../dtos/request-dto/create-product.request.dto';
import { PaginationQueryParamsDto } from '../dtos/request-dto/pagination.query.dto';
import { UpdateProductRequestDto } from '../dtos/request-dto/update-product.request.dto';
import { ProductListResponseDto } from '../dtos/response-dto/product-list.response.dto';
import { ProductResponseDto } from '../dtos/response-dto/product.response.dto';

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
  constructor(
    private readonly createProductsService: CreateProductsService,
    private readonly findAllProductsService: FindAllProductsService,
    private readonly findByIdProductService: FindByIdProductService,
    private readonly updateProductService: UpdateProductService,
    private readonly deleteProductService: DeleteProductService,
  ) {}

  @Post()
  @ValidateResponseDto(ProductResponseDto)
  create(@Body() dto: CreateProductRequestDto): Promise<ProductResponseDto> {
    return this.createProductsService.create(dto);
  }

  @Get()
  @ValidateResponseDto(ProductListResponseDto)
  findAll(
    @Query() pagination: PaginationQueryParamsDto,
  ): Promise<ProductListResponseDto> {
    return this.findAllProductsService.findAll(pagination);
  }

  @Get(':id')
  @ValidateResponseDto(ProductResponseDto)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findByIdProductService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductRequestDto,
  ) {
    return this.updateProductService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteProductService.remove(+id);
  }
}
