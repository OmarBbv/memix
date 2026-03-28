import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Attribute } from './attribute.entity';

@Entity('attribute_options')
export class AttributeOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string; // Məsələn: Pambıq, Poliester, 40-dəq

  @ManyToOne(() => Attribute, (attribute) => attribute.options, { onDelete: 'CASCADE' })
  attribute: Attribute;
}
