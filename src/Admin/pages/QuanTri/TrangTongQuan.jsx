import React, { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  UserCheck,
  Zap,
  BarChart3,
  Calendar,
} from "lucide-react";
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
  const [thongKe, setThongKe] = useState({
    nguoiDung: 0,
    khoaHoc: 0,
    ghiDanh: 0,
  });

  const [khoaHocMoi, setKhoaHocMoi] = useState([]);
  const [dataBieuDo, setDataBieuDo] = useState([]);

  const parseNgayThang = (strDate) => {
    if (!strDate) return 0;
    const parts = strDate.split("/");
    if (parts.length === 3) {
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
    }
    return 0;
  };

  useEffect(() => {
    const layDuLieu = async () => {
      try {
        const [resNguoiDung, resKhoaHoc] = await Promise.all([
          dichVuNguoiDung.layDanhSachNguoiDungAll(),
          dichVuKhoaHoc.layDanhSachKhoaHocAll(),
        ]);

        const dsNguoiDung = resNguoiDung.data || [];
        const dsKhoaHoc = resKhoaHoc.data || [];

        if (dsKhoaHoc.length > 0) {
          const sortedNewCourses = [...dsKhoaHoc]
            .reverse()
            .sort(
              (a, b) => parseNgayThang(b.ngayTao) - parseNgayThang(a.ngayTao)
            )
            .slice(0, 5);
          setKhoaHocMoi(sortedNewCourses);
        }

        if (dsKhoaHoc.length > 0) {
          const candidates = [...dsKhoaHoc]
            .sort((a, b) => b.luotXem - a.luotXem)
            .slice(0, 15);

          const requests = candidates.map((kh) =>
            dichVuKhoaHoc
              .layDsHocVienKhoaHoc(kh.maKhoaHoc)
              .then((res) => ({
                ...kh,
                soLuongHocVienThucTe: res.data ? res.data.length : 0,
              }))
              .catch(() => ({
                ...kh,
                soLuongHocVienThucTe: 0,
              }))
          );

          const results = await Promise.all(requests);

          const top5Real = results
            .sort((a, b) => b.soLuongHocVienThucTe - a.soLuongHocVienThucTe)
            .slice(0, 5)
            .map((item) => ({
              name:
                item.tenKhoaHoc.length > 15
                  ? item.tenKhoaHoc.substring(0, 15) + "..."
                  : item.tenKhoaHoc,
              uv: item.soLuongHocVienThucTe,
            }));

          setDataBieuDo(top5Real);

          setThongKe({
            nguoiDung: dsNguoiDung.length,
            khoaHoc: dsKhoaHoc.length,
            ghiDanh: dsKhoaHoc.reduce(
              (acc, curr) => acc + (curr.luotXem || 0),
              0
            ),
          });
        }
      } catch (error) {
        console.log("Lỗi tải dữ liệu dashboard:", error);
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
          tieuDe="Tổng Lượt Xem"
          giaTri={thongKe.ghiDanh}
          icon={<UserCheck size={24} />}
          mauNen="bg-purple-50"
          mauChu="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KHÓA HỌC MỚI NHẤT */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-112.5">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap size={20} className="text-orange-500" /> Khóa Học Mới Nhất
          </h3>
          <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
            <div className="space-y-4">
              {khoaHocMoi.map((kh, index) => (
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
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={12} />
                        <span>{kh.ngayTao}</span>
                        <span>{kh.nguoiTao.taiKhoan}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BIỂU ĐỒ TOP */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-112.5">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <BarChart3 className="text-green-500" size={20} />
            Top Ghi Danh Nhiều Nhất
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            5 khóa học có số lượng học viên cao nhất
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
                  formatter={(value) => [`${value} học viên`, "Số lượng"]}
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
