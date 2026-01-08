import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { elearningApi } from "../api/elearningApi";

export default function RegisterPage() {
  const [form, setForm] = useState({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    soDT: "",
    email: "",
    maNhom: "GP01",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await elearningApi.register(form);
      alert("Đăng ký thành công! Bạn có thể đăng nhập.");
      navigate("/dang-nhap");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
        <h2 style={{ marginTop: 0 }}>Đăng ký</h2>
        <p className="muted">Tạo tài khoản mới để đăng ký khóa học.</p>

        {error && (
          <div className="card" style={{ borderColor: "#fecaca", background: "#fff1f2" }}>
            <b>Lỗi:</b> {error}
          </div>
        )}

        <form className="vstack" onSubmit={onSubmit}>
          <input className="input" placeholder="Tài khoản" value={form.taiKhoan} onChange={onChange("taiKhoan")} />
          <input className="input" placeholder="Mật khẩu" type="password" value={form.matKhau} onChange={onChange("matKhau")} />
          <input className="input" placeholder="Họ tên" value={form.hoTen} onChange={onChange("hoTen")} />
          <input className="input" placeholder="Số điện thoại" value={form.soDT} onChange={onChange("soDT")} />
          <input className="input" placeholder="Email" value={form.email} onChange={onChange("email")} />
          <input className="input" placeholder="Mã nhóm (VD: GP01)" value={form.maNhom} onChange={onChange("maNhom")} />

          <button className="btn" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          <div className="muted">
            Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
