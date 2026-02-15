import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  holderName: string;

  @Column()
  cardNumberMasked: string; // e.g. **** **** **** 1234

  @Column({ length: 4 })
  last4: string;

  @Column()
  brand: string; // visa, mastercard, amex

  @Column()
  expMonth: number;

  @Column()
  expYear: number;

  @Column({ default: 'blue' })
  color: string; // blue, black, purple, pink

  @ManyToOne(() => User, (user) => user.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}
