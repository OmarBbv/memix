import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSizeTypeDto } from './dto/create-size-type.dto';
import { UpdateSizeTypeDto } from './dto/update-size-type.dto';
import { SizeType } from './entities/size-type.entity';

@Injectable()
export class SizeTypesService implements OnModuleInit {
  constructor(
    @InjectRepository(SizeType)
    private readonly sizeTypeRepository: Repository<SizeType>,
  ) {}

  async onModuleInit() {
    console.log('Seeding default size types...');
    const defaultSizes: CreateSizeTypeDto[] = [
      { name: 'Bədən ölçüsü (XS, S, M, L, XL, XXL)' },
      { name: 'Nömrə ilə ölçü (28, 30, 32, 34...)' },
      { name: 'Ayaqqabı nömrəsi (35-45)' },
      { name: 'Üzuk ölçüsü (14-22)' },
      { name: 'Tək ölçü — Standart (çanta, kəmər, parfüm)' },
      { name: 'Yaş qrupu — Uşaq geyimləri' },
    ];

    for (const size of defaultSizes) {
      await this.create(size);
    }
    console.log('Default size types seeded.');
  }

  async create(createSizeTypeDto: CreateSizeTypeDto) {
    const slug = createSizeTypeDto.name
      .toLowerCase()
      .replace(/ə/g, 'e')
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/ı/g, 'i')
      .replace(/ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    const existing = await this.sizeTypeRepository.findOne({ where: { slug } });
    if (existing) {
      return existing;
    }

    const sizeType = this.sizeTypeRepository.create({
      name: createSizeTypeDto.name,
      slug,
    });

    return await this.sizeTypeRepository.save(sizeType);
  }

  findAll() {
    return this.sizeTypeRepository.find();
  }

  async findOne(id: number) {
    const sizeType = await this.sizeTypeRepository.findOne({ where: { id } });
    if (!sizeType) throw new NotFoundException('Size type not found');
    return sizeType;
  }

  async update(id: number, updateSizeTypeDto: UpdateSizeTypeDto) {
    const sizeType = await this.findOne(id);
    if (updateSizeTypeDto.name) {
      sizeType.name = updateSizeTypeDto.name;
      sizeType.slug = updateSizeTypeDto.name
        .toLowerCase()
        .replace(/ə/g, 'e')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o')
        .replace(/ı/g, 'i')
        .replace(/ş/g, 's')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    return this.sizeTypeRepository.save(sizeType);
  }

  async remove(id: number) {
    const sizeType = await this.findOne(id);
    return this.sizeTypeRepository.remove(sizeType);
  }
}
