import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Product } from '../products/entities/product.entity';
import { CartsService } from '../carts/carts.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cartsService: CartsService,
  ) { }

  async add(userId: number, productId: number) {
    // Məhsulun mövcudluğunu yoxlayırıq
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Məhsul tapılmadı');
    }

    if (!userId) {
      throw new BadRequestException('İstifadəçi ID tapılmadı');
    }

    // Artıq əlavə edilmişmi?
    const existing = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (existing) {
      throw new BadRequestException('Bu məhsul artıq istək siyahısındadır');
    }

    const wishlistItem = this.wishlistRepository.create({
      user: { id: userId } as any,
      product: { id: productId } as any,
    });

    return this.wishlistRepository.save(wishlistItem);
  }

  async findByUser(userId: number) {
    return this.wishlistRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(userId: number, productId: number) {
    const item = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!item) {
      throw new NotFoundException('Bu məhsul istək siyahısında tapılmadı');
    }

    return this.wishlistRepository.remove(item);
  }

  async moveToCart(userId: number, productId: number) {
    // İstək siyahısından tapırıq
    const wishlistItem = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Bu məhsul istək siyahısında tapılmadı');
    }

    // Səbətə əlavə edirik
    await this.cartsService.addToCart(userId, productId, 1);

    // İstək siyahısından silirik
    await this.wishlistRepository.remove(wishlistItem);

    return { message: 'Məhsul səbətə əlavə edildi' };
  }

  async clear(userId: number) {
    await this.wishlistRepository.delete({ user: { id: userId } });
    return { message: 'İstək siyahısı təmizləndi' };
  }
}
