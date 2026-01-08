import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const isLoggedIn = !!localStorage.getItem("accessToken");

  const login = (payload) => {
    // payload: { accessToken, taiKhoan, hoTen, email, soDT, maLoaiNguoiDung, ... }
    localStorage.setItem("accessToken", payload.accessToken);
    localStorage.setItem("user", JSON.stringify(payload));
    setUser(payload);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, isLoggedIn, login, logout }), [user, isLoggedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
