import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) { }

  async create(userId: number, createAddressDto: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create({
      ...createAddressDto,
      userId,
    });
    return this.addressRepository.save(address);
  }

  async findAll(userId: number): Promise<Address[]> {
    return this.addressRepository.find({ where: { userId } });
  }

  async findOne(id: number, userId: number): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id, userId } });
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  async update(id: number, userId: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.findOne(id, userId); // Ensure ownership

    // If setting as default, unset others first if needed
    if (updateAddressDto.isDefault) {
      await this.addressRepository.update({ userId }, { isDefault: false });
    }

    const updated = await this.addressRepository.save({
      ...address,
      ...updateAddressDto,
    });
    return updated;
  }

  async remove(id: number, userId: number): Promise<void> {
    const result = await this.addressRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
  }
}
