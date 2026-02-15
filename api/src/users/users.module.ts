import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';

import { AddressesService } from './addresses.service';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  controllers: [UsersController],
  providers: [UsersService, AddressesService, SeedService],
  exports: [UsersService, AddressesService],
})
export class UsersModule { }
