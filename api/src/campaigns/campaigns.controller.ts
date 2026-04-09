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
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get('active')
  findActive() {
    return this.campaignsService.findActive();
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions('view:marketing')
  @Post()
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(createCampaignDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions('view:marketing')
  @Get()
  findAll() {
    return this.campaignsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions('view:marketing')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions('view:marketing')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(+id, updateCampaignDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions('view:marketing')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions('view:marketing')
  @Post(':id/apply-bulk-discount')
  applyBulkDiscount(
    @Param('id') id: string,
    @Body()
    body: {
      targetType: 'category' | 'brand';
      targetId: number;
      discountType: 'percentage' | 'fixed';
      discountValue: number;
    },
  ) {
    return this.campaignsService.applyBulkDiscount(
      +id,
      body.targetType,
      body.targetId,
      body.discountType,
      body.discountValue,
    );
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions('view:marketing')
  @Delete(':id/apply-bulk-discount')
  removeBulkDiscount(@Param('id') id: string) {
    return this.campaignsService.removeBulkDiscount(+id);
  }
}
