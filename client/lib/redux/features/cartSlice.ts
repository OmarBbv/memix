import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string; // or number, aligning with product id type
  title: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  seller?: {
    name: string;
  };
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.isOpen = true; // Open cart when adding item
    },
    removeFromCart: (state, action: PayloadAction<{ id: string; size: string }>) => {
      state.items = state.items.filter(
        (item) => !(item.id === action.payload.id && item.size === action.payload.size)
      );
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; size: string; quantity: number }>) => {
      const item = state.items.find(
        (i) => i.id === action.payload.id && i.size === action.payload.size
      );
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, toggleCart, openCart, closeCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
