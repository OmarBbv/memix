import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWarehouseLogDto } from './dto/create-warehouse-log.dto';
import { UpdateWarehouseLogDto } from './dto/update-warehouse-log.dto';
import { WarehouseLog } from './entities/warehouse-log.entity';

@Injectable()
export class WarehouseLogsService {
  constructor(
    @InjectRepository(WarehouseLog)
    private readonly repository: Repository<WarehouseLog>,
  ) {}

  async create(dto: CreateWarehouseLogDto) {
    const record = this.repository.create(dto);
    return await this.repository.save(record);
  }

  async findAll() {
    return await this.repository.find({
      order: { recordDate: 'DESC' },
    });
  }

  async findOne(id: number) {
    const record = await this.repository.findOneBy({ id });
    if (!record) throw new NotFoundException(`Record with ID ${id} not found`);
    return record;
  }

  async update(id: number, dto: UpdateWarehouseLogDto) {
    const record = await this.findOne(id);
    this.repository.merge(record, dto);
    return await this.repository.save(record);
  }

  async remove(id: number) {
    const record = await this.findOne(id);
    return await this.repository.remove(record);
  }
}
