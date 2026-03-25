import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { ProductStock } from '../branches/entities/product-stock.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(ProductStock)
    private productStockRepository: Repository<ProductStock>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

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

  async addToCart(
    userId: number,
    productId: number,
    quantity: number,
    variants?: Record<string, any>,
  ) {
    const cart = await this.findOrCreateCart(userId);

    // Məhsulu yoxlayırıq
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Məhsul tapılmadı');
    }

    // Eyni məhsul və eyni variant varmı?
    let cartItem = cart.items.find(
      (item) =>
        item.product.id === productId &&
        JSON.stringify(item.variants) === JSON.stringify(variants),
    );

    const targetQuantity = cartItem ? cartItem.quantity + quantity : quantity;

    // Stok yoxlanışı (Trendyol modeli)
    const itemSize = variants?.size || null;
    const itemColor = variants?.color || null;
    let stockEntity: ProductStock | null = null;

    // 1. Rəng + Ölçü
    if (itemColor && itemSize) {
      stockEntity = await this.productStockRepository.findOne({
        where: { productId, size: itemSize, color: itemColor },
      });
    }

    // 2. Yalnız Ölçü
    if (!stockEntity && itemSize) {
      stockEntity = await this.productStockRepository.findOne({
        where: { productId, size: itemSize },
      });
    }

    // 3. Yalnız Rəng
    if (!stockEntity && itemColor) {
      stockEntity = await this.productStockRepository.findOne({
        where: { productId, color: itemColor },
      });
    }

    // 4. Ümumi Stok
    if (!stockEntity) {
      stockEntity = await this.productStockRepository.findOne({
        where: { productId },
      });
    }

    if (!stockEntity || stockEntity.stock < targetQuantity) {
      throw new BadRequestException(
        `${product.name} üçün kifayət qədər stok yoxdur (Mövcud: ${stockEntity?.stock || 0})`,
      );
    }

    if (cartItem) {
      cartItem.quantity = targetQuantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product: { id: productId } as Product,
        quantity: targetQuantity,
        variants,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return this.getCart(userId);
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.findOrCreateCart(userId);
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { id: cart.id } },
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
