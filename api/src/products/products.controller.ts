import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/utils/multer.config';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @UseInterceptors(AnyFilesInterceptor(multerConfig))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.create(createProductDto, files);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  findAllAdmin(@Query() query: any) {
    return this.productsService.findAllAdmin(query);
  }

  @Get('filters')
  getFilters(@Query() query: any) {
    return this.productsService.getFilters(query);
  }

  @Get('generate-sku')
  async generateSKU(
    @Query('categoryId') categoryId: string,
    @Query('listingType') listingType: string,
  ) {
    if (!categoryId || !listingType) {
      return { sku: null, error: 'categoryId and listingType are required' };
    }
    return this.productsService.generateSKU(+categoryId, listingType);
  }

  @Get('new-arrivals')
  findNewArrivals(@Query('limit') limit?: string) {
    return this.productsService.findNewArrivals(limit ? +limit : 8);
  }

  @Get('sync-index')
  async syncIndex(@Query('secret') secret: string) {
    if (secret !== 'memix123') {
      return { error: 'Wrong secret key' };
    }
    try {
      return await this.productsService.syncSearchIndex();
    } catch (e) {
      return { error: e.message, stack: e.stack };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get(':id/similar')
  findSimilar(@Param('id') id: string, @Query('limit') limit?: string) {
    return this.productsService.findSimilar(+id, limit ? +limit : 8);
  }

  @Get(':id/label')
  async downloadLabel(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.productsService.generateLabel(+id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=label-${id}.pdf`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor(multerConfig))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.update(+id, updateProductDto, files);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
