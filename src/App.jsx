import { Routes, Route, Navigate } from "react-router-dom";
import LayoutQuanTri from "./Admin/components/LayoutQuanTri.jsx";
import TrangNguoiDung from "./Admin/pages/QuanTri/TrangNguoiDung";
import TrangKhoaHoc from "./Admin/pages/QuanTri/TrangKhoaHoc";
import TrangTongQuan from "./Admin/pages/QuanTri/TrangTongQuan";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/admin" element={<LayoutQuanTri />}>
          <Route index element={<TrangTongQuan />} />
          <Route path="users" element={<TrangNguoiDung />} />
          <Route path="courses" element={<TrangKhoaHoc />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
