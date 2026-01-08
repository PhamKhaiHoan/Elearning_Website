// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./User/context/AuthContext";
import Header from "./User/components/Header";
import CourseListPage from "./User/pages/CourseListPage";
import CourseDetailPage from "./User/pages/CourseDetailPage";
import LoginPage from "./User/pages/LoginPage";
import RegisterPage from "./User/pages/RegisterPage";
import ProfilePage from "./User/pages/ProfilePage";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/dang-nhap" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
              {/* có thể thêm route /admin sau này */}
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
