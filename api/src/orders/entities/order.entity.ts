import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'PENDING', // Sifariş verildi, təsdiq gözləyir
  PREPARING = 'PREPARING', // Hazırlanır
  READY = 'READY', // Hazırdır (Kuryer gözləyir)
  ON_WAY = 'ON_WAY', // Yoldadır
  DELIVERED = 'DELIVERED', // Çatdırıldı
  CANCELLED = 'CANCELLED', // Ləğv edildi
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'text', nullable: true })
  address: string; // Çatdırılma ünvanı (String kimi saxlayırıq)

  @Column({ type: 'varchar', nullable: true })
  contactPhone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
