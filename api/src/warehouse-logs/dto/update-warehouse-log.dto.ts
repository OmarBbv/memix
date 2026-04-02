import { PartialType } from '@nestjs/mapped-types';
import { CreateWarehouseLogDto } from './create-warehouse-log.dto';

export class UpdateWarehouseLogDto extends PartialType(CreateWarehouseLogDto) { }
