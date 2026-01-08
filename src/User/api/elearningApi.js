import { axiosClient } from "./axiosClient";

/**
 * Các API bám theo swagger bạn gửi
 * - QuanLyKhoaHoc: lay danh sach, chi tiet
 * - QuanLyNguoiDung: dang nhap, dang ky, ghi danh, huy ghi danh, ...
 */
export const elearningApi = {
  // ===== AUTH =====
  login: (payload) =>
    axiosClient.post("/api/QuanLyNguoiDung/DangNhap", payload).then((r) => r.data),

  register: (payload) =>
    axiosClient.post("/api/QuanLyNguoiDung/DangKy", payload).then((r) => r.data),

  // ===== COURSE (public) =====
  getCourses: (params = {}) =>
    axiosClient
      .get("/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc", { params })
      .then((r) => r.data),

  getCourseDetail: (maKhoaHoc) =>
    axiosClient
      .get("/api/QuanLyKhoaHoc/LayThongTinKhoaHoc", { params: { maKhoaHoc } })
      .then((r) => r.data),

  // ===== USER - COURSE LIST (need auth) =====
  // Lấy DS khóa học CHƯA ghi danh (swagger: POST, query TaiKhoan)
  getUnregisteredCourses: (taiKhoan) =>
    axiosClient
      .post("/api/QuanLyNguoiDung/LayDanhSachKhoaHocChuaGhiDanh", null, {
        params: { TaiKhoan: taiKhoan },
      })
      .then((r) => r.data),

  // Lấy DS khóa học CHỜ xét duyệt (swagger: POST, body { taiKhoan })
  getPendingCourses: (taiKhoan) =>
    axiosClient
      .post("/api/QuanLyNguoiDung/LayDanhSachKhoaHocChoXetDuyet", { taiKhoan })
      .then((r) => r.data),

  // Lấy DS khóa học ĐÃ xét duyệt (swagger: POST, body { taiKhoan })
  getApprovedCourses: (taiKhoan) =>
    axiosClient
      .post("/api/QuanLyNguoiDung/LayDanhSachKhoaHocDaXetDuyet", { taiKhoan })
      .then((r) => r.data),

  // ===== ENROLL / CANCEL =====
  // Ghi danh: body { maKhoaHoc, taiKhoan }
  enrollCourse: (payload) =>
    axiosClient.post("/api/QuanLyKhoaHoc/DangKyKhoaHoc", payload).then((r) => r.data),

  // Hủy ghi danh: body { maKhoaHoc, taiKhoan }
  cancelEnroll: (payload) =>
    axiosClient.post("/api/QuanLyKhoaHoc/HuyGhiDanh", payload).then((r) => r.data),
};
