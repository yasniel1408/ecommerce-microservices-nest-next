import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from './order-status.vo';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'orders', schema: 'orders' })
export class Order {
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

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}
