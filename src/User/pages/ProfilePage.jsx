import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { elearningApi } from "../api/elearningApi";

export default function ProfilePage() {
  const { nguoiDung, daDangNhap } = useAuth();
  const navigate = useNavigate();
  const [thongTinNguoiDung, setThongTinNguoiDung] = useState(null);
  const [dsKhoaHocDaDuyet, setDsKhoaHocDaDuyet] = useState([]);
  const [dsKhoaHocChoDuyet, setDsKhoaHocChoDuyet] = useState([]);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    if (!daDangNhap) {
      navigate("/dang-nhap");
      return;
    }

    const layThongTin = async () => {
      try {
        setDangTai(true);
        const res = await elearningApi.layThongTinNguoiDung();
        setThongTinNguoiDung(res);

        const taiKhoan = res?.taiKhoan || nguoiDung?.taiKhoan;
        if (taiKhoan) {
          const [resDaDuyet, resChoDuyet] = await Promise.all([
            elearningApi.layDsKhoaHocDaXetDuyet(taiKhoan).catch(() => []),
            elearningApi.layDsKhoaHocChoXetDuyet(taiKhoan).catch(() => []),
          ]);

          const layChiTietKhoaHoc = async (dsKhoaHoc) => {
            if (!dsKhoaHoc || dsKhoaHoc.length === 0) return [];
            const chiTietPromises = dsKhoaHoc.map((kh) =>
              elearningApi
                .layThongTinKhoaHoc(kh.maKhoaHoc)
                .then((data) => ({ ...kh, ...data }))
                .catch(() => kh)
            );
            return Promise.all(chiTietPromises);
          };

          const [daDuyetChiTiet, choDuyetChiTiet] = await Promise.all([
            layChiTietKhoaHoc(resDaDuyet),
            layChiTietKhoaHoc(resChoDuyet),
          ]);

          setDsKhoaHocDaDuyet(daDuyetChiTiet || []);
          setDsKhoaHocChoDuyet(choDuyetChiTiet || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
      } finally {
        setDangTai(false);
      }
    };

    layThongTin();
  }, [daDangNhap, navigate, nguoiDung]);

  if (!daDangNhap) {
    return null;
  }

  const renderDanhSachKhoaHoc = (dsKhoaHoc, trangThai) => {
    const laDaDuyet = trangThai === "daDuyet";

    if (dsKhoaHoc.length === 0) {
      return (
        <p style={{ color: "#6b7280", fontStyle: "italic" }}>
          {laDaDuyet
            ? "Chưa có khóa học nào được duyệt."
            : "Không có khóa học nào đang chờ duyệt."}
        </p>
      );
    }

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {dsKhoaHoc.map((khoaHoc) => (
          <Link
            to={`/khoa-hoc/${khoaHoc.maKhoaHoc}`}
            key={khoaHoc.maKhoaHoc}
            className="card"
            style={{
              margin: 0,
              border: laDaDuyet ? "1px solid #e5e7eb" : "1px solid #fde68a",
              boxShadow: "none",
              textDecoration: "none",
              color: "inherit",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <img
              src={
                khoaHoc.hinhAnh ||
                `https://picsum.photos/seed/${khoaHoc.maKhoaHoc}/300/140`
              }
              alt={khoaHoc.tenKhoaHoc}
              style={{
                width: "100%",
                height: 140,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 12,
                backgroundColor: "#f3f4f6",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://picsum.photos/seed/${khoaHoc.maKhoaHoc}/300/140`;
              }}
            />
            <h4 style={{ margin: 0, marginBottom: 8, fontSize: 16 }}>
              {khoaHoc.tenKhoaHoc}
            </h4>
            <span
              style={{
                display: "inline-block",
                background: laDaDuyet ? "#dcfce7" : "#fef3c7",
                color: laDaDuyet ? "#166534" : "#92400e",
                padding: "4px 12px",
                borderRadius: 16,
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {laDaDuyet ? "✓ Đã duyệt" : "⏳ Chờ duyệt"}
            </span>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>Thông tin cá nhân</h2>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <strong>Họ tên:</strong>{" "}
            {thongTinNguoiDung?.hoTen || nguoiDung?.hoTen || "Chưa cập nhật"}
          </div>
          <div>
            <strong>Email:</strong>{" "}
            {thongTinNguoiDung?.email || nguoiDung?.email || "Chưa cập nhật"}
          </div>
          <div>
            <strong>Tài khoản:</strong>{" "}
            {thongTinNguoiDung?.taiKhoan || nguoiDung?.taiKhoan}
          </div>
          <div>
            <strong>Số điện thoại:</strong>{" "}
            {thongTinNguoiDung?.soDT || nguoiDung?.soDT || "Chưa cập nhật"}
          </div>
          <div>
            <strong>Loại người dùng:</strong>{" "}
            {thongTinNguoiDung?.maLoaiNguoiDung === "GV"
              ? "Quản trị viên"
              : "Học viên"}
          </div>
        </div>
      </div>

      {dangTai && (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <p>Đang tải dữ liệu khóa học...</p>
        </div>
      )}

      {!dangTai && (
        <>
          <div className="card" style={{ marginBottom: 24 }}>
            <h3
              style={{
                marginTop: 0,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: "#16a34a" }}>✓</span>
              Khóa học đã được duyệt ({dsKhoaHocDaDuyet.length})
            </h3>
            {renderDanhSachKhoaHoc(dsKhoaHocDaDuyet, "daDuyet")}
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <h3
              style={{
                marginTop: 0,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: "#d97706" }}>⏳</span>
              Khóa học đang chờ duyệt ({dsKhoaHocChoDuyet.length})
            </h3>
            {renderDanhSachKhoaHoc(dsKhoaHocChoDuyet, "choDuyet")}
          </div>

          {dsKhoaHocDaDuyet.length === 0 && dsKhoaHocChoDuyet.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: 24 }}>
              <p style={{ color: "#6b7280" }}>
                Bạn chưa đăng ký khóa học nào.{" "}
                <Link to="/" style={{ color: "#2563eb" }}>
                  Khám phá khóa học
                </Link>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
