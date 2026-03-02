import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const CreateAreaModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    parentId: "",
    name: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parentId = formData.parentId.trim();
    const name = formData.name.trim();
    if (!name) {
      setError("Vui lòng nhập tên khu vực.");
      return;
    }
    setError("");
    const newArea = {
      id: `temp-${Date.now()}`,
      name,
      parentId: parentId || null,
    };
    onSuccess?.(newArea);
    setFormData({ parentId: "", name: "" });
    onClose?.();
  };

  const handleClose = () => {
    setFormData({ parentId: "", name: "" });
    setError("");
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
          Thêm khu vực
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              ID khu vực
            </label>
            <input
              type="text"
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              placeholder="UUID khu vực cha (ví dụ: 11111111-1111-1111-1111-111111111111) hoặc để trống"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Tên khu vực <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên khu vực"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

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

export default CreateAreaModal;
