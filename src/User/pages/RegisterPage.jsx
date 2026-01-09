import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { elearningApi } from "../api/elearningApi";
import { MA_NHOM } from "../../Admin/services/config";

export default function RegisterPage() {
  const [bieuMau, setBieuMau] = useState({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    soDT: "",
    email: "",
    maNhom: MA_NHOM || "GP01",
  });

  const [dangXuLy, setDangXuLy] = useState(false);
  const navigate = useNavigate();

  const thayDoiTruong = (key) => (e) =>
    setBieuMau((prev) => ({ ...prev, [key]: e.target.value }));

  const xuLyDangKy = async (e) => {
    e.preventDefault();
    try {
      setDangXuLy(true);
      await elearningApi.dangKy(bieuMau);
      toast.success("Đăng ký thành công! Bạn có thể đăng nhập.");
      navigate("/dang-nhap");
    } catch (err) {
      toast.error(err.message || "Đăng ký thất bại!");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
        <h2 style={{ marginTop: 0 }}>Đăng ký</h2>
        <p className="muted">Tạo tài khoản mới để đăng ký khóa học.</p>

        <form className="vstack" onSubmit={xuLyDangKy}>
          <input
            className="input"
            placeholder="Tài khoản"
            value={bieuMau.taiKhoan}
            onChange={thayDoiTruong("taiKhoan")}
          />
          <input
            className="input"
            placeholder="Mật khẩu"
            type="password"
            value={bieuMau.matKhau}
            onChange={thayDoiTruong("matKhau")}
          />
          <input
            className="input"
            placeholder="Họ tên"
            value={bieuMau.hoTen}
            onChange={thayDoiTruong("hoTen")}
          />
          <input
            className="input"
            placeholder="Số điện thoại"
            value={bieuMau.soDT}
            onChange={thayDoiTruong("soDT")}
          />
          <input
            className="input"
            placeholder="Email"
            value={bieuMau.email}
            onChange={thayDoiTruong("email")}
          />

          <button className="btn" disabled={dangXuLy}>
            {dangXuLy ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          <div className="muted">
            Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
