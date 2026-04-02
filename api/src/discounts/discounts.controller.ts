import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { AutoDiscountService } from './auto-discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('discounts')
export class DiscountsController {
  constructor(
    private readonly discountsService: DiscountsService,
    private readonly autoDiscountService: AutoDiscountService,
  ) {}

  @Post()
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountsService.create(createDiscountDto);
  }

  @Get()
  findAll() {
    return this.discountsService.findAll();
  }

  /**
   * Admin paneldə təsdiq gözləyən endirimləri listələyir.
   * Yalnız "new" listingType — 60/90 gün keçmiş məhsullar.
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('pending')
  getPendingDiscounts() {
    return this.autoDiscountService.getPendingDiscounts();
  }

  /**
   * Cron job-u manual trigger etmək üçün (test / dev mode).
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('trigger-auto')
  triggerAutoDiscounts() {
    return this.autoDiscountService.handleAutoDiscounts();
  }

  /**
   * Admin tərəfindən toplu təsdiq.
   * Body: { productIds: number[] }
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('approve-bulk')
  approveBulkDiscounts(@Body() body: { productIds: number[] }) {
    return this.autoDiscountService.approveBulkDiscounts(body.productIds);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountsService.update(+id, updateDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountsService.remove(+id);
  }
}
