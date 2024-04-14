import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class ProductDao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  image: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column('text')
  description: string;

  @Column('double')
  price: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: true })
  available: boolean;
}
