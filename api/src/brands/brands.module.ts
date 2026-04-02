import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { Brand } from './entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService],
})

export class BrandsModule implements OnModuleInit {
  constructor(private readonly brandsService: BrandsService) { }

  async onModuleInit() {
    await this.brandsService.seedBrands();
  }
}
