import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ValidateErrors } from 'src/common/decorators/validate-error.decorator';
import { ValidateResponseDto } from 'src/common/decorators/validate-response-dto.decorator';
import { CreateProductsService } from 'src/products/application/create-products.service';
import { DeleteProductService } from 'src/products/application/delete-product.service';
import { FindAllProductsService } from 'src/products/application/find-all-products.service';
import { FindByIdProductService } from 'src/products/application/find-by-id-product.service';
import { UpdateProductService } from 'src/products/application/update-product.service';
import { ProductTCPControllerPort } from 'src/products/domain/ports/in/controller-tcp.port';
import { CreateProductRequestDto } from '../dtos/request-dto/create-product.request.dto';
import { PaginationQueryParamsDto } from '../dtos/request-dto/pagination.query.dto';
import { UpdateProductRequestDto } from '../dtos/request-dto/update-product.request.dto';
import { ProductListResponseDto } from '../dtos/response-dto/product-list.response.dto';
import { ProductResponseDto } from '../dtos/response-dto/product.response.dto';

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
  constructor(
    private readonly createProductsService: CreateProductsService,
    private readonly findAllProductsService: FindAllProductsService,
    private readonly findByIdProductService: FindByIdProductService,
    private readonly updateProductService: UpdateProductService,
    private readonly deleteProductService: DeleteProductService,
  ) {}

  @MessagePattern({ cmd: 'create_product' })
  @ValidateResponseDto(ProductResponseDto)
  create(@Payload() dto: CreateProductRequestDto): Promise<ProductResponseDto> {
    return this.createProductsService.create(dto);
  }

  @MessagePattern({ cmd: 'find_all_products' })
  @ValidateResponseDto(ProductListResponseDto)
  findAll(
    @Payload() pagination: PaginationQueryParamsDto,
  ): Promise<ProductListResponseDto> {
    return this.findAllProductsService.findAll(pagination);
  }

  @MessagePattern({ cmd: 'find_one_product' })
  @ValidateResponseDto(ProductResponseDto)
  findOne(@Payload() id: number) {
    // { id }
    return this.findByIdProductService.findOne(+id);
  }

  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() dto: UpdateProductRequestDto & { id: number }) {
    return this.updateProductService.update(dto.id, dto);
  }

  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload() id: number) {
    return this.deleteProductService.remove(+id);
  }
}
