// src/User/pages/AdminPage.jsx
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { courseApi } from "../api/elearningApi";

const DEFAULT_COURSE = {
  maKhoaHoc: "",
  biDanh: "",
  tenKhoaHoc: "",
  moTa: "",
  luotXem: 0,
  danhGia: 0,
  hinhAnh: "",
  maNhom: "GP01",
  ngayTao: "",
  maDanhMucKhoaHoc: "",
  taiKhoanNguoiTao: "",
};

const PAGE_SIZE = 10;

const AdminPage = () => {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editingCourse, setEditingCourse] = useState(DEFAULT_COURSE);
  const [isEditing, setIsEditing] = useState(false);

  const [students, setStudents] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [message, setMessage] = useState("");

  // Chặn user thường
  if (!user || user.maLoaiNguoiDung !== "GV") {
    return (
      <>
        <Header />
        <main className="app-container page">
          <h1 className="page__title">Trang quản trị</h1>
          <p>Bạn không có quyền truy cập trang này.</p>
        </main>
      </>
    );
  }

  // Lấy danh sách khóa học cho Admin
  useEffect(() => {
    const fetchCourses = async () => {
      const res = await courseApi.getCoursesPaging({
        tenKhoaHoc: keyword.trim(),
        page,
        pageSize: PAGE_SIZE,
        maNhom: "GP01",
      });

      const data = res.data;
      const items = Array.isArray(data)
        ? data
        : data.items || data.itemsDefault || [];
      setCourses(items);
      setTotalPages(data.totalPages || 1);
    };

    fetchCourses();
  }, [keyword, page]);

  const handleChangeSearch = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

  const handleEdit = (course) => {
    setIsEditing(true);
    setEditingCourse({
      ...DEFAULT_COURSE,
      ...course,
      taiKhoanNguoiTao: user.taiKhoan,
    });
    setMessage("");
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setEditingCourse({
      ...DEFAULT_COURSE,
      maNhom: "GP01",
      taiKhoanNguoiTao: user.taiKhoan,
    });
    setMessage("");
  };

  const handleChangeCourseField = (e) => {
    const { name, value } = e.target;
    setEditingCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await courseApi.updateCourse(editingCourse);
        setMessage("Cập nhật khóa học thành công.");
      } else {
        await courseApi.createCourse(editingCourse);
        setMessage("Thêm khóa học mới thành công.");
      }
      // reload list
      const res = await courseApi.getCoursesPaging({
        tenKhoaHoc: keyword.trim(),
        page,
        pageSize: PAGE_SIZE,
        maNhom: "GP01",
      });
      const data = res.data;
      const items = Array.isArray(data)
        ? data
        : data.items || data.itemsDefault || [];
      setCourses(items);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setMessage(err.response?.data || "Không thể lưu khóa học.");
    }
  };

  const handleDelete = async (maKhoaHoc) => {
    if (!window.confirm("Bạn có chắc muốn xóa khóa học này?")) return;

    try {
      await courseApi.deleteCourse(maKhoaHoc);
      setMessage("Xóa khóa học thành công.");

      // Reload
      const res = await courseApi.getCoursesPaging({
        tenKhoaHoc: keyword.trim(),
        page,
        pageSize: PAGE_SIZE,
        maNhom: "GP01",
      });
      const data = res.data;
      const items = Array.isArray(data)
        ? data
        : data.items || data.itemsDefault || [];
      setCourses(items);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setMessage(err.response?.data || "Không thể xóa khóa học.");
    }
  };

  const handleViewStudents = async (maKhoaHoc) => {
    try {
      const res = await courseApi.getCourseStudents(maKhoaHoc);
      const data = res.data;
      setStudents(data || []);
      setSelectedCourseId(maKhoaHoc);
    } catch (err) {
      setStudents([]);
      setSelectedCourseId(maKhoaHoc);
      setMessage(err.response?.data || "Không lấy được danh sách học viên.");
    }
  };

  const handlePrev = () => setPage((p) => (p > 1 ? p - 1 : p));
  const handleNext = () => setPage((p) => (p < totalPages ? p + 1 : p));

  return (
    <>
      <Header />
      <main className="app-container page">
        <h1 className="page__title">Quản trị khóa học</h1>

        {/* Tìm kiếm */}
        <section style={{ marginBottom: 16 }}>
          <input
            style={{ padding: 8, borderRadius: 8, border: "1px solid #d1d5db" }}
            placeholder="Tìm kiếm khóa học..."
            value={keyword}
            onChange={handleChangeSearch}
          />
        </section>

        {/* Bảng khóa học */}
        <section>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Danh sách khóa học</h2>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8 }}>
                    Mã
                  </th>
                  <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8 }}>
                    Tên khóa học
                  </th>
                  <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8 }}>
                    Danh mục
                  </th>
                  <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8 }}>
                    Lượt xem
                  </th>
                  <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8 }}>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.maKhoaHoc}>
                    <td
                      style={{
                        borderBottom: "1px solid #f3f4f6",
                        padding: 8,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.maKhoaHoc}
                    </td>
                    <td
                      style={{ borderBottom: "1px solid #f3f4f6", padding: 8 }}
                    >
                      {c.tenKhoaHoc}
                    </td>
                    <td
                      style={{ borderBottom: "1px solid #f3f4f6", padding: 8 }}
                    >
                      {c.danhMucKhoaHoc?.tenDanhMucKhoaHoc ||
                        c.maDanhMucKhoaHoc ||
                        "--"}
                    </td>
                    <td
                      style={{ borderBottom: "1px solid #f3f4f6", padding: 8 }}
                    >
                      {c.luotXem ?? 0}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #f3f4f6",
                        padding: 8,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <button
                        className="app-header__btn"
                        onClick={() => handleEdit(c)}
                      >
                        Sửa
                      </button>
                      <button
                        className="app-header__btn"
                        onClick={() => handleViewStudents(c.maKhoaHoc)}
                      >
                        Học viên
                      </button>
                      <button
                        className="app-header__btn"
                        onClick={() => handleDelete(c.maKhoaHoc)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}

                {courses.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: 8 }}>
                      Không có khóa học nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button
              className="app-header__btn"
              disabled={page <= 1}
              onClick={handlePrev}
            >
              Trang trước
            </button>
            <span style={{ fontSize: 13 }}>
              Trang {page} / {totalPages}
            </span>
            <button
              className="app-header__btn"
              disabled={page >= totalPages}
              onClick={handleNext}
            >
              Trang sau
            </button>
          </div>
        </section>

        {/* Form thêm / sửa khóa học */}
        <section style={{ marginTop: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <h2 style={{ fontSize: 18 }}>
              {isEditing ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
            </h2>
            <button className="app-header__btn" onClick={handleAddNew}>
              + Khóa học mới
            </button>
          </div>

          <form
            onSubmit={handleSubmitCourse}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
              fontSize: 13,
            }}
          >
            <label>
              Mã khóa học
              <input
                name="maKhoaHoc"
                value={editingCourse.maKhoaHoc}
                onChange={handleChangeCourseField}
                required
                disabled={isEditing} // không cho sửa mã khi edit
              />
            </label>

            <label>
              Bí danh
              <input
                name="biDanh"
                value={editingCourse.biDanh}
                onChange={handleChangeCourseField}
              />
            </label>

            <label>
              Tên khóa học
              <input
                name="tenKhoaHoc"
                value={editingCourse.tenKhoaHoc}
                onChange={handleChangeCourseField}
                required
              />
            </label>

            <label>
              Mã nhóm
              <input
                name="maNhom"
                value={editingCourse.maNhom}
                onChange={handleChangeCourseField}
                required
              />
            </label>

            <label>
              Mã danh mục khóa học
              <input
                name="maDanhMucKhoaHoc"
                value={editingCourse.maDanhMucKhoaHoc}
                onChange={handleChangeCourseField}
              />
            </label>

            <label>
              Hình ảnh (URL)
              <input
                name="hinhAnh"
                value={editingCourse.hinhAnh}
                onChange={handleChangeCourseField}
              />
            </label>

            <label>
              Ngày tạo
              <input
                name="ngayTao"
                value={editingCourse.ngayTao}
                onChange={handleChangeCourseField}
                placeholder="VD: 01/01/2019"
              />
            </label>

            <label>
              Lượt xem
              <input
                name="luotXem"
                type="number"
                value={editingCourse.luotXem}
                onChange={handleChangeCourseField}
              />
            </label>

            <label>
              Đánh giá
              <input
                name="danhGia"
                type="number"
                value={editingCourse.danhGia}
                onChange={handleChangeCourseField}
              />
            </label>

            <label style={{ gridColumn: "1 / -1" }}>
              Mô tả
              <textarea
                name="moTa"
                value={editingCourse.moTa}
                onChange={handleChangeCourseField}
                rows={3}
                style={{ width: "100%" }}
              />
            </label>

            <button
              type="submit"
              className="app-header__btn app-header__btn--primary"
              style={{ gridColumn: "1 / -1", width: "fit-content" }}
            >
              {isEditing ? "Lưu thay đổi" : "Thêm khóa học"}
            </button>
          </form>

          {message && (
            <p style={{ marginTop: 8, fontSize: 13, color: "#16a34a" }}>
              {String(message)}
            </p>
          )}
        </section>

        {/* Danh sách học viên của khóa đang chọn */}
        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18 }}>
            Học viên trong khóa{" "}
            {selectedCourseId ? `(${selectedCourseId})` : ""}
          </h2>
          {students.length === 0 && (
            <p style={{ fontSize: 13 }}>Chọn nút “Học viên” ở bảng trên để xem.</p>
          )}
          {students.length > 0 && (
            <ul style={{ fontSize: 13, paddingLeft: 16 }}>
              {students.map((s) => (
                <li key={s.taiKhoan}>
                  {s.hoTen} – {s.taiKhoan} – {s.email}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
};

export default AdminPage;
