import { Routes, Route, Navigate } from "react-router-dom";
import LayoutQuanTri from "./Admin/components/LayoutQuanTri.jsx";
import TrangNguoiDung from "./Admin/pages/QuanTri/TrangNguoiDung";
import TrangKhoaHoc from "./Admin/pages/QuanTri/TrangKhoaHoc";
import TrangTongQuan from "./Admin/pages/QuanTri/TrangTongQuan";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" />} />
      <Route path="/admin" element={<LayoutQuanTri />}>
        <Route index element={<TrangTongQuan />} />
        <Route path="users" element={<TrangNguoiDung />} />
        <Route path="courses" element={<TrangKhoaHoc />} />
      </Route>
    </Routes>
  );
}

export default App;
