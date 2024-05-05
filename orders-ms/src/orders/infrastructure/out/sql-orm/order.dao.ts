import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../../../domain/value-objects/order-status.vo';
import { OrderItemDao } from './order-item.dao';

@Entity({ name: 'orders' })
export class OrderDao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalAmount: number;

  @Column()
  totalItems: number;

  @Column()
  paid: boolean;

  @Column()
  status: OrderStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => OrderItemDao, (item) => item.order)
  items: OrderItemDao[];

  @Column({ default: 1 })
  version: number;
}
