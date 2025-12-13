import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dichVuNguoiDung } from "../services/dichVuNguoiDung";

export const layDanhSachNguoiDungThunk = createAsyncThunk(
  "nguoiDung/layDanhSach",
  async (
    { tuKhoa = "", trang = 1, soLuong = 30 } = {},
    { rejectWithValue }
  ) => {
    try {
      const result = await dichVuNguoiDung.layDanhSachNguoiDung(
        tuKhoa,
        trang,
        soLuong
      );
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const nguoiDungSlice = createSlice({
  name: "nguoiDung",
  initialState: {
    danhSachNguoiDung: [],
    tongSoTrang: 0,
    dangTai: false,
    loi: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(layDanhSachNguoiDungThunk.pending, (state) => {
        state.dangTai = true;
      })
      .addCase(layDanhSachNguoiDungThunk.fulfilled, (state, action) => {
        state.dangTai = false;
        state.danhSachNguoiDung = action.payload.items;
        state.tongSoTrang = action.payload.totalPages;
      })
      .addCase(layDanhSachNguoiDungThunk.rejected, (state, action) => {
        state.dangTai = false;
        state.loi = action.payload;
      });
  },
});

export default nguoiDungSlice.reducer;
