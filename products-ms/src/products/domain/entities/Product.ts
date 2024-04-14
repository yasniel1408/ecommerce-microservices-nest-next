export class Product {
  id?: number;
  image: string;
  name: string;
  description: string;
  price: number;

  setId(id: number): Product {
    this.id = id;
    return this;
  }

  setImage(image: string): Product {
    this.image = image;
    return this;
  }

  setName(name: string): Product {
    this.name = name;
    return this;
  }

  setDescription(description: string): Product {
    this.description = description;
    return this;
  }

  setPrice(price: number): Product {
    this.price = price;
    return this;
  }
}
