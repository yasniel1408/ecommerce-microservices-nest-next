import { faker } from '@faker-js/faker';
import axios from 'axios';

async function createProducts() {
  try {
    for (let i = 0; i < 1000; i++) {
      const productData = {
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        image: faker.image.imageUrl(),
        description: faker.commerce.productDescription(),
      };
      await axios.post('http://ecommerce.com/api/v1/products', productData);
    }
    console.log('Productos creados exitosamente');
  } catch (error) {
    console.error('Error al crear productos:', error);
  }
}

createProducts();
