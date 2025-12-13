import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { dichVuNguoiDung } from "../../services/dichVuNguoiDung";
import { MA_NHOM } from "../../services/config";
import { X } from "lucide-react";

// 👇 1. Thêm hàm lấy ngày
const layNgayHienTai = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`; // Định dạng dd/MM/yyyy
};

const schemaNguoiDung = z.object({
  taiKhoan: z.string().min(1, "Tài khoản không được để trống"),
  matKhau: z
    .string()
    .min(6, "Mật khẩu phải ít nhất 6 ký tự")
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Mật khẩu phải có chữ và số"),
  hoTen: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  soDt: z
    .string()
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số")
    .min(9, "Số điện thoại quá ngắn"),
  maLoaiNguoiDung: z.enum(["HV", "GV"]),
});

const ModalNguoiDung = ({ dangMo, dongModal, duLieuSua, taiLaiTrang }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schemaNguoiDung),
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
      hoTen: "",
      email: "",
      soDt: "",
      maLoaiNguoiDung: "HV",
    },
  });

  useEffect(() => {
    if (duLieuSua) {
      setValue("taiKhoan", duLieuSua.taiKhoan);
      setValue("hoTen", duLieuSua.hoTen);
      setValue("email", duLieuSua.email);
      setValue("soDt", duLieuSua.soDt);
      setValue("maLoaiNguoiDung", duLieuSua.maLoaiNguoiDung);
      setValue("matKhau", "");
    } else {
      reset({
        taiKhoan: "",
        matKhau: "",
        hoTen: "",
        email: "",
        soDt: "",
        maLoaiNguoiDung: "HV",
      });
    }
  }, [duLieuSua, setValue, reset, dangMo]);

  const xuLyGuiForm = async (data) => {
    try {
      // 👇 2. Thêm ngayTao vào dữ liệu gửi đi
      const duLieuGuiDi = {
        ...data,
        maNhom: MA_NHOM,
        ngayTao: duLieuSua ? duLieuSua.ngayTao : layNgayHienTai(), // Nếu sửa thì giữ cũ, thêm thì lấy mới
      };

      if (duLieuSua) {
        await dichVuNguoiDung.capNhatNguoiDung(duLieuGuiDi);
        alert("Cập nhật thành công!");
      } else {
        await dichVuNguoiDung.themNguoiDung(duLieuGuiDi);
        alert("Thêm mới thành công!");
      }

      dongModal();
      taiLaiTrang();
    } catch (error) {
      alert(error.response?.data || "Đã có lỗi xảy ra!");
    }
  };

  if (!dangMo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">
            {duLieuSua ? "Cập Nhật Người Dùng" : "Thêm Người Dùng Mới"}
          </h3>
          <button
            onClick={dongModal}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(xuLyGuiForm)} className="p-6 space-y-4">
          {/* ... (Giữ nguyên các Input Tài khoản, Mật khẩu, Họ tên, Email, Số ĐT, Loại ND) ... */}

          {/* (Phần code Form Input ông giữ y nguyên như file cũ nhé, chỉ thay đổi logic xuLyGuiForm ở trên thôi) */}
          {/* Để gọn code tôi không paste lại toàn bộ JSX form input, ông dùng lại phần return của file cũ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tài Khoản
            </label>
            <input
              {...register("taiKhoan")}
              disabled={!!duLieuSua}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                duLieuSua ? "bg-gray-100 text-gray-500" : ""
              }`}
              placeholder="Nhập tài khoản"
            />
            {errors.taiKhoan && (
              <p className="text-red-500 text-xs mt-1">
                {errors.taiKhoan.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {duLieuSua ? "Mật Khẩu Mới (Để trống nếu không đổi)" : "Mật Khẩu"}
            </label>
            <input
              type="password"
              {...register("matKhau")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu"
            />
            {errors.matKhau && (
              <p className="text-red-500 text-xs mt-1">
                {errors.matKhau.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ Tên
            </label>
            <input
              {...register("hoTen")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập họ tên"
            />
            {errors.hoTen && (
              <p className="text-red-500 text-xs mt-1">
                {errors.hoTen.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register("email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số Điện Thoại
              </label>
              <input
                {...register("soDt")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="090..."
              />
              {errors.soDt && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.soDt.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại Người Dùng
            </label>
            <select
              {...register("maLoaiNguoiDung")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="HV">Học Viên</option>
              <option value="GV">Giáo Vụ</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={dongModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? "Đang xử lý..."
                : duLieuSua
                ? "Cập Nhật"
                : "Thêm Mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNguoiDung;
