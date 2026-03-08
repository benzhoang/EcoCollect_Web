import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { createWasteCategory } from "../../../service/api";

const CreateWasteCategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedCode = formData.code?.trim();
    const trimmedName = formData.name?.trim();
    if (!trimmedCode || !trimmedName) {
      toast.error("Vui lòng nhập đầy đủ mã và tên loại rác.", {
        duration: 3000,
      });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createWasteCategory({ code: trimmedCode, name: trimmedName });
      toast.success("Tạo danh mục loại rác thành công!", { duration: 2500 });
      onSuccess?.();
      handleClose();
    } catch (err) {
      const message =
        err?.message || "Không thể tạo danh mục loại rác. Vui lòng thử lại.";
      toast.error(message, { duration: 3500 });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ code: "", name: "" });
    setError(null);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg p-8 mx-4 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute text-gray-500 transition-colors top-4 right-4 hover:text-gray-700"
          type="button"
        >
          <FaTimes className="text-2xl" />
        </button>
        <h2 className="mb-6 text-xl font-medium text-center text-gray-700">
          Thêm danh mục loại rác
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Mã loại rác (in hoa)
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Nhập mã loại rác"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Tên loại rác
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên loại rác"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
            >
              {loading ? "Đang xử lý..." : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWasteCategoryModal;
