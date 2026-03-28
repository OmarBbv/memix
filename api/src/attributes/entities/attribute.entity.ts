import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { AttributeOption } from './attribute-option.entity';

@Entity('attributes')
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Məsələn: Materyal, Kalıp, Yaka Tipi

  @OneToMany(() => AttributeOption, (option) => option.attribute, { cascade: true })
  options: AttributeOption[];

  @ManyToMany(() => Category, (category) => category.attributes)
  @JoinTable({
    name: 'category_attributes',
    joinColumn: { name: 'attributeId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' }
  })
  categories: Category[];
}
