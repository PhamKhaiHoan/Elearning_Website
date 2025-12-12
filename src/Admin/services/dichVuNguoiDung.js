import { dichVuHttp } from './dichVuHttp';
import { MA_NHOM } from './config';

export const dichVuNguoiDung = {
  layDanhSachNguoiDung: (tuKhoa = '') => {
    if (tuKhoa.trim() !== '') {
      return dichVuHttp.get(`/api/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${MA_NHOM}&tuKhoa=${tuKhoa}`);
    }
    return dichVuHttp.get(`/api/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${MA_NHOM}`);
  },

  xoaNguoiDung: (taiKhoan) => {
    return dichVuHttp.delete(`/api/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`);
  },

  themNguoiDung: (data) => {
    return dichVuHttp.post('/api/QuanLyNguoiDung/ThemNguoiDung', data);
  }
};