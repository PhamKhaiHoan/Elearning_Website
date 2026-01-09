import { axiosClient } from "./axiosClient";

export const elearningApi = {
  dangNhap: (payload) =>
    axiosClient
      .post("/api/QuanLyNguoiDung/DangNhap", payload)
      .then((r) => r.data),

  dangKy: (payload) =>
    axiosClient
      .post("/api/QuanLyNguoiDung/DangKy", payload)
      .then((r) => r.data),

  layThongTinNguoiDung: () =>
    axiosClient
      .post("/api/QuanLyNguoiDung/ThongTinNguoiDung")
      .then((r) => r.data),

  layDanhSachKhoaHoc: (params = {}) =>
    axiosClient
      .get("/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc", { params })
      .then((r) => r.data),

  layThongTinKhoaHoc: (maKhoaHoc) =>
    axiosClient
      .get("/api/QuanLyKhoaHoc/LayThongTinKhoaHoc", { params: { maKhoaHoc } })
      .then((r) => r.data),

  layDsKhoaHocChuaGhiDanh: (taiKhoan) =>
    axiosClient
      .post("/api/QuanLyNguoiDung/LayDanhSachKhoaHocChuaGhiDanh", { taiKhoan })
      .then((r) => r.data),

  layDsKhoaHocChoXetDuyet: (taiKhoan) =>
    axiosClient
      .post("/api/QuanLyNguoiDung/LayDanhSachKhoaHocChoXetDuyet", {
        TaiKhoan: taiKhoan,
      })
      .then((r) => r.data),

  layDsKhoaHocDaXetDuyet: (taiKhoan) =>
    axiosClient
      .post("/api/QuanLyNguoiDung/LayDanhSachKhoaHocDaXetDuyet", {
        TaiKhoan: taiKhoan,
      })
      .then((r) => r.data),

  dangKyKhoaHoc: (payload) =>
    axiosClient
      .post("/api/QuanLyKhoaHoc/DangKyKhoaHoc", payload)
      .then((r) => r.data),

  huyGhiDanh: (payload) =>
    axiosClient
      .post("/api/QuanLyKhoaHoc/HuyGhiDanh", payload)
      .then((r) => r.data),
};
