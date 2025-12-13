import { dichVuHttp } from "./dichVuHttp";
import { MA_NHOM } from "./config";

export const dichVuNguoiDung = {
  layDanhSachNguoiDung: (tuKhoa = "", trang = 1, soLuong = 30) => {
    let url = `/api/QuanLyNguoiDung/LayDanhSachNguoiDung_PhanTrang?MaNhom=${MA_NHOM}&page=${trang}&pageSize=${soLuong}`;
    if (tuKhoa.trim() !== "") {
      url += `&tuKhoa=${encodeURIComponent(tuKhoa)}`;
    }
    return dichVuHttp.get(url);
  },

  layDanhSachNguoiDungAll: () => {
    return dichVuHttp.get(
      `/api/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${MA_NHOM}`
    );
  },
  xoaNguoiDung: (taiKhoan) => {
    return dichVuHttp.delete(
      `/api/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`
    );
  },
  themNguoiDung: (data) => {
    return dichVuHttp.post("/api/QuanLyNguoiDung/ThemNguoiDung", data);
  },
  capNhatNguoiDung: (data) => {
    return dichVuHttp.put(
      "/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
      data
    );
  },
};
