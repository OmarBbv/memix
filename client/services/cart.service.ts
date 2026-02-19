import { httpClientPrivate } from "@/lib/httpClient";
import { Cart } from "@/types/cart.types";

interface ICartService {
  getCart(): Promise<Cart>;
  addToCart(productId: number, quantity: number, variants?: any): Promise<any>;
  removeFromCart(itemId: number): Promise<void>;
  clearCart(): Promise<void>;
}

class CartService implements ICartService {
  async getCart(): Promise<Cart> {
    const response = await httpClientPrivate.get('/carts');
    return response.data;
  }

  async addToCart(productId: number, quantity: number, variants?: any): Promise<any> {
    const response = await httpClientPrivate.post('/carts/items', {
      productId,
      quantity,
      variants
    });
    return response.data;
  }

  async removeFromCart(itemId: number): Promise<void> {
    await httpClientPrivate.delete(`/carts/items/${itemId}`);
  }

  async clearCart(): Promise<void> {
    await httpClientPrivate.delete('/carts');
  }
}

export const cartService = new CartService();
