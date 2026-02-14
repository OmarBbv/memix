import { httpClientPrivate } from "@/lib/httpClient";
import { CreateAddressDto, UpdateAddressDto, Address } from "@/types/address.types";

class AddressService {
  async getAll(): Promise<Address[]> {
    const response = await httpClientPrivate.get('/users/addresses');
    return response.data;
  }

  async getOne(id: number): Promise<Address> {
    const response = await httpClientPrivate.get(`/users/addresses/${id}`);
    return response.data;
  }

  async create(data: CreateAddressDto): Promise<Address> {
    const response = await httpClientPrivate.post('/users/addresses', data);
    return response.data;
  }

  async update(id: number, data: UpdateAddressDto): Promise<Address> {
    const response = await httpClientPrivate.patch(`/users/addresses/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await httpClientPrivate.delete(`/users/addresses/${id}`);
  }
}

export const addressService = new AddressService();
