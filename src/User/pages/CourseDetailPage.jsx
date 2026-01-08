import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { elearningApi } from "../api/elearningApi";
import { useAuth } from "../context/AuthContext";

export default function CourseDetailPage() {
  const { maKhoaHoc } = useParams();
  const { isLoggedIn, user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await elearningApi.getCourseDetail(maKhoaHoc);
      setCourse(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maKhoaHoc]);

  const onEnroll = async () => {
    try {
      setActionLoading(true);
      setError("");
      await elearningApi.enrollCourse({
        maKhoaHoc: course?.maKhoaHoc,
        taiKhoan: user?.taiKhoan,
      });
      alert("Đăng ký khóa học thành công! (Có thể ở trạng thái chờ duyệt)");
    } catch (e) {
      setError(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const onCancel = async () => {
    try {
      setActionLoading(true);
      setError("");
      await elearningApi.cancelEnroll({
        maKhoaHoc: course?.maKhoaHoc,
        taiKhoan: user?.taiKhoan,
      });
      alert("Hủy ghi danh thành công!");
    } catch (e) {
      setError(e.message);
    } finally {
      setActionLoading(false);
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

      {loading && <div className="muted">Đang tải...</div>}
      {error && (
        <div className="card" style={{ borderColor: "#fecaca", background: "#fff1f2" }}>
          <b>Lỗi:</b> {error}
        </div>
      )}

      {course && (
        <div className="card vstack">
          <div className="hstack" style={{ justifyContent: "space-between" }}>
            <div>
              <div className="badge">#{course.maKhoaHoc}</div>
              <div style={{ fontWeight: 900, fontSize: 22 }}>{course.tenKhoaHoc}</div>
              <div className="muted">Lượt xem: {course.luotXem ?? 0}</div>
            </div>

            {!isLoggedIn ? (
              <Link className="btn" to="/dang-nhap">
                Đăng nhập để đăng ký
              </Link>
            ) : (
              <div className="hstack">
                <button className="btn" disabled={actionLoading} onClick={onEnroll}>
                  Đăng ký khóa học
                </button>
                <button className="btn btn-outline" disabled={actionLoading} onClick={onCancel}>
                  Hủy ghi danh
                </button>
              </div>
            )}
          </div>

          <hr style={{ border: 0, borderTop: "1px solid #e5e7eb" }} />

          <div>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Mô tả</div>
            <div className="muted">{course.moTa || "Chưa có mô tả"}</div>
          </div>

          <div className="hstack" style={{ flexWrap: "wrap" }}>
            <span className="badge">Nhóm: {course.maNhom || "N/A"}</span>
            <span className="badge">Danh mục: {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "N/A"}</span>
            <span className="badge">Người tạo: {course.nguoiTao?.hoTen || "N/A"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
