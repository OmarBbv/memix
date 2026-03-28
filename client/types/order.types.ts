export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  ON_WAY = 'ON_WAY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    banner?: string;
    images?: string[];
  };
  quantity: number;
  price: number;
  variants?: {
    size?: string;
    color?: string;
  };
}

export interface Order {
  id: number;
  status: OrderStatus;
  totalPrice: number;
  address: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
