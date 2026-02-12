import { Controller, Get, Post, Body, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('wishlist')
@UseGuards(AuthGuard('jwt'))
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Get()
  findAll(@Request() req: any) {
    return this.wishlistService.findByUser(req.user.id);
  }

  @Post()
  add(@Request() req: any, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistService.add(req.user.id, createWishlistDto.productId);
  }

  @Delete(':productId')
  remove(@Request() req: any, @Param('productId') productId: string) {
    return this.wishlistService.remove(req.user.id, +productId);
  }

  @Post(':productId/move-to-cart')
  moveToCart(@Request() req: any, @Param('productId') productId: string) {
    return this.wishlistService.moveToCart(req.user.id, +productId);
  }

  @Delete()
  clear(@Request() req: any) {
    return this.wishlistService.clear(req.user.id);
  }
}
