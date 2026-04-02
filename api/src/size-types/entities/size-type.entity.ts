import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('size_types')
export class SizeType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;
}
