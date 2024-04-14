import { Product } from './entities/Product';
import { FieldRequiredError } from './errors/fild-required.error';
import { PriceNegativeError } from './errors/price-negative.error';

export class ProductFactory {
  static createProduct({ id, image, name, description, price }): Product {
    if (!image) {
      throw new FieldRequiredError('image');
    }

    if (!name) {
      throw new FieldRequiredError('name');
    }

    if (!description) {
      throw new FieldRequiredError('description');
    }

    if (!price) {
      throw new FieldRequiredError('price');
    }

    if (price < 0) {
      throw new PriceNegativeError();
    }

    const product = new Product()
      .setId(id)
      .setImage(image)
      .setName(name)
      .setDescription(description)
      .setPrice(price);

    return product;
  }
}
