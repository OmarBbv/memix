import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
