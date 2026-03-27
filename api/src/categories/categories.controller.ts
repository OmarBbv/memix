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
  UploadedFile,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/utils/multer.config';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('sync-index')
  async syncIndex() {
    return this.categoriesService.syncSearchIndex();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.categoriesService.create(createCategoryDto, image);
  }

  @Get()
  findAll(@Query('all') all?: string) {
    return this.categoriesService.findAll(all === 'true');
  }

  @Get('home')
  findHomeCategories() {
    return this.categoriesService.findHomeCategories();
  }

  @Get('tree')
  findTree(@Query('all') all?: string, @Query('search') search?: string) {
    return this.categoriesService.findTree(all === 'true', search);
  }

  @Get('slug/:slug')
  findBySlug(
    @Param('slug') slug: string,
    @Query() query: Record<string, string>,
  ) {
    const { all, ...filters } = query;
    return this.categoriesService.findBySlug(slug, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto, image);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }

  @Get(':id/filters')
  getFilters(@Param('id') id: string) {
    return this.categoriesService.getFilters(+id);
  }
}
