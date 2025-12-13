import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Users, BookOpen, LayoutDashboard, LogOut } from "lucide-react"; 

const LayoutQuanTri = () => {
  const viTriHienTai = useLocation().pathname;

  const danhSachMenu = [
    {
      ten: "Tổng Quan",
      duongDan: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      ten: "Người Dùng",
      duongDan: "/admin/users",
      icon: <Users size={20} />,
    },
    {
      ten: "Khóa Học",
      duongDan: "/admin/courses",
      icon: <BookOpen size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-white shadow-lg flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">
              E-Learning Admin
            </h1>
          </div>

          {/* Menu Items */}
          <nav className="mt-4 px-2 space-y-2">
            {danhSachMenu.map((item) => (
              <Link
                key={item.duongDan}
                to={item.duongDan}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  viTriHienTai === item.duongDan
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.ten}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Nút Đăng Xuất */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-2 text-red-500 hover:text-red-700 w-full px-4 py-2">
            <LogOut size={20} />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-700">
            Trang Quản Trị
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Xin chào, Admin</span>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Khu vực các trang con */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutQuanTri;
