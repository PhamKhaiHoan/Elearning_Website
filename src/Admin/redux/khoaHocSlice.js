import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dichVuKhoaHoc } from '../services/dichVuKhoaHoc';

export const layDanhSachKhoaHocThunk = createAsyncThunk(
  'khoaHoc/layDanhSach',
  async ({ tenKhoaHoc = '', trang = 1, soLuong = 10 } = {}, { rejectWithValue }) => {
    try {
      const result = await dichVuKhoaHoc.layDanhSachKhoaHoc(tenKhoaHoc, trang, soLuong);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const layDanhMucKhoaHocThunk = createAsyncThunk(
  'khoaHoc/layDanhMuc',
  async (_, { rejectWithValue }) => {
    try {
      const result = await dichVuKhoaHoc.layDanhMucKhoaHoc();
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const khoaHocSlice = createSlice({
  name: 'khoaHoc',
  initialState: {
    danhSachKhoaHoc: [],
    danhMucKhoaHoc: [],
    tongSoTrang: 0,
    dangTai: false,
    loi: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(layDanhSachKhoaHocThunk.pending, (state) => {
        state.dangTai = true;
      })
      .addCase(layDanhSachKhoaHocThunk.fulfilled, (state, action) => {
        state.dangTai = false;
        state.danhSachKhoaHoc = action.payload.items;
        state.tongSoTrang = action.payload.totalPages;
      })
      .addCase(layDanhSachKhoaHocThunk.rejected, (state, action) => {
        state.dangTai = false;
        state.loi = action.payload;
      })
      .addCase(layDanhMucKhoaHocThunk.fulfilled, (state, action) => {
        state.danhMucKhoaHoc = action.payload;
      });
  },
});

export default khoaHocSlice.reducer;