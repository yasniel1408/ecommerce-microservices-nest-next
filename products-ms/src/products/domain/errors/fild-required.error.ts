import { BaseDomainError } from './base-domain.error';

export class FieldRequiredError extends BaseDomainError {
  constructor(fieldName: string) {
    super(`${fieldName} is required`);
  }
}
