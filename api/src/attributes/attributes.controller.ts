import { Controller, Get, Param } from '@nestjs/common';
import { AttributesService } from './attributes.service';

@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.attributesService.findByCategoryId(+categoryId);
  }
}
