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
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { User, UserType } from './entities/user.entity';
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
    return this.usersService.findOneWithRole(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('addresses')
  createAddress(
    @Request() req: AuthenticatedRequest,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    return this.addressesService.create(req.user.id, createAddressDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('addresses')
  findAllAddresses(@Request() req: AuthenticatedRequest): Promise<Address[]> {
    return this.addressesService.findAll(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('addresses/:id')
  findOneAddress(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<Address> {
    return this.addressesService.findOne(+id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('addresses/:id')
  updateAddress(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.addressesService.update(+id, req.user.id, updateAddressDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('addresses/:id')
  removeAddress(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    return this.addressesService.remove(+id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions('view:users')
  @Get()
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    console.log('UsersController.findAll - req.user:', req.user);
    return this.usersService.findAll(
      req.user?.id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
    );
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions('edit:users')
  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id') id: string): Promise<User> {
    return this.usersService.toggleStatus(+id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions('edit:users')
  @Patch(':id/admin-update')
  async adminUpdate(
    @Param('id') id: string,
    @Body() body: { name?: string; surname?: string; email?: string; roleId?: number },
  ): Promise<User> {
    return this.usersService.adminUpdate(+id, body);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions('view:users')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions('delete:users')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions('create:users')
  @Post('employee')
  async createEmployee(@Body() data: CreateUserDto & { roleId: number }): Promise<User> {
    const { roleId, ...userDetail } = data;
    const user = await this.usersService.create({
      ...userDetail,
      userType: UserType.EMPLOYEE,
    });
    
    if (roleId) {
      // In a real scenario, you might want to join the role in the service or use a different method
      // For now, let's assume we can update the user with the role
      return this.usersService.assignRole(user.id, roleId);
    }
    return user;
  }
}
