import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const CreateWasteCategoryModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gọi API tạo danh mục loại rác
    console.log("Create waste category:", formData);
    onClose?.();
    setFormData({ name: "", description: "" });
  };

  const handleClose = () => {
    setFormData({ name: "", description: "" });
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
              Tên loại rác
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên loại rác"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả loại rác"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="px-12 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWasteCategoryModal;
