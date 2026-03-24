import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Discount } from './entities/discount.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountsRepository: Repository<Discount>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createDiscountDto: CreateDiscountDto) {
    const { productId, ...discountData } = createDiscountDto;

    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['discount'],
    });

    if (!product) {
      throw new NotFoundException(`Məhsul tapılmadı (ID: ${productId})`);
    }

    if (product.discount) {
      throw new BadRequestException(
        'Bu məhsul üçün artıq endirim təyin edilib. Zəhmət olmasa mövcud endirimi yeniləyin.',
      );
    }

    const discount = this.discountsRepository.create({
      ...discountData,
      product,
    });

    return await this.discountsRepository.save(discount);
  }

  async findAll() {
    return await this.discountsRepository.find({
      relations: ['product'],
    });
  }

  async findOne(id: number) {
    const discount = await this.discountsRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!discount) {
      throw new NotFoundException(`Endirim tapılmadı (ID: ${id})`);
    }

    return discount;
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    const discount = await this.findOne(id);
    this.discountsRepository.merge(discount, updateDiscountDto);
    return await this.discountsRepository.save(discount);
  }

  async remove(id: number) {
    const discount = await this.findOne(id);
    return await this.discountsRepository.remove(discount);
  }
}
