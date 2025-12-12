import { dichVuHttp } from './dichVuApi';
import { MA_NHOM } from './config';

export const dichVuNguoiDung = {
  dangNhap: (thongTinDangNhap) => {
    return dichVuHttp.post('/api/QuanLyNguoiDung/DangNhap', thongTinDangNhap);
  },

  layDanhSachNguoiDung: (trang = 1, soLuong = 10, tuKhoa = '') => {
    let url = `/api/QuanLyNguoiDung/LayDanhSachNguoiDung_PhanTrang?MaNhom=${MA_NHOM}&page=${trang}&pageSize=${soLuong}`;
    if (tuKhoa) {
      url += `&tuKhoa=${tuKhoa}`;
    }
    return dichVuHttp.get(url);
  },

  xoaNguoiDung: (taiKhoan) => {
    return dichVuHttp.delete(`/api/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`);
  },

  themNguoiDung: (duLieuNguoiDung) => {
    return dichVuHttp.post('/api/QuanLyNguoiDung/ThemNguoiDung', duLieuNguoiDung);
  },
  
  capNhatNguoiDung: (duLieuNguoiDung) => {
      return dichVuHttp.put('/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung', duLieuNguoiDung);
  }
};