import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductStock } from './product-stock.entity';

@Entity('product_color_variants')
export class ProductColorVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.colorVariants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: number;

  @Column()
  color: string; // Rəng adı (məs: "Qara", "Ağ")

  @Column({ type: 'simple-array', nullable: true })
  images: string[]; // Bu rəngə məxsus şəkirlər

  @OneToMany(() => ProductStock, (stock) => stock.colorVariant)
  stocks: ProductStock[];
}
