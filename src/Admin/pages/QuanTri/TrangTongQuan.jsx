import React, { useEffect, useState } from "react";
import { Users, BookOpen, UserCheck, UserPlus, Zap } from "lucide-react";
import { dichVuNguoiDung } from "../../services/dichVuNguoiDung";
import { dichVuKhoaHoc } from "../../services/dichVuKhoaHoc";

const TrangTongQuan = () => {
  const [thongKe, setThongKe] = useState({
    nguoiDung: 0,
    khoaHoc: 0,
    ghiDanh: 0,
  });
  const [khoaHocMoi, setKhoaHocMoi] = useState([]);
  const [nguoiDungMoi, setNguoiDungMoi] = useState([]);

  const parseNgayThang = (strDate) => {
    if (!strDate) return 0;

    const [datePart, timePart] = strDate.split(" ");
    if (!datePart) return 0;

    const parts = datePart.split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);

      let hour = 0,
        minute = 0,
        second = 0;
      if (timePart) {
        const timeParts = timePart.split(":");
        if (timeParts.length >= 2) {
          hour = parseInt(timeParts[0], 10);
          minute = parseInt(timeParts[1], 10);
          second = parseInt(timeParts[2] || 0, 10);
        }
      }

      return new Date(year, month, day, hour, minute, second).getTime();
    }
    return 0;
  };

  useEffect(() => {
    const layDuLieu = async () => {
      try {
        const [resNguoiDungAll, resKhoaHocAll] = await Promise.all([
          dichVuNguoiDung.layDanhSachNguoiDungAll(),
          dichVuKhoaHoc.layDanhSachKhoaHocAll(),
        ]);

        const dsNguoiDung = resNguoiDungAll.data;
        const dsKhoaHoc = resKhoaHocAll.data;

        setThongKe({
          nguoiDung: dsNguoiDung.length,
          khoaHoc: dsKhoaHoc.length,
          ghiDanh: 150,
        });

        if (dsKhoaHoc && dsKhoaHoc.length > 0) {
          const sortedKH = [...dsKhoaHoc].sort((a, b) => {
            return parseNgayThang(b.ngayTao) - parseNgayThang(a.ngayTao);
          });
          setKhoaHocMoi(sortedKH.slice(0, 5));
        }

        if (dsNguoiDung && dsNguoiDung.length > 0) {
          setNguoiDungMoi([...dsNguoiDung].reverse().slice(0, 5));
        }
      } catch (error) {
        console.log("Lỗi lấy dữ liệu dashboard:", error);
      }
    };

    layDuLieu();
  }, []);

  const TheThongKe = ({ tieuDe, giaTri, icon, mauNen, mauChu }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:-translate-y-1">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{tieuDe}</p>
        <h3 className="text-3xl font-bold text-gray-800">
          {giaTri.toLocaleString()}
        </h3>
      </div>
      <div className={`p-4 rounded-full ${mauNen} ${mauChu} shadow-sm`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Tổng Quan Hệ Thống</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TheThongKe
          tieuDe="Tổng Thành Viên"
          giaTri={thongKe.nguoiDung}
          icon={<Users size={24} />}
          mauNen="bg-blue-50"
          mauChu="text-blue-600"
        />
        <TheThongKe
          tieuDe="Tổng Khóa Học"
          giaTri={thongKe.khoaHoc}
          icon={<BookOpen size={24} />}
          mauNen="bg-green-50"
          mauChu="text-green-600"
        />
        <TheThongKe
          tieuDe="Lượt Ghi Danh"
          giaTri={thongKe.ghiDanh}
          icon={<UserCheck size={24} />}
          mauNen="bg-purple-50"
          mauChu="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KHÓA HỌC MỚI */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-125">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap size={20} className="text-orange-500" /> Khóa Học Mới Nhất
          </h3>
          <div className="flex-1 overflow-auto pr-2">
            <div className="space-y-3">
              {khoaHocMoi.length > 0 ? (
                khoaHocMoi.map((kh, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-start p-3 rounded-lg hover:bg-orange-50/50 transition-colors border border-transparent hover:border-orange-100 group"
                  >
                    <div className="relative w-16 h-12 shrink-0">
                      <img
                        src={kh.hinhAnh}
                        alt="course"
                        className="w-full h-full rounded-md object-cover shadow-sm border border-gray-100"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/100?text=KH";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {kh.tenKhoaHoc}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {kh.luotXem} xem
                        </span>
                        <span className="text-xs text-gray-400">
                          {kh.ngayTao || "Vừa xong"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 mt-10">
                  Không có khóa học mới.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* NGƯỜI DÙNG MỚI */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-125">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UserPlus size={20} className="text-blue-500" /> Thành Viên Mới Nhất
          </h3>
          <div className="flex-1 overflow-auto pr-2">
            <div className="space-y-3">
              {nguoiDungMoi.length > 0 ? (
                nguoiDungMoi.map((user, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-center p-3 rounded-lg hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm shrink-0
                        ${
                          user.maLoaiNguoiDung === "GV"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-green-100 text-green-600"
                        }`}
                    >
                      {user.hoTen ? user.hoTen.charAt(0).toUpperCase() : "U"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.hoTen}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border shrink-0
                        ${
                          user.maLoaiNguoiDung === "GV"
                            ? "bg-purple-50 text-purple-700 border-purple-100"
                            : "bg-green-50 text-green-700 border-green-100"
                        }`}
                    >
                      {user.maLoaiNguoiDung === "GV" ? "Giáo Vụ" : "Học Viên"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 mt-10">
                  Không có thành viên mới.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrangTongQuan;
