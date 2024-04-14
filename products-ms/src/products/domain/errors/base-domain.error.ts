export class BaseDomainError extends Error {
  constructor(message: string) {
    super(message);
  }
}
