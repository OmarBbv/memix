import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiKeyGuard } from './guards/api-key.guard';
import { IntegrationsService } from './integrations.service';
import { ProductSyncItem } from './integrations.service';
import { DeleteProductDto } from './dto/delete-product.dto';

@Controller('integrations')
@UseGuards(ApiKeyGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) { }

  @Post('sync/products')
  @HttpCode(HttpStatus.OK)
  async syncProducts(@Body() syncData: ProductSyncItem | ProductSyncItem[]) {
    // 1C-dən gələn tək və ya çox məhsulu sinxronizasiya et
    return this.integrationsService.syncProducts(syncData);
  }

  @Post('sync/stocks')
  @HttpCode(HttpStatus.OK)
  async syncStocks(@Body() stockData: ProductSyncItem | ProductSyncItem[]) {
    // Yalnız stokları yeniləmək üçün (məsələn, satış olanda)
    return this.integrationsService.syncStocks(stockData);
  }

  @Post('sync/categories')
  @HttpCode(HttpStatus.OK)
  async syncCategories(@Body() categoryData: any) {
    // 1C-dən gələn kateqoriyaları sinxronizasiya et
    return this.integrationsService.syncCategories(categoryData);
  }

  @Post('sync/branches')
  @HttpCode(HttpStatus.OK)
  async syncBranches(@Body() branchData: any) {
    return this.integrationsService.syncBranches(branchData);
  }

  @Get('sync/branches')
  async getBranches() {
    return this.integrationsService.getBranches();
  }

  @Get('sync/products')
  async getProducts() {
    return this.integrationsService.getProducts();
  }

  @Get('sync/categories')
  async getCategories() {
    return this.integrationsService.getCategories();
  }

  @Get('sync/size-types')
  async getSizeTypes() {
    return this.integrationsService.getSizeTypes();
  }

  @Post('sync/delete')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Body() deleteDto: DeleteProductDto) {
    console.log('Incoming delete request body:', deleteDto);
    const identifier = deleteDto.guid1c || deleteDto.sku;
    if (!identifier) {
      return { status: 'error', message: 'SKU və ya GUID vacibdir' };
    }
    return this.integrationsService.deleteProduct(identifier);
  }
}
