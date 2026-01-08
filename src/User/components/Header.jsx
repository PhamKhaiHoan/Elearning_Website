import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/dang-nhap");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link className="logo" to="/">
          E-Learning
        </Link>

        <div className="search">
          <input className="input" placeholder="Tìm kiếm khóa học..." />
        </div>

        <div className="right">
          <NavLink className="btn btn-outline" to="/">
            Khóa học
          </NavLink>

          {!isLoggedIn ? (
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
              <NavLink className="btn btn-outline" to="/ho-so">
                {user?.hoTen || user?.taiKhoan || "Tài khoản"}
              </NavLink>
              <button className="btn" onClick={onLogout}>
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
