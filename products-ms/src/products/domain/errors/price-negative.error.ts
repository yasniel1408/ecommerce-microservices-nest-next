import { BaseDomainError } from './base-domain.error';

export class PriceNegativeError extends BaseDomainError {
  constructor() {
    super('Price must be a positive number!!!');
  }
}
