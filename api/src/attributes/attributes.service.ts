import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from './entities/attribute.entity';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
  ) {}

  async findByCategoryId(categoryId: number): Promise<Attribute[]> {
    return this.attributeRepository.find({
      where: {
        categories: { id: categoryId }
      },
      relations: ['options']
    });
  }
}
