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
import { Brand } from '../../brands/entities/brand.entity';
import { ProductStock } from './product-stock.entity';
import { ProductColorVariant } from './product-color-variant.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Discount } from '../../discounts/entities/discount.entity';
import { PriceHistory } from './price-history.entity';
import { LISTING_TYPE, type ListingType } from '../enums/listing.type.enum';

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

  @Column({ unique: true, nullable: true })
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

  @OneToMany(() => ProductColorVariant, (variant) => variant.product)
  colorVariants: ProductColorVariant[];

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category; // Məhsulun kateqoriyası

  @ManyToOne(() => Brand, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  brand: Brand; // Məhsulun brendi (Məsələn: Zara, Nike)

  @Column({ type: 'jsonb', nullable: true })
  variants: Record<string, any>; // Məhsul variantları (Ölçü, Rəng və s.)

  @Column({ type: 'jsonb', nullable: true })
  attributes: Record<string, any>; // Dinamik xüsusiyyətlər (Məsələn: Materyal: Pambıq, Kalıp: Slim Fit)

  @Column({ nullable: true })
  variantGroupId: string; // Eyni məhsulun fərqli rənglərini qruplaşdırmaq üçün (məs: "TREND-123")

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

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ enum: LISTING_TYPE, default: LISTING_TYPE.NEW })
  listingType: ListingType

  @CreateDateColumn()
  createdAt: Date; // Yaradılma tarixi

  @UpdateDateColumn()
  updatedAt: Date; // Yenilənmə tarixi
}
