import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  title: string; // Məsələn: "Ev", "İş"

  @Column({ type: 'varchar', length: 20 })
  phone: string; // Əlaqə nömrəsi

  @Column({ type: 'text' })
  addressLine1: string; // Əsas ünvan (Rayon, küçə, bina)

  @Column({ type: 'text', nullable: true })
  addressLine2: string; // Əlavə ünvan (Mənzil, blok, mərtəbə)

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zipCode: string;

  @Column({ default: false })
  isDefault: boolean; // Varsayılan ünvan

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}
