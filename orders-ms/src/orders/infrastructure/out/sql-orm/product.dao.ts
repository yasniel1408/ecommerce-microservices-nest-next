import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { OrderItemDao } from './order-item.dao';

@Entity({ name: 'products' })
export class ProductDao {
  @Column({ unique: true })
  @PrimaryColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column('double precision')
  price: number;

  @Column({ default: true })
  available: boolean;

  @OneToMany(() => OrderItemDao, (item) => item.order)
  items: OrderItemDao[];

  @Column({ default: 1 })
  version: number;
}
