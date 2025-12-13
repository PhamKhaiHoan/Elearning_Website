import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { layDanhSachNguoiDungThunk } from '../../redux/nguoiDungSlice';
import { dichVuNguoiDung } from '../../services/dichVuNguoiDung';
import { Trash2, Edit, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const TrangNguoiDung = () => {
  const dispatch = useDispatch();
  const { danhSachNguoiDung, dangTai, tongSoTrang } = useSelector((state) => state.nguoiDung);
  
  const [tuKhoa, setTuKhoa] = useState('');
  const [trangHienTai, setTrangHienTai] = useState(1);

  useEffect(() => {
    dispatch(layDanhSachNguoiDungThunk({ 
      tuKhoa: tuKhoa, 
      trang: trangHienTai, 
      soLuong: 30
    }));
  }, [dispatch, trangHienTai, tuKhoa]); 

  const xuLyTimKiem = (e) => {
    e.preventDefault();
    setTrangHienTai(1); 
    dispatch(layDanhSachNguoiDungThunk({ tuKhoa, trang: 1, soLuong: 30 }));
  };

  const xuLyXoa = async (taiKhoan) => {
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản: ${taiKhoan}?`)) {
      try {
        await dichVuNguoiDung.xoaNguoiDung(taiKhoan);
        alert('Xóa thành công!');
        dispatch(layDanhSachNguoiDungThunk({ tuKhoa, trang: trangHienTai, soLuong: 30 }));
      } catch (error) {
        alert(error.response?.data || 'Có lỗi xảy ra khi xóa!');
      }
    }
  };

  const thayDoiTrang = (soTrangMoi) => {
    if (soTrangMoi >= 1 && soTrangMoi <= tongSoTrang) {
      setTrangHienTai(soTrangMoi);
    }
  };

  return (
    <div className="space-y-6">
      {/* --- Thanh Công Cụ --- */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={xuLyTimKiem} className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </form>
        
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
          <Plus size={20} />
          <span>Thêm Người Dùng</span>
        </button>
      </div>

      {/* --- Bảng Dữ Liệu --- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4 border-b">STT</th>
                <th className="px-6 py-4 border-b">Tài Khoản</th>
                <th className="px-6 py-4 border-b">Họ Tên</th>
                <th className="px-6 py-4 border-b">Email</th>
                <th className="px-6 py-4 border-b">Số ĐT</th>
                <th className="px-6 py-4 border-b">Loại ND</th>
                <th className="px-6 py-4 border-b text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dangTai ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    <div className="flex justify-cwenter items-center gap-2">
                       <span className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></span>
                       Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : danhSachNguoiDung?.length > 0 ? (
                danhSachNguoiDung.map((user, index) => (
                  <tr key={user.taiKhoan} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-500">
                        {(trangHienTai - 1) * 30 + index + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{user.taiKhoan}</td>
                    <td className="px-6 py-4 text-gray-700">{user.hoTen}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{user.soDt}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.maLoaiNguoiDung === 'GV'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {user.maLoaiNguoiDung}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Sửa">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => xuLyXoa(user.taiKhoan)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors" 
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    Không tìm thấy dữ liệu nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- THANH PHÂN TRANG --- */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
           <span className="text-sm text-gray-500">
              Trang <span className="font-medium text-gray-900">{trangHienTai}</span> / {tongSoTrang}
           </span>
           
           <div className="flex gap-2">
              <button
                onClick={() => thayDoiTrang(trangHienTai - 1)}
                disabled={trangHienTai === 1}
                className={`flex items-center gap-1 px-3 py-1 rounded-md border text-sm font-medium transition-colors
                  ${trangHienTai === 1 
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-white hover:border-blue-500 hover:text-blue-600 bg-white shadow-sm'}`}
              >
                <ChevronLeft size={16} /> Trước
              </button>

              <button
                onClick={() => thayDoiTrang(trangHienTai + 1)}
                disabled={trangHienTai === tongSoTrang}
                className={`flex items-center gap-1 px-3 py-1 rounded-md border text-sm font-medium transition-colors
                  ${trangHienTai === tongSoTrang 
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-white hover:border-blue-500 hover:text-blue-600 bg-white shadow-sm'}`}
              >
                Sau <ChevronRight size={16} />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default TrangNguoiDung;