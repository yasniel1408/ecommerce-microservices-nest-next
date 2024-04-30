import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, NatsContext, Payload } from '@nestjs/microservices';
import { ValidateErrors } from 'src/common/decorators/validate-error.decorator';
import { CreateProductService } from 'src/orders/application/create-product.service';
import {
  ProductCreated,
  ProductCreatedEvent,
} from 'src/orders/domain/events/product-created.event';

@Controller()
@ValidateErrors()
export class CreateProductSubscriberController {
  constructor(private readonly createProductService: CreateProductService) {}

  @EventPattern(ProductCreatedEvent)
  async getDate(@Payload() data, @Ctx() context: NatsContext) {
    console.log(`Subject: ${context.getSubject()}`, data, context);
    await this.createProductService.create(data as ProductCreated);
  }
}
