export interface WarehouseLog {
  id: number;
  recordDate: string;
  productCount: number;
  totalAmount: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWarehouseLogDto {
  recordDate: string;
  productCount: number;
  totalAmount: number;
  note?: string;
}
