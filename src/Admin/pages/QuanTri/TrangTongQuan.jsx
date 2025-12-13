import React, { useEffect, useState } from "react";
import { Users, BookOpen, UserCheck, UserPlus, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { dichVuNguoiDung } from "../../services/dichVuNguoiDung";
import { dichVuKhoaHoc } from "../../services/dichVuKhoaHoc";

const TrangTongQuan = () => {
  // State lưu 3 số liệu tổng
  const [thongKe, setThongKe] = useState({
    nguoiDung: 0,
    khoaHoc: 0,
    ghiDanh: 0,
  });

  // State cho 2 phần bên dưới
  const [nguoiDungMoi, setNguoiDungMoi] = useState([]);
  const [dataBieuDo, setDataBieuDo] = useState([]);

  useEffect(() => {
    const layDuLieu = async () => {
      try {
        const [resNguoiDung, resKhoaHoc] = await Promise.all([
          dichVuNguoiDung.layDanhSachNguoiDungAll(),
          dichVuKhoaHoc.layDanhSachKhoaHocAll(),
        ]);

        const dsNguoiDung = resNguoiDung.data || [];
        const dsKhoaHoc = resKhoaHoc.data || [];

        // 1. Cập nhật 3 thẻ thống kê trên cùng
        setThongKe({
          nguoiDung: dsNguoiDung.length,
          khoaHoc: dsKhoaHoc.length,
          ghiDanh: 150, // Số liệu giả định
        });

        // 2. Xử lý Thành Viên Mới (Lấy 5 người cuối cùng -> Đảo ngược lên đầu)
        if (dsNguoiDung.length > 0) {
          const dsReverse = [...dsNguoiDung].reverse();
          setNguoiDungMoi(dsReverse.slice(0, 5));
        }

        // 3. Xử lý Biểu Đồ (Top 5 khóa học nhiều lượt xem nhất)
        if (dsKhoaHoc.length > 0) {
          const topKhoaHoc = [...dsKhoaHoc]
            .sort((a, b) => b.luotXem - a.luotXem) // Sắp xếp giảm dần theo lượt xem
            .slice(0, 5) // Lấy top 5
            .map((kh) => ({
              name:
                kh.tenKhoaHoc.length > 15
                  ? kh.tenKhoaHoc.substring(0, 15) + "..."
                  : kh.tenKhoaHoc,
              uv: kh.luotXem,
            }));
          setDataBieuDo(topKhoaHoc);
        }
      } catch (error) {
        console.log("Lỗi tải dữ liệu dashboard:", error);
      }
    };

    layDuLieu();
  }, []);

  // Component Card Thống Kê (Giữ nguyên cái cũ ông thích)
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

      {/* --- PHẦN 1: 3 THẺ THỐNG KÊ (GIỮ NGUYÊN) --- */}
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

      {/* --- PHẦN 2: HOẠT ĐỘNG MỚI (Thành viên + Biểu đồ) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CỘT TRÁI: THÀNH VIÊN MỚI NHẤT */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-112.5">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UserPlus size={20} className="text-blue-500" /> Thành Viên Mới Nhất
          </h3>
          <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
            <div className="space-y-3">
              {nguoiDungMoi.map((user, index) => (
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
                    className={`text-[12px] px-4 py-2 rounded-full font-semibold border shrink-0
                      ${
                        user.maLoaiNguoiDung === "GV"
                          ? "bg-purple-50 text-purple-700 border-purple-100"
                          : "bg-green-50 text-green-700 border-green-100"
                      }`}
                  >
                    {user.maLoaiNguoiDung}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: BIỂU ĐỒ TOP KHÓA HỌC */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-112.5">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <BarChart3 className="text-green-500" size={20} />
            Top Khóa Học (Lượt Xem)
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            5 khóa học phổ biến nhất hệ thống
          </p>

          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataBieuDo}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f3f4f6" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="uv" radius={[6, 6, 0, 0]} barSize={40}>
                  {dataBieuDo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="url(#colorUv)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrangTongQuan;
