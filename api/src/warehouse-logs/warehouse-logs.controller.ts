import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { WarehouseLogsService } from './warehouse-logs.service';
import { CreateWarehouseLogDto } from './dto/create-warehouse-log.dto';
import { UpdateWarehouseLogDto } from './dto/update-warehouse-log.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Warehouse Logs')
@Controller('warehouse-logs')
export class WarehouseLogsController {
  constructor(private readonly warehouseLogsService: WarehouseLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new warehouse record' })
  create(@Body() createWarehouseLogDto: CreateWarehouseLogDto) {
    return this.warehouseLogsService.create(createWarehouseLogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouse records' })
  findAll() {
    return this.warehouseLogsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific warehouse record' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseLogsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a warehouse record' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarehouseLogDto: UpdateWarehouseLogDto,
  ) {
    return this.warehouseLogsService.update(id, updateWarehouseLogDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a warehouse record' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseLogsService.remove(id);
  }
}
