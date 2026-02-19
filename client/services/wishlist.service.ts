
import { httpClientPrivate } from "@/lib/httpClient";
import { Product } from "./product.service";

export type WishlistItem = {
  id: number;
  product: Product;
  createdAt: string;
};

export const wishlistService = {
  getAll: async () => {
    const response = await httpClientPrivate.get<WishlistItem[]>('/wishlist');
    return response.data;
  },

  add: async (productId: number) => {
    const response = await httpClientPrivate.post('/wishlist', { productId });
    return response.data;
  },

  remove: async (productId: number) => {
    const response = await httpClientPrivate.delete(`/wishlist/${productId}`);
    return response.data;
  },

  clear: async () => {
    const response = await httpClientPrivate.delete('/wishlist');
    return response.data;
  }
};
