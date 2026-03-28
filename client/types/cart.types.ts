export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  variants: Record<string, any>;
  product: {
    id: number;
    name: string;
    price: number;
    discount?: {
      value: number;
      type: string;
      isActive: boolean;
    };
    images: string[];
    banner?: string;
  };
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}
