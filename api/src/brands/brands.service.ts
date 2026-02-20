import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ensureFullUrl } from '../common/utils/file-url.util';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) { }

  create(createBrandDto: CreateBrandDto) {
    const brand = this.brandRepository.create(createBrandDto);
    return this.brandRepository.save(brand);
  }

  async findAll(query: any = {}) {
    const qb = this.brandRepository.createQueryBuilder('brand');

    if (query.showOnHome) {
      qb.andWhere('brand.showOnHome = :show', { show: query.showOnHome === 'true' });
    }

    qb.andWhere('brand.isActive = :isActive', { isActive: true });
    qb.orderBy('brand.order', 'ASC');

    const brands = await qb.getMany();
    return brands.map(brand => ({
      ...brand,
      logoUrl: brand.logoUrl ? ensureFullUrl(brand.logoUrl) : null,
    }));
  }

  async findOne(id: number) {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return {
      ...brand,
      logoUrl: brand.logoUrl ? ensureFullUrl(brand.logoUrl) : null,
    };
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException(`Brand with ID ${id} not found`);
    this.brandRepository.merge(brand, updateBrandDto);
    return this.brandRepository.save(brand);
  }

  async remove(id: number) {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException(`Brand with ID ${id} not found`);
    return this.brandRepository.remove(brand);
  }
}
