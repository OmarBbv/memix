import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { ApiKeyGuard } from './guards/api-key.guard';

@Controller('integrations')
@UseGuards(ApiKeyGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post('sync/products')
  @HttpCode(HttpStatus.OK)
  async syncProducts(@Body() syncData: any) {
    // 1C-dən gələn tək və ya çox məhsulu sinxronizasiya et
    return this.integrationsService.syncProducts(syncData);
  }

  @Post('sync/stocks')
  @HttpCode(HttpStatus.OK)
  async syncStocks(@Body() stockData: any) {
    // Yalnız stokları yeniləmək üçün (məsələn, satış olanda)
    return this.integrationsService.syncStocks(stockData);
  }
}
