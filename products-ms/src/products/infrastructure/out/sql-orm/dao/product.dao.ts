import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'products' })
@Unique('UQ_NAME', ['name'])
export class ProductDao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  image: string;

  @Column({
    length: 100,
  })
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

  @Column({ default: 1 })
  version: number;
}
