import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from './entities/user.entity';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressesService } from './addresses.service';
import { Address } from './entities/address.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly addressesService: AddressesService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest): Promise<User> {
    return this.usersService.findOne(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('addresses')
  createAddress(
    @Request() req: AuthenticatedRequest,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    return this.addressesService.create(req.user.userId, createAddressDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('addresses')
  findAllAddresses(@Request() req: AuthenticatedRequest): Promise<Address[]> {
    return this.addressesService.findAll(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('addresses/:id')
  findOneAddress(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<Address> {
    return this.addressesService.findOne(+id, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('addresses/:id')
  updateAddress(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.addressesService.update(+id, req.user.userId, updateAddressDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('addresses/:id')
  removeAddress(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    return this.addressesService.remove(+id, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(
      req.user.userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id') id: string): Promise<User> {
    return this.usersService.toggleStatus(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(+id);
  }
}
