import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { elearningApi } from "../api/elearningApi";

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return courses;
    return courses.filter((c) => (c.tenKhoaHoc || "").toLowerCase().includes(k));
  }, [courses, keyword]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        // có thể truyền MaNhom vào đây nếu server yêu cầu
        const res = await elearningApi.getCourses({ MaNhom: "GP01" });
        setCourses(res || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="container">
      <div className="hero">
        <h1>Học lập trình theo lộ trình</h1>
        <p>Danh sách khóa học</p>
      </div>

      <div className="card vstack" style={{ marginBottom: 16 }}>
        <div className="hstack" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Danh sách khóa học</div>
            <div className="muted">Tổng: {filtered.length}</div>
          </div>

          <input
            className="input"
            style={{ maxWidth: 320 }}
            placeholder="Nhập tên khóa học..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      {loading && <div className="muted">Đang tải dữ liệu...</div>}
      {error && (
        <div className="card" style={{ borderColor: "#fecaca", background: "#fff1f2" }}>
          <b>Lỗi:</b> {error}
        </div>
      )}

      <div className="grid grid-3">
        {filtered.map((c) => (
          <div className="card vstack" key={c.maKhoaHoc}>
            <div className="badge">#{c.maKhoaHoc}</div>
            <div style={{ fontWeight: 900, fontSize: 16, minHeight: 44 }}>
              {c.tenKhoaHoc}
            </div>
            <div className="muted" style={{ minHeight: 44 }}>
              {c.moTa ? c.moTa.slice(0, 90) + "..." : "Chưa có mô tả"}
            </div>
            <div className="hstack" style={{ justifyContent: "space-between" }}>
              <span className="muted">Lượt xem: {c.luotXem ?? 0}</span>
              <Link className="btn" to={`/khoa-hoc/${c.maKhoaHoc}`}>
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
