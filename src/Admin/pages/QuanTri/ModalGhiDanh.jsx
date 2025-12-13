import React, { useEffect, useState } from "react";
import { dichVuKhoaHoc } from "../../services/dichVuKhoaHoc";
import { X, UserPlus, Trash2, UserCheck } from "lucide-react";
import { toast } from "react-toastify";
import ModalXacNhan from "../../components/ModalXacNhan";

const ModalGhiDanh = ({ dangMo, dongModal, maKhoaHoc }) => {
  const [dsChuaGhiDanh, setDsChuaGhiDanh] = useState([]);
  const [dsDaGhiDanh, setDsDaGhiDanh] = useState([]);
  const [taiKhoanChon, setTaiKhoanChon] = useState("");
  const [dangTai, setDangTai] = useState(false);

  const [modalXoaOpen, setModalXoaOpen] = useState(false);
  const [taiKhoanCanXoa, setTaiKhoanCanXoa] = useState(null);

  const layDuLieuGhiDanh = async () => {
    if (!maKhoaHoc) return;
    setDangTai(true);
    try {
      const [resChuaGhiDanh, resDaGhiDanh] = await Promise.all([
        dichVuKhoaHoc.layDsNguoiDungChuaGhiDanh(maKhoaHoc),
        dichVuKhoaHoc.layDsHocVienKhoaHoc(maKhoaHoc),
      ]);
      setDsChuaGhiDanh(resChuaGhiDanh.data);
      setDsDaGhiDanh(resDaGhiDanh.data);
    } catch (error) {
      console.log("Lỗi load dữ liệu ghi danh:", error);
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    if (dangMo) {
      layDuLieuGhiDanh();
      setTaiKhoanChon("");
    }
  }, [dangMo, maKhoaHoc]);

  const xuLyGhiDanh = async () => {
    if (!taiKhoanChon) return toast.error("Vui lòng chọn người dùng!");
    try {
      await dichVuKhoaHoc.ghiDanhKhoaHoc(maKhoaHoc, taiKhoanChon);
      toast.success("Ghi danh thành công!");
      layDuLieuGhiDanh();
      setTaiKhoanChon("");
    } catch (error) {
      toast.error(error.response?.data || "Ghi danh thất bại!");
    }
  };

  const moModalHuyGhiDanh = (taiKhoan) => {
    setTaiKhoanCanXoa(taiKhoan);
    setModalXoaOpen(true);
  };

  const xacNhanHuyGhiDanh = async () => {
    try {
      await dichVuKhoaHoc.huyGhiDanh(maKhoaHoc, taiKhoanCanXoa);
      toast.success("Hủy ghi danh thành công!");
      layDuLieuGhiDanh();
    } catch (error) {
      toast.error(error.response?.data || "Hủy thất bại!");
    }
  };

  if (!dangMo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <ModalXacNhan
        dangMo={modalXoaOpen}
        dongModal={() => setModalXoaOpen(false)}
        xacNhan={xacNhanHuyGhiDanh}
        tieuDe="Xóa Học Viên"
        noiDung={`Bạn có chắc muốn xóa học viên "${taiKhoanCanXoa}" khỏi khóa học này?`}
      />

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
        <div className="flex justify-between items-center p-4 border-b bg-blue-50 shrink-0">
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

        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-gray-50/30">
          {dangTai ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-3"></div>
              <p className="font-medium">Đang tải danh sách học viên...</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                  <UserPlus size={18} className="text-blue-500" /> Thêm học viên
                  vào khóa
                </h4>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <select
                      className="w-full h-11 pl-3 pr-10 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                      value={taiKhoanChon}
                      onChange={(e) => setTaiKhoanChon(e.target.value)}
                    >
                      <option value="">
                        -- Chọn người dùng chưa ghi danh --
                      </option>
                      {dsChuaGhiDanh.map((user) => (
                        <option key={user.taiKhoan} value={user.taiKhoan}>
                          {user.hoTen} ({user.taiKhoan})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={xuLyGhiDanh}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 h-11 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm active:scale-95"
                  >
                    <UserPlus size={18} /> Ghi Danh
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 bg-white">
                  <h4 className="font-bold text-gray-700">
                    Danh sách học viên{" "}
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs ml-2">
                      {dsDaGhiDanh.length}
                    </span>
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 uppercase text-gray-500 font-semibold text-xs">
                      <tr>
                        <th className="px-6 py-3">STT</th>
                        <th className="px-6 py-3">Tài Khoản</th>
                        <th className="px-6 py-3">Họ Tên</th>
                        <th className="px-6 py-3 text-center">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dsDaGhiDanh.length > 0 ? (
                        dsDaGhiDanh.map((hv, index) => (
                          <tr
                            key={hv.taiKhoan}
                            className="hover:bg-blue-50/30 transition-colors group"
                          >
                            <td className="px-6 py-3 font-medium text-gray-400">
                              {index + 1}
                            </td>
                            <td className="px-6 py-3 font-semibold text-gray-700 group-hover:text-blue-600">
                              {hv.taiKhoan}
                            </td>
                            <td className="px-6 py-3 text-gray-600">
                              {hv.hoTen}
                            </td>
                            <td className="px-6 py-3 text-center">
                              <button
                                onClick={() => moModalHuyGhiDanh(hv.taiKhoan)}
                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
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
                            className="text-center py-10 text-gray-400"
                          >
                            <div className="flex flex-col items-center">
                              <UserCheck
                                size={40}
                                className="mb-2 opacity-20"
                              />
                              Chưa có học viên nào.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalGhiDanh;
