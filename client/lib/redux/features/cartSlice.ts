import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '@/services/cart.service';
import { toast } from 'sonner';
import { baseUrl } from '@/lib/httpClient';

const getFullImageUrl = (img: string) => {
  if (!img) return '';
  if (img.startsWith('http')) return img;
  const normalizedPath = img.startsWith('/') ? img : `/${img}`;
  return `${baseUrl}${normalizedPath}`;
};

export interface CartItem {
  id: string | number;
  productId?: number;
  title: string;
  price: number;
  image: string;
  size: string;
  color?: string;
  quantity: number;
  seller?: {
    name: string;
  };
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  status: 'idle',
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState() as any;
    if (!auth.isAuthenticated) return [];

    try {
      const cart = await cartService.getCart();
      return cart.items.map((item) => ({
        id: item.id, // Line Item ID
        productId: item.productId,
        title: item.product.name,
        price: item.product.price,
        image: getFullImageUrl(item.product.banner || (item.product.images?.length > 0 ? item.product.images[0] : '')),
        size: item.variants?.size || '',
        color: item.variants?.color || '',
        quantity: item.quantity,
        seller: { name: 'Memix' }
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (item: Omit<CartItem, 'quantity'> & { id: number | string }, { getState, rejectWithValue }) => {
    const { auth } = getState() as any;

    if (!auth.isAuthenticated) {
      return { ...item, quantity: 1, isGuest: true };
    }

    try {
      await cartService.addToCart(
        Number(item.id),
        1,
        { size: item.size, color: item.color }
      );
      return { ...item, quantity: 1, isGuest: false };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async ({ id, size, color }: { id: string | number; size: string; color?: string }, { getState, rejectWithValue }) => {
    const { auth } = getState() as any;
    if (!auth.isAuthenticated) {
      return { id, size, isGuest: true };
    }

    try {
      // For auth users, we need the Line Item ID.
      // If we are fully synced, 'id' coming from UI (from state.items) IS the Line Item ID.
      // So we just pass it.
      await cartService.removeFromCart(Number(id));
      return { id, size, isGuest: false };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const incrementQuantityAsync = createAsyncThunk(
  'cart/incrementQuantityAsync',
  async (item: CartItem, { getState, rejectWithValue }) => {
    const { auth } = getState() as any;
    const productId = item.productId || item.id;

    if (!auth.isAuthenticated) {
      return { ...item, isGuest: true };
    }

    try {
      await cartService.addToCart(
        Number(productId),
        1,
        { size: item.size, color: item.color }
      );
      return { ...item, isGuest: false };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const decrementQuantityAsync = createAsyncThunk(
  'cart/decrementQuantityAsync',
  async (item: CartItem, { getState, rejectWithValue }) => {
    const { auth } = getState() as any;
    const productId = item.productId || item.id;

    if (!auth.isAuthenticated) {
      return { ...item, isGuest: true };
    }

    try {
      await cartService.addToCart(
        Number(productId),
        -1,
        { size: item.size, color: item.color }
      );
      return { ...item, isGuest: false };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState() as any;
    if (!auth.isAuthenticated) return;

    try {
      await cartService.clearCart();
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Synchronous actions (mostly for internal use or guest fallback if needed, but we try to use Thunks)

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
    updateQuantity: (state, action: PayloadAction<{ id: string | number; size: string; color?: string; quantity: number }>) => {
      const item = state.items.find(
        (i) => String(i.id) === String(action.payload.id) && 
               i.size === action.payload.size &&
               i.color === action.payload.color
      );
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    // We keep a simple addToCart but effectively we want to use addToCartAsync
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      // This legacy reducer can be kept if needed, but we are moving to async thunk
      const existingItem = state.items.find(
        (item) => String(item.id) === String(action.payload.id) && 
                 item.size === action.payload.size &&
                 item.color === action.payload.color
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.isOpen = true;
    },
    removeFromCart: (state, action: PayloadAction<{ id: string | number; size: string; color?: string }>) => {
      state.items = state.items.filter(
        (item) => !(
          String(item.id) === String(action.payload.id) && 
          item.size === action.payload.size &&
          item.color === action.payload.color
        )
      );
    }
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      if (action.payload) {
        // Replace items with server cart
        // We might want to merge if we had local items? For now separate carts.
        state.items = action.payload;
      }
    });

    // Add To Cart
    builder.addCase(addToCartAsync.pending, (state, action) => {
      // Optimistic Update
      const newItem = action.meta.arg;
      const existingItem = state.items.find(
        (item) => String(item.id) === String(newItem.id) && 
                 item.size === newItem.size &&
                 item.color === newItem.color
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        // For guest, ID is product ID. For auth, we hope it matches or we fix it on fullfill
        state.items.push({ ...newItem, quantity: 1 });
      }
      state.isOpen = true;
      state.status = 'loading';
    });

    builder.addCase(addToCartAsync.fulfilled, (state, action) => {
      state.status = 'succeeded';
      // If authenticatd, we might want to refresh the ID from server if it was a new item
      // But for now simple optimistic is fine.
    });

    builder.addCase(addToCartAsync.rejected, (state, action) => {
      state.status = 'failed';
      // Rollback
      const newItem = action.meta.arg;
      const existingItem = state.items.find(
        (item) => String(item.id) === String(newItem.id) && 
                 item.size === newItem.size &&
                 item.color === newItem.color
      );
      if (existingItem) {
        if (existingItem.quantity > 1) existingItem.quantity -= 1;
        else state.items = state.items.filter(i => i !== existingItem);
      }

      const errorMessage = (action.payload as any)?.message || 'Səbətə əlavə edilərkən xəta baş verdi';
      toast.error(errorMessage);
    });

    // Increment Quantity
    builder.addCase(incrementQuantityAsync.pending, (state, action) => {
      const { id, size, color } = action.meta.arg;
      const item = state.items.find((i) => 
        String(i.id) === String(id) && 
        i.size === size &&
        i.color === color
      );
      if (item) {
        item.quantity += 1;
      }
    });

    builder.addCase(incrementQuantityAsync.rejected, (state, action) => {
      const { id, size, color } = action.meta.arg;
      const item = state.items.find((i) => 
        String(i.id) === String(id) && 
        i.size === size &&
        i.color === color
      );
      if (item) {
        item.quantity -= 1;
      }
      const errorMessage = (action.payload as any)?.message || 'Stok yoxlanışı zamanı xəta baş verdi';
      toast.error(errorMessage);
    });

    // Decrement Quantity
    builder.addCase(decrementQuantityAsync.pending, (state, action) => {
      const { id, size, color } = action.meta.arg;
      const item = state.items.find((i) => 
        String(i.id) === String(id) && 
        i.size === size &&
        i.color === color
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    });

    builder.addCase(decrementQuantityAsync.rejected, (state, action) => {
      const { id, size, color } = action.meta.arg;
      const item = state.items.find((i) => 
        String(i.id) === String(id) && 
        i.size === size &&
        i.color === color
      );
      if (item) {
        item.quantity += 1;
      }
      const errorMessage = (action.payload as any)?.message || 'Yenilənmə zamanı xəta baş verdi';
      toast.error(errorMessage);
    });

    // Clear Cart
    builder.addCase(clearCartAsync.pending, (state) => {
      state.items = [];
    });

    builder.addCase(clearCartAsync.rejected, (state) => {
      // Refresh might be needed here
      toast.error('Səbət təmizlənərkən xəta baş verdi');
    });

    // Remove From Cart
    builder.addCase(removeFromCartAsync.pending, (state, action) => {
      // Optimistic Remove
      const { id, size, color } = action.meta.arg;
      // We keep the removed item in a temp store if we wanted to rollback perfectly
      state.items = state.items.filter(
        (item) => !(
          String(item.id) === String(id) && 
          item.size === size &&
          item.color === color
        )
      );
    });

    builder.addCase(removeFromCartAsync.rejected, (state, action) => {
      // Rollback (Refetch cart is safer)
      toast.error('Məhsul silinərkən xəta baş verdi');
    });
  },
});

export const { toggleCart, openCart, closeCart, clearCart, updateQuantity, addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
