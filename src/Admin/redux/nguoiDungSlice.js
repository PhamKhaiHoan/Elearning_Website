import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dichVuNguoiDung } from "../services/dichVuNguoiDung";

const xoaDauTiengViet = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
};

export const layDanhSachNguoiDungThunk = createAsyncThunk(
  "nguoiDung/layDanhSach",
  async (
    { tuKhoa = "", trang = 1, soLuong = 30 } = {},
    { rejectWithValue }
  ) => {
    try {
      if (tuKhoa && tuKhoa.trim() !== "") {
        const result = await dichVuNguoiDung.layDanhSachNguoiDungAll();
        const allData = result.data;

        const tuKhoaThuong = xoaDauTiengViet(tuKhoa);

        const filteredData = allData.filter((user) => {
          const ten = xoaDauTiengViet(user.hoTen);
          const taiKhoan = xoaDauTiengViet(user.taiKhoan);
          return ten.includes(tuKhoaThuong) || taiKhoan.includes(tuKhoaThuong);
        });

        const totalCount = filteredData.length;
        const totalPages = Math.ceil(totalCount / soLuong);
        const startIndex = (trang - 1) * soLuong;
        const pageItems = filteredData.slice(startIndex, startIndex + soLuong);

        return {
          items: pageItems,
          totalCount: totalCount,
          totalPages: totalPages,
          currentPage: trang,
        };
      }

      else {
        const result = await dichVuNguoiDung.layDanhSachNguoiDung(
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
        state.danhSachNguoiDung = action.payload.items || [];
        state.tongSoTrang = action.payload.totalPages || 1;
      })
      .addCase(layDanhSachNguoiDungThunk.rejected, (state, action) => {
        state.dangTai = false;
        state.loi = action.payload;
      });
  },
});

export default nguoiDungSlice.reducer;
