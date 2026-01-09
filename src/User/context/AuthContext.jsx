import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [nguoiDung, setNguoiDung] = useState(() => {
    const raw = localStorage.getItem("nguoiDung");
    return raw ? JSON.parse(raw) : null;
  });

  const daDangNhap = !!nguoiDung;

  const dangNhap = (payload) => {
    localStorage.setItem("accessToken", payload.accessToken);
    localStorage.setItem("nguoiDung", JSON.stringify(payload));
    setNguoiDung(payload);
  };

  const dangXuat = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("nguoiDung");
    setNguoiDung(null);
  };

  const value = useMemo(
    () => ({ nguoiDung, daDangNhap, dangNhap, dangXuat }),
    [nguoiDung, daDangNhap]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
