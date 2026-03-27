import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('carts')
@UseGuards(AuthGuard('jwt'))
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  getCart(@Request() req: any) {
    return this.cartsService.getCart(req.user.id);
  }

  @Post('items')
  addToCart(
    @Request() req: any,
    @Body('productId') productId: number,
    @Body('quantity') quantity: number,
    @Body('variants') variants?: Record<string, any>,
  ) {
    return this.cartsService.addToCart(
      req.user.id,
      productId,
      quantity,
      variants,
    );
  }

  @Delete('items/:itemId')
  removeItem(@Request() req: any, @Param('itemId') itemId: string) {
    return this.cartsService.removeItem(req.user.id, +itemId);
  }

  @Delete()
  clearCart(@Request() req: any) {
    return this.cartsService.clearCart(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/clear/:userId')
  adminClearCart(@Param('userId') userId: string) {
    return this.cartsService.clearCart(+userId);
  }
}
