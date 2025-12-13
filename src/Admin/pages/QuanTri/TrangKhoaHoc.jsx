import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { layDanhSachKhoaHocThunk } from "../../redux/khoaHocSlice";
import { dichVuKhoaHoc } from "../../services/dichVuKhoaHoc";
import {
  Trash2,
  Edit,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  UserCog,
} from "lucide-react";
import ModalKhoaHoc from "./ModalKhoaHoc";
import ModalGhiDanh from "./ModalGhiDanh";
import useDebounce from "../../extensions/hooks/useDebounce";
import { toast } from "react-toastify";
import ModalXacNhan from "../../components/ModalXacNhan";

const TrangKhoaHoc = () => {
  const dispatch = useDispatch();
  const { danhSachKhoaHoc, dangTai, tongSoTrang } = useSelector(
    (state) => state.khoaHoc
  );
  const [tenKhoaHoc, setTenKhoaHoc] = useState("");
  const [trangHienTai, setTrangHienTai] = useState(1);
  const tenKhoaHocDebounce = useDebounce(tenKhoaHoc, 500);
  const [modalMo, setModalMo] = useState(false);
  const [khoaHocSua, setKhoaHocSua] = useState(null);
  const [modalGhiDanhMo, setModalGhiDanhMo] = useState(false);
  const [maKhoaHocGhiDanh, setMaKhoaHocGhiDanh] = useState(null);

  const [modalXoaOpen, setModalXoaOpen] = useState(false);
  const [idCanXoa, setIdCanXoa] = useState(null);

  useEffect(() => {
    setTrangHienTai(1);
    dispatch(
      layDanhSachKhoaHocThunk({
        tenKhoaHoc: tenKhoaHocDebounce,
        trang: 1,
        soLuong: 10,
      })
    );
  }, [tenKhoaHocDebounce]);
  useEffect(() => {
    if (trangHienTai !== 1) {
      dispatch(
        layDanhSachKhoaHocThunk({
          tenKhoaHoc: tenKhoaHocDebounce,
          trang: trangHienTai,
          soLuong: 10,
        })
      );
    }
  }, [trangHienTai]);

  const layDuLieu = () => {
    dispatch(
      layDanhSachKhoaHocThunk({
        tenKhoaHoc: tenKhoaHocDebounce,
        trang: trangHienTai,
        soLuong: 10,
      })
    );
  };
  const xuLyTimKiem = (e) => e.preventDefault();

  const moModalXoa = (maKhoaHoc) => {
    setIdCanXoa(maKhoaHoc);
    setModalXoaOpen(true);
  };

  const xacNhanXoa = async () => {
    try {
      await dichVuKhoaHoc.xoaKhoaHoc(idCanXoa);
      toast.success("Xóa thành công!");
      layDuLieu();
    } catch (error) {
      toast.error(error.response?.data || "Xóa thất bại!");
    }
  };

  const moModalThem = () => {
    setKhoaHocSua(null);
    setModalMo(true);
  };
  const moModalSua = (kh) => {
    setKhoaHocSua(kh);
    setModalMo(true);
  };
  const moModalGhiDanh = (maKhoaHoc) => {
    setMaKhoaHocGhiDanh(maKhoaHoc);
    setModalGhiDanhMo(true);
  };
  const thayDoiTrang = (soTrangMoi) => {
    if (soTrangMoi >= 1 && soTrangMoi <= tongSoTrang)
      setTrangHienTai(soTrangMoi);
  };

  return (
    <div className="space-y-6">
      <ModalKhoaHoc
        dangMo={modalMo}
        dongModal={() => setModalMo(false)}
        duLieuSua={khoaHocSua}
        taiLaiTrang={layDuLieu}
      />
      <ModalGhiDanh
        dangMo={modalGhiDanhMo}
        dongModal={() => setModalGhiDanhMo(false)}
        maKhoaHoc={maKhoaHocGhiDanh}
      />

      <ModalXacNhan
        dangMo={modalXoaOpen}
        dongModal={() => setModalXoaOpen(false)}
        xacNhan={xacNhanXoa}
        tieuDe="Xóa Khóa Học"
        noiDung={`Bạn có chắc muốn xóa khóa học "${idCanXoa}" không? Dữ liệu này không thể khôi phục.`}
      />

      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={xuLyTimKiem} className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tenKhoaHoc}
            onChange={(e) => setTenKhoaHoc(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </form>
        <button
          onClick={moModalThem}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-colors"
        >
          <Plus size={20} /> <span>Thêm Khóa Học</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4 border-b">STT</th>
                <th className="px-6 py-4 border-b">Mã KH</th>
                <th className="px-6 py-4 border-b">Tên Khóa Học</th>
                <th className="px-6 py-4 border-b">Hình Ảnh</th>
                <th className="px-6 py-4 border-b">Lượt Xem</th>
                <th className="px-6 py-4 border-b">Người Tạo</th>
                <th className="px-6 py-4 border-b text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dangTai ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <span className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></span>
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : danhSachKhoaHoc?.length > 0 ? (
                danhSachKhoaHoc.map((kh, index) => (
                  <tr
                    key={kh.maKhoaHoc}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-500">
                      {(trangHienTai - 1) * 10 + index + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {kh.maKhoaHoc}
                    </td>
                    <td
                      className="px-6 py-4 max-w-xs truncate font-medium text-gray-800"
                      title={kh.tenKhoaHoc}
                    >
                      {kh.tenKhoaHoc}
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={kh.hinhAnh}
                        alt="Course"
                        className="w-16 h-12 object-cover rounded border shadow-sm"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/100?text=Error";
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-600">{kh.luotXem}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {kh.nguoiTao.hoTen}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => moModalGhiDanh(kh.maKhoaHoc)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          title="Quản lý học viên"
                        >
                          <UserCog size={18} />
                        </button>
                        <button
                          onClick={() => moModalSua(kh)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => moModalXoa(kh.maKhoaHoc)}
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
                    Không tìm thấy khóa học nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <span className="text-sm text-gray-500">
            Trang{" "}
            <span className="font-medium text-gray-900">{trangHienTai}</span> /{" "}
            {tongSoTrang}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => thayDoiTrang(trangHienTai - 1)}
              disabled={trangHienTai === 1}
              className={`flex items-center gap-1 px-3 py-1 rounded-md border text-sm font-medium transition-colors ${
                trangHienTai === 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-white hover:border-blue-500 hover:text-blue-600 bg-white shadow-sm"
              }`}
            >
              <ChevronLeft size={16} /> Trước
            </button>
            <button
              onClick={() => thayDoiTrang(trangHienTai + 1)}
              disabled={trangHienTai === tongSoTrang}
              className={`flex items-center gap-1 px-3 py-1 rounded-md border text-sm font-medium transition-colors ${
                trangHienTai === tongSoTrang
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-white hover:border-blue-500 hover:text-blue-600 bg-white shadow-sm"
              }`}
            >
              Sau <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrangKhoaHoc;
