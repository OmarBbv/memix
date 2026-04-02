import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeTypesService } from './size-types.service';
import { SizeTypesController } from './size-types.controller';
import { SizeType } from './entities/size-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SizeType])],
  controllers: [SizeTypesController],
  providers: [SizeTypesService],
})
export class SizeTypesModule {}
