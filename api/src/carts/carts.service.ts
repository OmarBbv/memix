import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) { }

  async findOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId }, items: [] });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async getCart(userId: number) {
    return this.findOrCreateCart(userId);
  }

  async addToCart(userId: number, productId: number, quantity: number, variants?: Record<string, any>) {
    const cart = await this.findOrCreateCart(userId);

    // Eyni məhsul və eyni variant varmı?
    let cartItem = cart.items.find(item =>
      item.product.id === productId &&
      JSON.stringify(item.variants) === JSON.stringify(variants)
    );

    if (cartItem) {
      cartItem.quantity += quantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product: { id: productId } as Product,
        quantity,
        variants,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return this.getCart(userId);
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.findOrCreateCart(userId);
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { id: cart.id } }
    });

    if (!item) {
      throw new NotFoundException('Səbətdə belə bir məhsul tapılmadı');
    }

    await this.cartItemRepository.remove(item);
    return this.getCart(userId);
  }

  async clearCart(userId: number) {
    const cart = await this.findOrCreateCart(userId);
    await this.cartItemRepository.delete({ cart: { id: cart.id } });
    return this.getCart(userId);
  }
}
