import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const res = await api.get('/cart');
  return res.data;
});

export const addToCart = createAsyncThunk('cart/add', async (item) => {
  const res = await api.post('/cart/add', item);
  return res.data;
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId) => {
  await api.delete(`/cart/item/${itemId}`);
  return itemId;
});

export const updateCartQuantity = createAsyncThunk('cart/updateQty', async ({ itemId, quantity }) => {
  const res = await api.patch(`/cart/item/${itemId}`, { quantity });
  return res.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0, loading: false, error: null },
  reducers: {
    clearCart: (state) => { state.items = []; state.total = 0; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(addToCart.fulfilled, () => {})
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
