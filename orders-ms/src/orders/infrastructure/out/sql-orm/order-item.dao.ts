import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderDao } from './order.dao';
import { ProductDao } from './product.dao';

@Entity({ name: 'order_items' })
export class OrderItemDao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => OrderDao, (order) => order.items)
  order: OrderDao;

  @ManyToOne(() => ProductDao, (product) => product.items)
  product: ProductDao;

  @Column({ nullable: false })
  productId: number;

  @Column({ default: 1 })
  version: number;
}
