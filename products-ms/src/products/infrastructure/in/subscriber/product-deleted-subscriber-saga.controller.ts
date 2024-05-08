import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, NatsContext, Payload } from '@nestjs/microservices';
import { ValidateErrors } from 'src/common/decorators/validate-error.decorator';
import { DeleteProductService } from 'src/products/application/delete-product.service';
import {
  ProductDeletedEventSAGA,
  ProductDeletedSAGA,
} from 'src/products/domain/events/product-deleted-saga.event';

@Controller()
@ValidateErrors()
export class CreateProductSubscriberSAGAController {
  constructor(private readonly deleteProductService: DeleteProductService) {}

  @EventPattern(ProductDeletedEventSAGA)
  async deleteProductSAGA(@Payload() data, @Ctx() context: NatsContext) {
    console.log(`Subject: ${context.getSubject()}`, data);
    const { productId } = data as ProductDeletedSAGA;
    return await this.deleteProductService.remove(productId);
  }
}
