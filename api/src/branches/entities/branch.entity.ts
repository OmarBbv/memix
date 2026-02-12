import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductStock } from './product-stock.entity';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Məsələn: "Gənclik Filialı"

  @Column({ nullable: true })
  address: string; // Filialın ünvanı

  @Column({ nullable: true })
  phone: string; // Əlaqə nömrəsi

  @OneToMany(() => ProductStock, (stock) => stock.branch)
  stocks: ProductStock[]; // Bu filialdakı məhsul stokları
}
