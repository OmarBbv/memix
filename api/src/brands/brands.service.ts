import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ensureFullUrl } from '../common/utils/file-url.util';
import { generateSlug } from '../common/utils/slug.util';

@Injectable()
export class BrandsService {
  private readonly logger = new Logger(BrandsService.name);

  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) { }

  async seedBrands() {
    const brandNames = [
      'ZARA', 'H&M', 'MANGO', 'UNIQLO', 'VANS', 'SUPERDRY', 'PULL&BEAR', 'BERSHKA', 'C&A', 'PRIMARK', 'STRADIVARIUS', 'NEW YORKER',
      'REPLAY', 'DIESEL', 'G-STAR RAW', 'MASSIMO DUTTI', 'TOMMY HILFIGER', 'TOM TAYLOR', 'CROPP', 'MARCO POLO', 'PEPE JEANS',
      'ONLY&SONS', "S'OLIVER", 'JACK&JONES', 'ESPRIT', 'ONLY', 'VERA MODA', 'BENETTON', 'SPRINGFIELD', 'SELIO', 'KIABI', 'RESERVED',
      'KIK', 'SELECTED HOME', 'MONCLER', 'BOSS', 'BOGNER', 'PAUL&SHARK', 'GUCCI', 'PRADA', 'LOUIS VUITTON', 'BURBERRY', 'BALENCIAGA',
      'HUGO BOSS', 'JOOP', 'HACKETT LONDON', 'TED BAKER', 'ARMANI', 'COS', 'STONE ISLAND',
      'NIKE', 'ADIDAS', 'PUMA', 'NEW BALANCE', 'THE NORTH FACE', 'COLUMBIA', 'ADSIZ MALLAR'
    ];

    this.logger.log('🌱 Starting brand seeding...');

    for (const name of brandNames) {
      const slug = generateSlug(name);
      const existing = await this.brandRepository.findOne({
        where: [{ name }, { slug }]
      });

      if (!existing) {
        await this.brandRepository.save(
          this.brandRepository.create({
            name,
            slug,
            isActive: true,
            showOnHome: true,
            order: 0
          })
        );
        this.logger.log(`✅ Brand added: ${name}`);
      }
    }

    this.logger.log('🏁 Brand seeding completed.');
  }

  create(createBrandDto: CreateBrandDto) {
    const brand = this.brandRepository.create(createBrandDto);
    return this.brandRepository.save(brand);
  }

  async findAll(query: any = {}) {
    const qb = this.brandRepository.createQueryBuilder('brand');

    if (query.showOnHome) {
      qb.andWhere('brand.showOnHome = :show', {
        show: query.showOnHome === 'true',
      });
    }

    qb.andWhere('brand.isActive = :isActive', { isActive: true });
    qb.orderBy('brand.order', 'ASC');

    const brands = await qb.getMany();
    return brands.map((brand) => ({
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
