import { dichVuHttp } from "./dichVuHttp";
import { MA_NHOM } from "./config";

export const dichVuKhoaHoc = {
  layDanhSachKhoaHoc: (tenKhoaHoc = "", trang = 1, soLuong = 10) => {
    const params = {
      MaNhom: MA_NHOM,
      page: trang,
      pageSize: soLuong,
    };

    if (tenKhoaHoc && tenKhoaHoc.trim() !== "") {
      params.tenKhoaHoc = tenKhoaHoc;
    }

    return dichVuHttp.get(`/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc_PhanTrang`, {
      params: params,
    });
  },

  layDanhSachKhoaHocAll: () => {
    return dichVuHttp.get(`/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc`, {
      params: { MaNhom: MA_NHOM },
    });
  },

  layThongTinKhoaHoc: (maKhoaHoc) => {
    return dichVuHttp.get(`/api/QuanLyKhoaHoc/LayThongTinKhoaHoc`, {
      params: { maKhoaHoc: maKhoaHoc },
    });
  },

  layDanhMucKhoaHoc: () => {
    return dichVuHttp.get("/api/QuanLyKhoaHoc/LayDanhMucKhoaHoc");
  },

  xoaKhoaHoc: (maKhoaHoc) => {
    return dichVuHttp.delete(`/api/QuanLyKhoaHoc/XoaKhoaHoc`, {
      params: { MaKhoaHoc: maKhoaHoc },
    });
  },

  themKhoaHoc: (formData) => {
    return dichVuHttp.post(
      "/api/QuanLyKhoaHoc/ThemKhoaHocUploadHinh",
      formData
    );
  },

  capNhatKhoaHoc: (formData) => {
    return dichVuHttp.post("/api/QuanLyKhoaHoc/CapNhatKhoaHocUpload", formData);
  },

  layDsNguoiDungChuaGhiDanh: (maKhoaHoc) => {
    return dichVuHttp.post(
      `/api/QuanLyNguoiDung/LayDanhSachNguoiDungChuaGhiDanh`,
      { maKhoaHoc: maKhoaHoc }
    );
  },

  layDsHocVienKhoaHoc: (maKhoaHoc) => {
    return dichVuHttp.post(`/api/QuanLyNguoiDung/LayDanhSachHocVienKhoaHoc`, {
      maKhoaHoc: maKhoaHoc,
    });
  },

  ghiDanhKhoaHoc: (maKhoaHoc, taiKhoan) => {
    return dichVuHttp.post(`/api/QuanLyKhoaHoc/GhiDanhKhoaHoc`, {
      maKhoaHoc: maKhoaHoc,
      taiKhoan: taiKhoan,
    });
  },

  huyGhiDanh: (maKhoaHoc, taiKhoan) => {
    return dichVuHttp.post(`/api/QuanLyKhoaHoc/HuyGhiDanh`, {
      maKhoaHoc: maKhoaHoc,
      taiKhoan: taiKhoan,
    });
  },
};
