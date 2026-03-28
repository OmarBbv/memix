import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductColorVariant } from './product-color-variant.entity';

@Entity('product_stocks')
export class ProductStock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.stocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: number;

  @ManyToOne(() => ProductColorVariant, (variant) => variant.stocks, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'colorVariantId' })
  colorVariant: ProductColorVariant;

  @Column({ nullable: true })
  colorVariantId: number;

  @Column({ default: 0 })
  stock: number; // Bu məhsuldan neçə dənə var?

  @Column({ nullable: true })
  size: string; // Ölçü (S, M, L, XL, 30, 32 və s.)
}
