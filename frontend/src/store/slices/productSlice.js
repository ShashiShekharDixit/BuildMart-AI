import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const searchProducts = createAsyncThunk('products/search', async (params) => {
  const res = await api.get('/products/public/search', { params });
  return res.data;
});

export const fetchProductDetails = createAsyncThunk('products/details', async (id) => {
  const res = await api.get(`/products/public/${id}`);
  return res.data;
});

export const fetchFeaturedProducts = createAsyncThunk('products/featured', async () => {
  const res = await api.get('/products/public/featured');
  return res.data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [], featured: [], currentProduct: null,
    searchResults: [], totalElements: 0, totalPages: 0,
    currentPage: 0, loading: false, searchLoading: false, error: null,
  },
  reducers: {
    clearCurrentProduct: (state) => { state.currentProduct = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => { state.searchLoading = true; })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.products || [];
        state.totalElements = action.payload.totalElements || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 0;
      })
      .addCase(searchProducts.rejected, (state) => { state.searchLoading = false; })
      .addCase(fetchProductDetails.fulfilled, (state, action) => { state.currentProduct = action.payload; })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => { state.featured = action.payload || []; });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
