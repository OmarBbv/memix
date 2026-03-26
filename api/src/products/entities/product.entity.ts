import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { ProductStock } from '../../branches/entities/product-stock.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Discount } from '../../discounts/entities/discount.entity';
import { PriceHistory } from './price-history.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Məhsulun adı

  @Column({ type: 'text', nullable: true })
  description: string; // Məhsulun təsviri (açıqlaması)

  @Column({ unique: true, nullable: true })
  sku: string; // Məhsulun kodu (Məsələn: 1 801 292)

  @Column({ unique: true, nullable: true })
  guid1c: string; // 1C-den gelen GUID (Identifyer)

  @Column({ nullable: true })
  barcode: string; // Məhsulun barkodu (Məsələn: 2001801292005)

  @Column({ nullable: true })
  gender: string; // Cinsi (Qadin, Kisi, Usaq və s.)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight: number; // Çəki (Qramla)

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // Məhsulun qiyməti

  @Column({ type: 'simple-array', nullable: true })
  images: string[]; // Əlavə şəkillər (array formasında)

  @OneToMany(() => ProductStock, (stock) => stock.product)
  stocks: ProductStock[];

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category; // Məhsulun kateqoriyası

  @Column({ type: 'jsonb', nullable: true })
  variants: Record<string, any>; // Məhsul variantları (Ölçü, Rəng və s.)

  @Column({ type: 'text', nullable: true })
  banner: string | null; // Vitrin şəkili

  @Column({ type: 'simple-array', nullable: true })
  tags: string[]; // Məhsulun tagları (array formasında)

  @Column({ default: true })
  isActive: boolean; // Məhsulun aktivliyi

  @Column({ default: false })
  isFeatured: boolean; // Öne çıxan məhsul (Vitrin məhsulu)

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToOne(() => Discount, (discount) => discount.product, { nullable: true })
  discount: Discount;

  @OneToMany(() => PriceHistory, (priceHistory) => priceHistory.product)
  priceHistory: PriceHistory[];

  @CreateDateColumn()
  createdAt: Date; // Yaradılma tarixi

  @UpdateDateColumn()
  updatedAt: Date; // Yenilənmə tarixi
}
