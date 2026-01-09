import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { elearningApi } from "../api/elearningApi";
import { useAuth } from "../context/AuthContext";

export default function CourseDetailPage() {
  const { maKhoaHoc } = useParams();
  const { daDangNhap, nguoiDung } = useAuth();

  const [khoaHoc, setKhoaHoc] = useState(null);
  const [dangTai, setDangTai] = useState(false);
  const [dangXuLy, setDangXuLy] = useState(false);

  const taiKhoaHoc = async () => {
    try {
      setDangTai(true);
      const res = await elearningApi.layThongTinKhoaHoc(maKhoaHoc);
      setKhoaHoc(res);
    } catch (e) {
      toast.error(e.message || "Không thể tải khóa học!");
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiKhoaHoc();
  }, [maKhoaHoc]);

  const xuLyDangKy = async () => {
    try {
      setDangXuLy(true);
      await elearningApi.dangKyKhoaHoc({
        maKhoaHoc: khoaHoc?.maKhoaHoc,
        taiKhoan: nguoiDung?.taiKhoan,
      });
      toast.success("Đăng ký khóa học thành công!");
    } catch (e) {
      toast.error(e.message || "Đăng ký thất bại!");
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyHuyDangKy = async () => {
    try {
      setDangXuLy(true);
      await elearningApi.huyGhiDanh({
        maKhoaHoc: khoaHoc?.maKhoaHoc,
        taiKhoan: nguoiDung?.taiKhoan,
      });
      toast.success("Hủy đăng ký thành công!");
    } catch (e) {
      toast.error(e.message || "Hủy đăng ký thất bại!");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="container vstack">
      <div className="hstack" style={{ justifyContent: "space-between" }}>
        <Link className="btn btn-outline" to="/">
          ← Quay lại
        </Link>
        <div className="badge">Chi tiết khóa học</div>
      </div>

      {dangTai && <div className="muted">Đang tải...</div>}

      {khoaHoc && (
        <div className="card vstack">
          <img
            src={khoaHoc.hinhAnh}
            alt={khoaHoc.tenKhoaHoc}
            style={{
              width: "100%",
              height: 300,
              objectFit: "cover",
              borderRadius: 12,
              marginBottom: 16,
              backgroundColor: "#f3f4f6",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://picsum.photos/seed/${khoaHoc.maKhoaHoc}/800/300`;
            }}
          />
          <div className="hstack" style={{ justifyContent: "space-between" }}>
            <div>
              <div className="badge">#{khoaHoc.maKhoaHoc}</div>
              <div style={{ fontWeight: 900, fontSize: 22 }}>
                {khoaHoc.tenKhoaHoc}
              </div>
              <div className="muted">Lượt xem: {khoaHoc.luotXem ?? 0}</div>
            </div>

            {!daDangNhap ? (
              <Link className="btn" to="/dang-nhap">
                Đăng nhập để đăng ký
              </Link>
            ) : (
              <div className="hstack">
                <button
                  className="btn"
                  disabled={dangXuLy}
                  onClick={xuLyDangKy}
                >
                  Đăng ký khóa học
                </button>
                <button
                  className="btn btn-outline"
                  disabled={dangXuLy}
                  onClick={xuLyHuyDangKy}
                >
                  Hủy đăng ký
                </button>
              </div>
            )}
          </div>

          <hr style={{ border: 0, borderTop: "1px solid #e5e7eb" }} />

          <div>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Mô tả</div>
            <div className="muted">{khoaHoc.moTa || "Chưa có mô tả"}</div>
          </div>

          <div className="hstack" style={{ flexWrap: "wrap" }}>
            <span className="badge">Nhóm: {khoaHoc.maNhom || "N/A"}</span>
            <span className="badge">
              Danh mục: {khoaHoc.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "N/A"}
            </span>
            <span className="badge">
              Người tạo: {khoaHoc.nguoiTao?.hoTen || "N/A"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
