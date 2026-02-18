export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
}

export interface CreateBranchDto {
  name: string;
  address: string;
  phone: string;
}

export interface UpdateBranchDto {
  name?: string;
  address?: string;
  phone?: string;
}
