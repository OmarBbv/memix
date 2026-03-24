import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Banner, BannerLocation } from './entities/banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private bannersRepository: Repository<Banner>,
  ) {}

  create(createBannerDto: CreateBannerDto) {
    const banner = this.bannersRepository.create(createBannerDto);
    return this.bannersRepository.save(banner);
  }

  findAll(location?: BannerLocation) {
    const query = this.bannersRepository
      .createQueryBuilder('banner')
      .where('banner.isActive = :isActive', { isActive: true })
      .orderBy('banner.order', 'ASC');

    if (location) {
      query.andWhere('banner.location = :location', { location });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const banner = await this.bannersRepository.findOneBy({ id });
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return banner;
  }

  async update(id: number, updateBannerDto: UpdateBannerDto) {
    const banner = await this.findOne(id);
    this.bannersRepository.merge(banner, updateBannerDto);
    return this.bannersRepository.save(banner);
  }

  async remove(id: number) {
    const banner = await this.findOne(id);
    return this.bannersRepository.remove(banner);
  }
}
