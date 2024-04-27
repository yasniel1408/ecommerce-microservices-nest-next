import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from './order-status.vo';

@Entity({ name: 'orders' })
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
}
