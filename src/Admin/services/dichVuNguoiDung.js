import { dichVuHttp } from "./dichVuHttp";
import { MA_NHOM } from "./config";

export const dichVuNguoiDung = {
  layDanhSachNguoiDung: (tuKhoa = "", trang = 1, soLuong = 30) => {
    const params = {
      MaNhom: MA_NHOM,
      page: trang,
      pageSize: soLuong,
    };

    if (tuKhoa && tuKhoa.trim() !== "") {
      params.tuKhoa = tuKhoa;
    }

    return dichVuHttp.get(
      `/api/QuanLyNguoiDung/LayDanhSachNguoiDung_PhanTrang`,
      {
        params: params,
      }
    );
  },

  layDanhSachNguoiDungAll: () => {
    return dichVuHttp.get(`/api/QuanLyNguoiDung/LayDanhSachNguoiDung`, {
      params: { MaNhom: MA_NHOM },
    });
  },

  xoaNguoiDung: (taiKhoan) => {
    return dichVuHttp.delete(`/api/QuanLyNguoiDung/XoaNguoiDung`, {
      params: { TaiKhoan: taiKhoan },
    });
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
