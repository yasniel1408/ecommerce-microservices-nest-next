import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from 'src/products/application/products.service';
import { ValidateResponseDto } from 'src/common/decorators/validate-response-dto.decorator';
import { ValidateErrors } from 'src/common/decorators/validate-error.decorator';
import { CreateProductRequestDto } from '../dtos/request-dto/create-product.request.dto';
import { UpdateProductRequestDto } from '../dtos/request-dto/update-product.request.dto';
import { PaginationQueryParamsDto } from '../dtos/request-dto/pagination.query.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductResponseDto } from '../dtos/response-dto/product.response.dto';
import { ProductListResponseDto } from '../dtos/response-dto/product-list.response.dto';
import { ProductTCPControllerPort } from 'src/products/domain/ports/in/controller-tcp.port';

@Controller('products')
@ValidateErrors()
export class ProductsTCPController
  implements
    ProductTCPControllerPort<
      CreateProductRequestDto,
      UpdateProductRequestDto,
      PaginationQueryParamsDto
    >
{
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'create_product' })
  @ValidateResponseDto(ProductResponseDto)
  create(@Payload() dto: CreateProductRequestDto): Promise<ProductResponseDto> {
    return this.productsService.create(dto);
  }

  @MessagePattern({ cmd: 'find_all_products' })
  @ValidateResponseDto(ProductListResponseDto)
  findAll(
    @Payload() pagination: PaginationQueryParamsDto,
  ): Promise<ProductListResponseDto> {
    return this.productsService.findAll(pagination);
  }

  @MessagePattern({ cmd: 'find_one_product' })
  @ValidateResponseDto(ProductResponseDto)
  findOne(@Payload('id', ParseIntPipe) id: number) {
    // { id }
    return this.productsService.findOne(+id);
  }

  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() dto: UpdateProductRequestDto & { id: number }) {
    return this.productsService.update(dto.id, dto);
  }

  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(+id);
  }
}
