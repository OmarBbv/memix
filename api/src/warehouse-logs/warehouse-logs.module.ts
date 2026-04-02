import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseLogsService } from './warehouse-logs.service';
import { WarehouseLogsController } from './warehouse-logs.controller';
import { WarehouseLog } from './entities/warehouse-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseLog])],
  controllers: [WarehouseLogsController],
  providers: [WarehouseLogsService],
  exports: [WarehouseLogsService],
})
export class WarehouseLogsModule {}
