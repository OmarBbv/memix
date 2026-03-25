import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { Discount } from '../../discounts/entities/discount.entity';

export enum CampaignType {
  DISCOUNT = 'discount',
  BUY_X_GET_Y = 'buy_x_get_y',
  FREE_SHIPPING = 'free_shipping',
  BUNDLE = 'bundle',
}

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // "Qış Endirimi", "3 Al 1 Hədiyyə"

  @Column({ type: 'text', nullable: true })
  description: string; // Açıqlama mətni

  @Column({ type: 'enum', enum: CampaignType, default: CampaignType.DISCOUNT })
  type: CampaignType;

  @Column({ nullable: true })
  imageUrl: string; // Kampaniya şəkli (banner)

  @Column({ nullable: true })
  badgeText: string; // "50%", "3+1", "VIP" kimi qısa etiket

  @Column({ nullable: true })
  badgeColor: string; // "#e11d48" (rose-500) kimi rəng

  @Column({ nullable: true })
  backgroundColor: string; // Kart arxa fon rəngi

  @Column({ nullable: true })
  link: string; // Kampaniya linki

  @ManyToOne(() => Coupon, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  coupon: Coupon; // Əlaqəli promo kod (nullable)

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  order: number; // Sıralama

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Discount, (discount) => discount.campaign)
  discounts: Discount[];
}
