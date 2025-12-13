import { dichVuHttp } from './dichVuHttp';
import { MA_NHOM } from './config';

export const dichVuNguoiDung = {
  layDanhSachNguoiDung: (tuKhoa = '', trang = 1, soLuong = 50) => {
    let url = `/api/QuanLyNguoiDung/LayDanhSachNguoiDung_PhanTrang?MaNhom=${MA_NHOM}&page=${trang}&pageSize=${soLuong}`;
    
    if (tuKhoa.trim() !== '') {
      url += `&tuKhoa=${tuKhoa}`;
    }
    
    return dichVuHttp.get(url);
  },

  xoaNguoiDung: (taiKhoan) => {
    return dichVuHttp.delete(`/api/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`);
  },

  themNguoiDung: (data) => {
    return dichVuHttp.post('/api/QuanLyNguoiDung/ThemNguoiDung', data);
  }
};