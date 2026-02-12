import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DiscountType {
  PERCENTAGE = 'percentage', // Faiz (məsələn: 20%)
  FIXED = 'fixed',           // Sabit məbləğ (məsələn: 10 AZN)
}

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // Promo kod (məsələn: SUMMER2024)

  @Column({ type: 'enum', enum: DiscountType })
  type: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number; // Endirim dəyəri (20 və ya 10.00)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minOrderAmount: number; // Minimum sifariş məbləği

  @Column({ type: 'int', nullable: true })
  usageLimit: number; // Ümumi istifadə limiti

  @Column({ type: 'int', default: 0 })
  usedCount: number; // Neçə dəfə istifadə olunub

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date; // Bitmə tarixi

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
