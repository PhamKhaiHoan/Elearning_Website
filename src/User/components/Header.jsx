import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { daDangNhap, nguoiDung, dangXuat } = useAuth();
  const navigate = useNavigate();

  const xuLyDangXuat = () => {
    dangXuat();
    navigate("/dang-nhap");
  };

  const laAdmin = nguoiDung?.maLoaiNguoiDung === "GV";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link className="logo" to="/">
          E-Learning
        </Link>

        <div className="right">
          <NavLink className="btn btn-outline" to="/">
            Khóa học
          </NavLink>

          {!daDangNhap ? (
            <>
              <NavLink className="btn btn-outline" to="/dang-nhap">
                Đăng nhập
              </NavLink>
              <NavLink className="btn" to="/dang-ky">
                Đăng ký
              </NavLink>
            </>
          ) : (
            <>
              {laAdmin && (
                <NavLink className="btn btn-outline" to="/admin">
                  Quản trị
                </NavLink>
              )}
              <NavLink className="btn btn-outline" to="/ho-so">
                {nguoiDung?.hoTen || nguoiDung?.taiKhoan || "Tài khoản"}
              </NavLink>
              <button className="btn" onClick={xuLyDangXuat}>
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
