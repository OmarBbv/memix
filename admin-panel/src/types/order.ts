import { Product } from "./product";
import { User } from "./user";

export enum OrderStatus {
  PENDING = 'PENDING',       // Sifariş verildi, təsdiq gözləyir
  PREPARING = 'PREPARING',   // Hazırlanır
  READY = 'READY',           // Hazırdır (Kuryer gözləyir)
  ON_WAY = 'ON_WAY',         // Yoldadır
  DELIVERED = 'DELIVERED',   // Çatdırıldı
  CANCELLED = 'CANCELLED',   // Ləğv edildi
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  variants?: Record<string, any>;
}

export interface Order {
  id: number;
  user: User;
  items: OrderItem[];
  status: OrderStatus;
  totalPrice: number;
  address: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}
