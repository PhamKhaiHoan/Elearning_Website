import React, { useEffect, useState } from "react";
import { dichVuKhoaHoc } from "../../services/dichVuKhoaHoc";
import { X, UserPlus, Trash2, UserCheck } from "lucide-react";

const ModalGhiDanh = ({ dangMo, dongModal, maKhoaHoc }) => {
  const [dsChuaGhiDanh, setDsChuaGhiDanh] = useState([]);
  const [dsDaGhiDanh, setDsDaGhiDanh] = useState([]);
  const [taiKhoanChon, setTaiKhoanChon] = useState("");

  const layDuLieuGhiDanh = async () => {
    if (!maKhoaHoc) return;
    try {
      const [resChuaGhiDanh, resDaGhiDanh] = await Promise.all([
        dichVuKhoaHoc.layDsNguoiDungChuaGhiDanh(maKhoaHoc),
        dichVuKhoaHoc.layDsHocVienKhoaHoc(maKhoaHoc),
      ]);
      setDsChuaGhiDanh(resChuaGhiDanh.data);
      setDsDaGhiDanh(resDaGhiDanh.data);
    } catch (error) {
      console.log("Lỗi load dữ liệu ghi danh:", error);
    }
  };

  useEffect(() => {
    if (dangMo) {
      layDuLieuGhiDanh();
      setTaiKhoanChon("");
    }
  }, [dangMo, maKhoaHoc]);

  const xuLyGhiDanh = async () => {
    if (!taiKhoanChon) return alert("Vui lòng chọn người dùng!");
    try {
      await dichVuKhoaHoc.ghiDanhKhoaHoc(maKhoaHoc, taiKhoanChon);
      alert("Ghi danh thành công!");
      layDuLieuGhiDanh();
      setTaiKhoanChon("");
    } catch (error) {
      alert(error.response?.data || "Ghi danh thất bại!");
    }
  };

  const xuLyHuyGhiDanh = async (taiKhoan) => {
    if (window.confirm(`Xóa học viên ${taiKhoan} khỏi khóa học?`)) {
      try {
        await dichVuKhoaHoc.huyGhiDanh(maKhoaHoc, taiKhoan);
        alert("Hủy ghi danh thành công!");
        layDuLieuGhiDanh();
      } catch (error) {
        alert(error.response?.data || "Hủy thất bại!");
      }
    }
  };

  if (!dangMo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-blue-50">
          <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
            <UserCheck size={24} /> Quản Lý Học Viên - Khóa {maKhoaHoc}
          </h3>
          <button
            onClick={dongModal}
            className="p-1 hover:bg-blue-100 rounded-full text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* THÊM HỌC VIÊN */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-3 text-gray-700">
              Thêm học viên vào khóa
            </h4>
            <div className="flex gap-2">
              <select
                className="flex-1 border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={taiKhoanChon}
                onChange={(e) => setTaiKhoanChon(e.target.value)}
              >
                <option value="">-- Chọn người dùng --</option>
                {dsChuaGhiDanh.map((user) => (
                  <option key={user.taiKhoan} value={user.taiKhoan}>
                    {user.hoTen} ({user.taiKhoan})
                  </option>
                ))}
              </select>
              <button
                onClick={xuLyGhiDanh}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
              >
                <UserPlus size={18} /> Ghi Danh
              </button>
            </div>
          </div>

          {/* DANH SÁCH ĐÃ GHI DANH */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-700">
              Học viên đang tham gia ({dsDaGhiDanh.length})
            </h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 uppercase text-gray-600 font-semibold">
                  <tr>
                    <th className="px-4 py-3">STT</th>
                    <th className="px-4 py-3">Tài Khoản</th>
                    <th className="px-4 py-3">Họ Tên</th>
                    <th className="px-4 py-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dsDaGhiDanh.length > 0 ? (
                    dsDaGhiDanh.map((hv, index) => (
                      <tr key={hv.taiKhoan} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{hv.taiKhoan}</td>
                        <td className="px-4 py-3">{hv.hoTen}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => xuLyHuyGhiDanh(hv.taiKhoan)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                            title="Xóa khỏi khóa học"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-4 text-gray-500"
                      >
                        Chưa có học viên nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalGhiDanh;
