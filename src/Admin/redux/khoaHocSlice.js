import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dichVuKhoaHoc } from "../services/dichVuKhoaHoc";

const xoaDauTiengViet = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
};

export const layDanhSachKhoaHocThunk = createAsyncThunk(
  "khoaHoc/layDanhSach",
  async (
    { tenKhoaHoc = "", trang = 1, soLuong = 10 } = {},
    { rejectWithValue }
  ) => {
    try {
      if (tenKhoaHoc && tenKhoaHoc.trim() !== "") {
        const result = await dichVuKhoaHoc.layDanhSachKhoaHocAll();
        const allData = result.data;

        const tuKhoaThuong = xoaDauTiengViet(tenKhoaHoc);

        const filteredData = allData.filter((kh) =>
          xoaDauTiengViet(kh.tenKhoaHoc).includes(tuKhoaThuong)
        );

        const totalCount = filteredData.length;
        const totalPages = Math.ceil(totalCount / soLuong);
        const startIndex = (trang - 1) * soLuong;
        const pageItems = filteredData.slice(startIndex, startIndex + soLuong);

        return {
          items: pageItems,
          totalCount: totalCount,
          totalPages: totalPages,
        };
      }

      else {
        const result = await dichVuKhoaHoc.layDanhSachKhoaHoc(
          "",
          trang,
          soLuong
        );
        return result.data;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const layDanhMucKhoaHocThunk = createAsyncThunk(
  "khoaHoc/layDanhMuc",
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
  name: "khoaHoc",
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
        state.danhSachKhoaHoc = action.payload.items || [];
        state.tongSoTrang = action.payload.totalPages || 1;
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
