import { Inject, Injectable } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/app/constants';
import {
  ProductCreated,
  ProductCreatedEvent,
} from 'src/products/domain/events/product-created.event';

@Injectable()
export class CreatedProductPublisher {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientNats) {}

  async publish(data: ProductCreated) {
    await this.client.connect();
    this.client.emit<string, ProductCreated>(ProductCreatedEvent, data);
  }
}
