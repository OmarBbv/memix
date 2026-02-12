import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Kateqoriya adı

  @Column({ unique: true })
  slug: string; // URL-də istifadə üçün (məs: 'ayakkabi')

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
