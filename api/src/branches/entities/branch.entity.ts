import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductStock } from './product-stock.entity';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Məsələn: "Gənclik Filialı"

  @Column({ unique: true, nullable: true })
  guid1c: string; // 1C-den gelen GUID (Identifyer)

  @Column({ nullable: true })
  address: string; // Filialın ünvanı

  @Column({ nullable: true })
  phone: string; // Əlaqə nömrəsi

  @OneToMany(() => ProductStock, (stock) => stock.branch)
  stocks: ProductStock[]; // Bu filialdakı məhsul stokları
}
