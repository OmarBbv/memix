import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWarehouseLogDto } from './dto/create-warehouse-log.dto';
import { UpdateWarehouseLogDto } from './dto/update-warehouse-log.dto';
import { WarehouseLog } from './entities/warehouse-log.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { ValuationService } from '../products/valuation.service';

@Injectable()
export class WarehouseLogsService {
  constructor(
    @InjectRepository(WarehouseLog)
    private readonly repository: Repository<WarehouseLog>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly valuationService: ValuationService,
  ) { }

  async getValuationByCategory(categoryId: number) {
    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) throw new NotFoundException('Category not found');

    const valuation = this.valuationService.getValuation('ADSIZ MALLAR', category.name);
    return valuation || 0;
  }

  async getDailyStats(startDate?: string, endDate?: string) {
    const qb = this.repository.createQueryBuilder('log')
      .select('log.recordDate', 'date')
      .addSelect('SUM(log.totalAmount)', 'logTotalAmount')
      .addSelect('SUM(log.productCount)', 'logTotalCount');

    if (startDate && endDate) {
      qb.where('log.recordDate BETWEEN :start AND :end', { start: startDate, end: endDate });
    }

    qb.groupBy('log.recordDate')
      .orderBy('log.recordDate', 'DESC');

    const logs = await qb.getRawMany();

    // Həmin tarixlərdə yaradılan məhsulların ümumi dəyəri və sayı
    const productQb = this.productRepository.createQueryBuilder('p')
       .leftJoin('p.stocks', 's')
       .select('DATE(p.createdAt)', 'date')
       .addSelect('SUM(CAST(s.stock AS DECIMAL) * p.price)', 'value')
       .addSelect('SUM(CAST(s.stock AS INTEGER))', 'count')
       .where('p.isDeleted = false')
       .groupBy('DATE(p.createdAt)');

    if (startDate && endDate) {
        productQb.andWhere('p.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate });
    }

    const productStats = await productQb.getRawMany();
    const productStatsMap = new Map();
    productStats.forEach(ps => {
      const d = new Date(ps.date).toISOString().split('T')[0];
      productStatsMap.set(d, {
        value: parseFloat(ps.value) || 0,
        count: parseInt(ps.count) || 0
      });
    });

    return logs.map(log => {
      const dateStr = new Date(log.date).toISOString().split('T')[0];
      const prodStats = productStatsMap.get(dateStr) || { value: 0, count: 0 };
      const logTotal = parseFloat(log.logTotalAmount) || 0;
      return {
        date: dateStr,
        logTotalAmount: logTotal,
        logTotalCount: parseInt(log.logTotalCount) || 0,
        productTotalValue: prodStats.value,
        productTotalCount: prodStats.count,
        balance: logTotal - prodStats.value
      };
    });
  }

  async create(dto: CreateWarehouseLogDto) {
    const record = this.repository.create(dto);
    return await this.repository.save(record);
  }

  async findAll() {
    const logs = await this.repository.find({
      relations: ['category'],
      order: { recordDate: 'DESC' },
    });

    // Bütün tarixlərdə yaradılan məhsulların ümumi dəyəri və sayını hesablayırıq
    const productStats = await this.productRepository.createQueryBuilder('p')
       .leftJoin('p.stocks', 's')
       .select('DATE(p.createdAt)', 'date')
       .addSelect('SUM(CAST(s.stock AS DECIMAL) * p.price)', 'totalValue')
       .addSelect('SUM(CAST(s.stock AS INTEGER))', 'totalCount')
       .where('p.isDeleted = false')
       .groupBy('DATE(p.createdAt)')
       .getRawMany();

    const productStatsMap = new Map();
    productStats.forEach(ps => {
      const dateStr = new Date(ps.date).toISOString().split('T')[0];
      productStatsMap.set(dateStr, {
        value: parseFloat(ps.totalValue) || 0,
        count: parseInt(ps.totalCount) || 0
      });
    });

    return logs.map(log => {
      const dateStr = new Date(log.recordDate).toISOString().split('T')[0];
      const stats = productStatsMap.get(dateStr) || { value: 0, count: 0 };
      
      const logAmount = parseFloat(log.totalAmount.toString());
      const logCount = parseInt(log.productCount.toString());

      return {
        ...log,
        productExpense: stats.value,
        productCountExpense: stats.count,
        balanceAmount: logAmount - stats.value,
        balanceCount: logCount - stats.count
      };
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
