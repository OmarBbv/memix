import { Address, CreateAddressDto, UpdateAddressDto } from "./address.types";

export interface AddressServiceTypes {
  getAll(): Promise<Address[]>;
  getOne(id: number): Promise<Address>;
  create(data: CreateAddressDto): Promise<Address>;
  update(id: number, data: UpdateAddressDto): Promise<Address>;
  delete(id: number): Promise<void>;
}
