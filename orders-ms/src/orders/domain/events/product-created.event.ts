export const ProductCreatedEvent = 'product-created';

export class ProductCreated {
  constructor(
    public readonly productId: number,
    public readonly name: string,
    public readonly price: number,
    public readonly available: boolean,
    public readonly version: number,
  ) {}
}
