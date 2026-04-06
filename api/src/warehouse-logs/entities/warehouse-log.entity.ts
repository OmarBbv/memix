import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('warehouse_logs')
export class WarehouseLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  recordDate: Date;

  @Column({ type: 'int', default: 0 })
  productCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
