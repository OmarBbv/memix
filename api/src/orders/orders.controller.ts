import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Res,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { OrderStatus } from './entities/order.entity';

import type { Response } from 'express';
import { InvoicesService } from './invoices.service';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly invoicesService: InvoicesService,
  ) { }

  @Post()
  create(
    @Request() req: any,
    @Body('address') address: string,
    @Body('phone') phone: string,
  ) {
    return this.ordersService.create(req.user.id, address, phone);
  }

  @Get('my')
  getMyOrders(@Request() req: any) {
    return this.ordersService.findByUserId(req.user.id);
  }

  @UseGuards(PermissionsGuard)
  @RequirePermissions('view:orders')
  @Get(':id/invoice')
  async downloadInvoice(@Param('id') id: string, @Res() res: Response) {
    const order = await this.ordersService.findOne(+id);
    const buffer = await this.invoicesService.generateOrderInvoice(order);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${order.id}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @UseGuards(PermissionsGuard)
  @RequirePermissions('view:orders')
  @Get()
  findAll(@Query('search') search?: string, @Query('status') status?: OrderStatus) {
    return this.ordersService.findAll(search, status);
  }

  @UseGuards(PermissionsGuard)
  @RequirePermissions('edit:orders')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(+id, status);
  }
}
