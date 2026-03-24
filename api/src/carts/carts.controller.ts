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
}
