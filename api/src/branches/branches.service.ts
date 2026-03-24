import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { ProductStock } from './entities/product-stock.entity';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(ProductStock)
    private productStockRepository: Repository<ProductStock>,
  ) {}

  create(createBranchDto: any) {
    const branch = this.branchRepository.create(createBranchDto);
    return this.branchRepository.save(branch);
  }

  findAll() {
    return this.branchRepository.find({ relations: ['stocks'] });
  }

  findOne(id: number) {
    return this.branchRepository.findOne({
      where: { id },
      relations: ['stocks'],
    });
  }

  update(id: number, updateBranchDto: any) {
    return this.branchRepository.update(id, updateBranchDto);
  }

  remove(id: number) {
    return this.branchRepository.delete(id);
  }

  async updateStock(
    branchId: number,
    productId: number,
    quantity: number,
    size?: string,
    color?: string,
  ) {
    const whereClause: any = { branchId, productId };
    if (size) whereClause.size = size;
    if (color) whereClause.color = color;

    let stock = await this.productStockRepository.findOne({
      where: whereClause,
    });

    if (stock) {
      stock.stock = quantity;
    } else {
      stock = this.productStockRepository.create({
        branchId,
        productId,
        stock: quantity,
        size: size || undefined,
        color: color || undefined,
      });
    }

    return this.productStockRepository.save(stock);
  }
}
