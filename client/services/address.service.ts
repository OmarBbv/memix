import { httpClientPrivate } from "@/lib/httpClient";
import { CreateAddressDto, UpdateAddressDto, Address } from "@/types/address.types";
import { AddressServiceTypes } from "@/types/address.service.types";

class AddressService implements AddressServiceTypes {
  async getAll(): Promise<Address[]> {
    try {
      const response = await httpClientPrivate.get('/users/addresses');
      return response.data;
    } catch (error) {
      console.error("AddressService getAll error:", error);
      throw error;
    }
  }

  async getOne(id: number): Promise<Address> {
    try {
      const response = await httpClientPrivate.get(`/users/addresses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`AddressService getOne(${id}) error:`, error);
      throw error;
    }
  }

  async create(data: CreateAddressDto): Promise<Address> {
    try {
      const response = await httpClientPrivate.post('/users/addresses', data);
      return response.data;
    } catch (error) {
      console.error("AddressService create error:", error);
      throw error;
    }
  }

  async update(id: number, data: UpdateAddressDto): Promise<Address> {
    try {
      const response = await httpClientPrivate.patch(`/users/addresses/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`AddressService update(${id}) error:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await httpClientPrivate.delete(`/users/addresses/${id}`);
    } catch (error) {
      console.error(`AddressService delete(${id}) error:`, error);
      throw error;
    }
  }
}

export const addressService = new AddressService();
