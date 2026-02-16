import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

@Entity('discounts')
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: DiscountType, default: DiscountType.PERCENTAGE })
  type: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number; // Endirim dəyəri

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Product, (product) => product.discount, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
