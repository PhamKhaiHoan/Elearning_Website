import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { dichVuKhoaHoc } from "../../services/dichVuKhoaHoc";
import { layDanhMucKhoaHocThunk } from "../../redux/khoaHocSlice";
import { MA_NHOM } from "../../services/config";
import { X, Upload } from "lucide-react";

const schemaKhoaHoc = z.object({
  maKhoaHoc: z.string().min(1, "Mã khóa học không được để trống"),
  tenKhoaHoc: z.string().min(1, "Tên khóa học không được để trống"),
  moTa: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  maDanhMucKhoaHoc: z.string().min(1, "Vui lòng chọn danh mục"),
});

const layNgayHienTai = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const ModalKhoaHoc = ({ dangMo, dongModal, duLieuSua, taiLaiTrang }) => {
  const dispatch = useDispatch();
  const { danhMucKhoaHoc } = useSelector((state) => state.khoaHoc);
  const [hinhAnhPreview, setHinhAnhPreview] = useState("");
  const [fileHinhAnh, setFileHinhAnh] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schemaKhoaHoc),
    defaultValues: {
      maKhoaHoc: "",
      tenKhoaHoc: "",
      moTa: "",
      maDanhMucKhoaHoc: "",
    },
  });

  useEffect(() => {
    if (dangMo) {
      dispatch(layDanhMucKhoaHocThunk());
    }
  }, [dangMo, dispatch]);

  useEffect(() => {
    if (duLieuSua) {
      setValue("maKhoaHoc", duLieuSua.maKhoaHoc);
      setValue("tenKhoaHoc", duLieuSua.tenKhoaHoc);
      setValue("moTa", duLieuSua.moTa);
      setValue(
        "maDanhMucKhoaHoc",
        duLieuSua.danhMucKhoaHoc?.maDanhMucKhoahoc || ""
      );
      setHinhAnhPreview(duLieuSua.hinhAnh);
    } else {
      reset({ maKhoaHoc: "", tenKhoaHoc: "", moTa: "", maDanhMucKhoaHoc: "" });
      setHinhAnhPreview("");
      setFileHinhAnh(null);
    }
  }, [duLieuSua, setValue, reset, dangMo]);

  const xuLyChonHinh = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileHinhAnh(file);
      setHinhAnhPreview(URL.createObjectURL(file));
    }
  };

  const xuLyGuiForm = async (data) => {
    try {
      const formData = new FormData();
      formData.append("maKhoaHoc", data.maKhoaHoc);
      formData.append("tenKhoaHoc", data.tenKhoaHoc);
      formData.append("moTa", data.moTa);
      formData.append("maNhom", MA_NHOM);

      if (duLieuSua) {
        formData.append("ngayTao", duLieuSua.ngayTao || layNgayHienTai());
      } else {
        formData.append("ngayTao", layNgayHienTai());
      }

      formData.append("maDanhMucKhoaHoc", data.maDanhMucKhoaHoc);
      formData.append("taiKhoanNguoiTao", "admin_test");

      if (fileHinhAnh) {
        formData.append("file", fileHinhAnh);
      } else if (!duLieuSua) {
        alert("Vui lòng chọn hình ảnh cho khóa học mới!");
        return;
      }

      if (duLieuSua) {
        await dichVuKhoaHoc.capNhatKhoaHoc(formData);
        alert("Cập nhật khóa học thành công!");
      } else {
        await dichVuKhoaHoc.themKhoaHoc(formData);
        alert("Thêm khóa học thành công!");
      }

      dongModal();
      taiLaiTrang();
    } catch (error) {
      alert(error.response?.data || "Có lỗi xảy ra!");
    }
  };

  if (!dangMo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            {duLieuSua ? "Cập Nhật Khóa Học" : "Thêm Khóa Học Mới"}
          </h3>
          <button onClick={dongModal}>
            <X size={20} className="text-gray-500 hover:text-red-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(xuLyGuiForm)}
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã Khóa Học
              </label>
              <input
                {...register("maKhoaHoc")}
                disabled={!!duLieuSua}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  duLieuSua ? "bg-gray-100" : ""
                }`}
                placeholder="Nhập mã KH"
              />
              {errors.maKhoaHoc && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.maKhoaHoc.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Khóa Học
              </label>
              <input
                {...register("tenKhoaHoc")}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên KH"
              />
              {errors.tenKhoaHoc && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.tenKhoaHoc.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh Mục
              </label>
              <select
                {...register("maDanhMucKhoaHoc")}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">-- Chọn danh mục --</option>
                {danhMucKhoaHoc.map((dm) => (
                  <option key={dm.maDanhMuc} value={dm.maDanhMuc}>
                    {dm.tenDanhMuc}
                  </option>
                ))}
              </select>
              {errors.maDanhMucKhoaHoc && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.maDanhMucKhoaHoc.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô Tả
              </label>
              <textarea
                {...register("moTa")}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mô tả..."
              />
              {errors.moTa && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.moTa.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình Ảnh
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-50 bg-gray-50 relative">
              {hinhAnhPreview ? (
                <img
                  src={hinhAnhPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <Upload size={40} className="mx-auto mb-2" />
                  <span className="text-sm">Chưa có hình ảnh</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={xuLyChonHinh}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              Nhấn vào khung trên để chọn ảnh mới
            </p>
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t">
            <button
              type="button"
              onClick={dongModal}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isSubmitting
                ? "Đang xử lý..."
                : duLieuSua
                ? "Lưu Thay Đổi"
                : "Tạo Mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalKhoaHoc;
