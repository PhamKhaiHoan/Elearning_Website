import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ModalXacNhan = ({ dangMo, dongModal, xacNhan, tieuDe, noiDung }) => {
  if (!dangMo) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-transform border border-red-100">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-red-50">
          <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle size={24} /> {tieuDe || "Xác nhận hành động"}
          </h3>
          <button
            onClick={dongModal}
            className="p-1 hover:bg-red-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 text-base">{noiDung}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={dongModal}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => {
              xacNhan();
              dongModal();
            }}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium shadow-sm transition-colors"
          >
            Đồng ý xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalXacNhan;
