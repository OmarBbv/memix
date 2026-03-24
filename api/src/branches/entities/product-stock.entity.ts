import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Branch } from './branch.entity';

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

  @ManyToOne(() => Branch, (branch) => branch.stocks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  @Column()
  branchId: number;

  @Column({ default: 0 })
  stock: number; // Bu filialda bu məhsuldan neçə dənə var?

  @Column({ nullable: true })
  size: string; // Ölçü (S, M, L, XL, 30, 32 və s.)

  @Column({ nullable: true })
  color: string; // Rəng (Qırmızı, Mavi, Qara və s.)
}
