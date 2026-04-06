export interface WarehouseLog {
  id: number;
  recordDate: string;
  productCount: number;
  totalAmount: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  };
  // Hesablanmış sahələr
  productExpense?: number;
  productCountExpense?: number;
  balanceAmount?: number;
  balanceCount?: number;
}

export interface CreateWarehouseLogDto {
  recordDate: string;
  productCount: number;
  totalAmount: number;
  categoryId?: number;
  note?: string;
}

export interface WarehouseStats {
  date: string;
  logTotalAmount: number;
  logTotalCount: number;
  productTotalValue: number;
  productTotalCount: number;
  balance: number;
}
