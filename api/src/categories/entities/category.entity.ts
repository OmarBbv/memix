import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  imageUrl: string | null;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  showOnHome: boolean;

  @ManyToOne(() => Category, (category) => category.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
