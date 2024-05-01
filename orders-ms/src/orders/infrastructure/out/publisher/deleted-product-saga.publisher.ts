import { Inject, Injectable } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/app/constants';
import {
  ProductDeletedEventSAGA,
  ProductDeletedSAGA,
} from 'src/orders/domain/events/product-deleted-saga.event';

@Injectable()
export class DeleteProductPublisher {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientNats) {}

  async publish(data: ProductDeletedSAGA) {
    await this.client.connect();
    this.client.emit<string, ProductDeletedSAGA>(ProductDeletedEventSAGA, data);
  }
}
