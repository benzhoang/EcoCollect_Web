import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { updateWasteCategory } from "../../../service/api";

/**
 * Modal cập nhật danh mục loại rác. PUT /admin/waste-categories/{id}, body: { name }.
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {{ id: string, name?: string }} [category] - Danh mục đang sửa (id bắt buộc)
 * @param {(updated?: object) => void} [onSuccess] - Gọi sau khi cập nhật thành công
 */
const UpdateWasteCategoryModal = ({ isOpen, onClose, category, onSuccess }) => {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category?.id) {
      toast.error("Thiếu thông tin danh mục.");
      return;
    }
    const trimmedName = (name || "").trim();
    if (!trimmedName) {
      toast.error("Vui lòng nhập tên danh mục.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await updateWasteCategory(category.id, {
        name: trimmedName,
      });
      onClose?.();
      toast.success("Cập nhật danh mục loại rác thành công.");
      onSuccess?.(result ?? { id: category.id, name: trimmedName });
      setTimeout(() => window.location.reload(), 600);
    } catch {
      toast.error("Không thể cập nhật danh mục. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg p-8 mx-4 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute text-gray-500 transition-colors top-4 right-4 hover:text-gray-700"
          type="button"
        >
          <FaTimes className="text-2xl" />
        </button>
        <h2 className="mb-6 text-xl font-medium text-center text-gray-700">
          Cập nhật danh mục loại rác
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên danh mục"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-12 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang xử lý..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateWasteCategoryModal;
