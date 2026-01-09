import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./User/context/AuthContext";
import Header from "./User/components/Header";
import CourseListPage from "./User/pages/CourseListPage";
import CourseDetailPage from "./User/pages/CourseDetailPage";
import LoginPage from "./User/pages/LoginPage";
import RegisterPage from "./User/pages/RegisterPage";
import ProfilePage from "./User/pages/ProfilePage";

import LayoutQuanTri from "./Admin/components/LayoutQuanTri.jsx";
import TrangNguoiDung from "./Admin/pages/QuanTri/TrangNguoiDung";
import TrangKhoaHoc from "./Admin/pages/QuanTri/TrangKhoaHoc";
import TrangTongQuan from "./Admin/pages/QuanTri/TrangTongQuan";

const PrivateRoute = ({ children }) => {
  const { daDangNhap } = useAuth();
  if (!daDangNhap) {
    return <Navigate to="/dang-nhap" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { daDangNhap, nguoiDung } = useAuth();
  if (!daDangNhap) {
    return <Navigate to="/dang-nhap" replace />;
  }
  if (nguoiDung?.maLoaiNguoiDung !== "GV") {
    return <Navigate to="/" replace />;
  }
  return children;
};

const UserLayout = () => {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<CourseListPage />} />
          <Route path="/khoa-hoc/:maKhoaHoc" element={<CourseDetailPage />} />
          <Route path="/dang-nhap" element={<LoginPage />} />
          <Route path="/dang-ky" element={<RegisterPage />} />
          <Route
            path="/ho-so"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />

        <Routes>
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <LayoutQuanTri />
              </AdminRoute>
            }
          >
            <Route index element={<TrangTongQuan />} />
            <Route path="users" element={<TrangNguoiDung />} />
            <Route path="courses" element={<TrangKhoaHoc />} />
          </Route>

          <Route path="/*" element={<UserLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
