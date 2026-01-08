import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { elearningApi } from "../api/elearningApi";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [taiKhoan, setTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await elearningApi.login({ taiKhoan, matKhau });

      // res thường là { statusCode, message, content }
      const payload = res?.content || res;

      login(payload);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ marginTop: 0 }}>Đăng nhập</h2>
        <p className="muted">Nhập tài khoản và mật khẩu để truy cập hệ thống.</p>

        {error && (
          <div className="card" style={{ borderColor: "#fecaca", background: "#fff1f2" }}>
            <b>Lỗi:</b> {error}
          </div>
        )}

        <form className="vstack" onSubmit={onSubmit}>
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

          <button className="btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="muted">
            Chưa có tài khoản? <Link to="/dang-ky">Đăng ký</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
