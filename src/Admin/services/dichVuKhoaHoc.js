import { dichVuHttp } from './dichVuHttp';
import { MA_NHOM } from './config';

export const dichVuKhoaHoc = {
  layDanhSachKhoaHoc: (tenKhoaHoc = '', trang = 1, soLuong = 10) => {
    let url = `/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc_PhanTrang?MaNhom=${MA_NHOM}&page=${trang}&pageSize=${soLuong}`;
    if (tenKhoaHoc.trim() !== '') {
      url += `&tenKhoaHoc=${tenKhoaHoc}`;
    }
    return dichVuHttp.get(url);
  },

  layDanhMucKhoaHoc: () => {
    return dichVuHttp.get('/api/QuanLyKhoaHoc/LayDanhMucKhoaHoc');
  },

  xoaKhoaHoc: (maKhoaHoc) => {
    return dichVuHttp.delete(`/api/QuanLyKhoaHoc/XoaKhoaHoc?MaKhoaHoc=${maKhoaHoc}`);
  },

  themKhoaHoc: (formData) => {
    // Lưu ý: Dùng endpoint UploadHinh để gửi được file ảnh
    return dichVuHttp.post('/api/QuanLyKhoaHoc/ThemKhoaHocUploadHinh', formData);
  },

  capNhatKhoaHoc: (formData) => {
    return dichVuHttp.post('/api/QuanLyKhoaHoc/CapNhatKhoaHocUpload', formData);
  }
};