import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

export enum SizeType {
  BEDEN_TEXT = 'beden-text', // XS, S, M, L, XL, XXL, 3XL
  BEDEN_NUMERIC = 'beden-numeric', // 28, 30, 32, 34, 36, 38, 40, 42, 44
  AYAQQABI = 'ayaqqabi', // 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45
  UZUK = 'uzuk', // 14, 15, 16, 17, 18, 19, 20, 21, 22
  TEK_OLCU = 'tek-olcu', // STD (Standart)
  YAS_GRUPU = 'yas-grupu', // 0-3 ay, 3-6 ay, 6-12 ay, 1-2 yaş...
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true, unique: true })
  guid1c: string | null;

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

  @Column({
    type: 'enum',
    enum: SizeType,
    nullable: true,
    default: null,
  })
  sizeType: SizeType | null; // Kateqoriyanın ölçü tipi

  @ManyToOne(() => Category, (category) => category.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
