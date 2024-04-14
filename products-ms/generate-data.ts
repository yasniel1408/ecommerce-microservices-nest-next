import axios from 'axios';
import { faker } from '@faker-js/faker';

async function createProducts() {
  try {
    for (let i = 0; i < 1000; i++) {
      const productData = {
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        image: faker.image.imageUrl(),
        description: faker.commerce.productDescription(),
      };
      await axios.post('http://localhost:3000/api/v1/products', productData);
    }
    console.log('Productos creados exitosamente');
  } catch (error) {
    console.error('Error al crear productos:', error);
  }
}

createProducts();
