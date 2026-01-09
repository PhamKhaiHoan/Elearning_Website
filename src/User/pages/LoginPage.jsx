import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { elearningApi } from "../api/elearningApi";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [taiKhoan, setTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [dangXuLy, setDangXuLy] = useState(false);

  const { dangNhap } = useAuth();
  const navigate = useNavigate();

  const xuLyDangNhap = async (e) => {
    e.preventDefault();
    try {
      setDangXuLy(true);
      const res = await elearningApi.dangNhap({ taiKhoan, matKhau });
      const payload = res?.content || res;

      dangNhap(payload);
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Đăng nhập thất bại!");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="container">
      <div
        className="card"
        style={{ maxWidth: 520, margin: "0 auto", marginTop: 32 }}
      >
        <h2 style={{ marginTop: 0 }}>Đăng nhập</h2>
        <p className="muted">
          Nhập tài khoản và mật khẩu để truy cập hệ thống.
        </p>

        <form className="vstack" onSubmit={xuLyDangNhap}>
          <input
            className="input"
            placeholder="Tài khoản"
            value={taiKhoan}
            onChange={(e) => setTaiKhoan(e.target.value)}
          />
          <input
            className="input"
            placeholder="Mật khẩu"
            type="password"
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
          />

          <button className="btn" disabled={dangXuLy}>
            {dangXuLy ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="muted">
            Chưa có tài khoản? <Link to="/dang-ky">Đăng ký</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
