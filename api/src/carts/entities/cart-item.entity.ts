import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, { eager: true }) // Məhsulu avtomatik gətirmək üçün
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  // Seçilmiş variantlar (məsələn: { color: 'Red', size: 'XL' })
  @Column({ type: 'jsonb', nullable: true })
  variants: Record<string, any>;
}
