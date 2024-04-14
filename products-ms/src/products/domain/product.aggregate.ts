import { Injectable } from '@nestjs/common';
import { Product } from './entities/Product';
import { ProductFactory } from './product.factory';

@Injectable()
export class ProductAggregate {
  private products: Product[] = [];

  addAllProducts(products: any[]): void {
    products.forEach((product) => {
      const p = this.createProduct(
        product.id,
        product.image,
        product.name,
        product.description,
        product.price,
      );
      this.products.push(p);
    });

    this.products = products;
  }

  createProduct(id, image, name, description, price): Product {
    const product = ProductFactory.createProduct({
      id,
      image,
      name,
      description,
      price,
    });

    return product;
  }

  getProducts(): Product[] {
    return this.products;
  }
}
