export interface Address {
  id: number;
  title: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country?: string;
  zipCode?: string;
  isDefault: boolean;
  userId: number;
}

export interface CreateAddressDto {
  title: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country?: string;
  zipCode?: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> { }
