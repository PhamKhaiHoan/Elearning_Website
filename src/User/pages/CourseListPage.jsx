import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import { elearningApi } from "../api/elearningApi";
import { MA_NHOM } from "../../Admin/services/config";

export default function CourseListPage() {
  const [searchParams] = useSearchParams();
  const [dsKhoaHoc, setDsKhoaHoc] = useState([]);
  const [tuKhoa, setTuKhoa] = useState(searchParams.get("q") || "");
  const [dangTai, setDangTai] = useState(false);

  const dsLoc = useMemo(() => {
    const k = tuKhoa.trim().toLowerCase();
    if (!k) return dsKhoaHoc;
    return dsKhoaHoc.filter((c) =>
      (c.tenKhoaHoc || "").toLowerCase().includes(k)
    );
  }, [dsKhoaHoc, tuKhoa]);

  useEffect(() => {
    const taiDuLieu = async () => {
      try {
        setDangTai(true);
        const res = await elearningApi.layDanhSachKhoaHoc({ MaNhom: MA_NHOM });
        setDsKhoaHoc(res || []);
      } catch (e) {
        toast.error(e.message || "Không thể tải danh sách khóa học!");
      } finally {
        setDangTai(false);
      }
    };
    taiDuLieu();
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setTuKhoa(q);
  }, [searchParams]);

  return (
    <div className="container">
      <div className="hero">
        <h1>Học lập trình theo lộ trình</h1>
        <p>Khám phá các khóa học chất lượng cao</p>
      </div>

      <div className="card vstack" style={{ marginBottom: 16 }}>
        <div
          className="hstack"
          style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>
              Danh sách khóa học
            </div>
            <div className="muted">Tổng: {dsLoc.length} khóa học</div>
          </div>

          <div style={{ position: "relative", width: "100%", maxWidth: 320 }}>
            <input
              className="input"
              style={{ paddingLeft: 40, width: "100%" }}
              placeholder="Tìm kiếm khóa học..."
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
            />
            <Search
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
              size={18}
            />
          </div>
        </div>
      </div>

      {dangTai && <div className="muted">Đang tải dữ liệu...</div>}

      <div className="grid grid-3">
        {dsLoc.map((kh) => (
          <div className="card vstack" key={kh.maKhoaHoc}>
            <img
              src={kh.hinhAnh}
              alt={kh.tenKhoaHoc}
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: 12,
                marginBottom: 12,
                backgroundColor: "#f3f4f6",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://picsum.photos/seed/${kh.maKhoaHoc}/400/200`;
              }}
            />
            <div className="badge">#{kh.maKhoaHoc}</div>
            <div style={{ fontWeight: 900, fontSize: 16, minHeight: 44 }}>
              {kh.tenKhoaHoc}
            </div>
            <div className="muted" style={{ minHeight: 44 }}>
              {kh.moTa ? kh.moTa.slice(0, 90) + "..." : "Chưa có mô tả"}
            </div>
            <div className="hstack" style={{ justifyContent: "space-between" }}>
              <span className="muted">Lượt xem: {kh.luotXem ?? 0}</span>
              <Link className="btn" to={`/khoa-hoc/${kh.maKhoaHoc}`}>
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
