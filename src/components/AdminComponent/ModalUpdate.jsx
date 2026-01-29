import React, { useState } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";

const ModalUpdate = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    role: "",
    phone: "",
    area: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý cập nhật tài khoản
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl p-8 mx-4 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute text-gray-500 transition-colors top-4 right-4 hover:text-gray-700"
          type="button"
        >
          <FaTimes className="text-2xl" />
        </button>
        <h2 className="mb-8 text-xl font-medium text-center text-gray-700">
          Cập nhật tài khoản
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {/* Cột trái */}
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Ngày sinh
                </label>
                <input
                  type="text"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Cột phải */}
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Vai trò
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Chọn vai trò</option>
                    <option value="collector">Nhân viên thu gom</option>
                    <option value="enterprise">Doanh nghiệp tái chế</option>
                  </select>
                  <FaChevronDown className="absolute text-sm text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Khu vực
                </label>
                <div className="relative">
                  <select
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Chọn khu vực</option>
                    <option value="hn">Hà Nội</option>
                    <option value="hcm">TP. Hồ Chí Minh</option>
                    <option value="dn">Đà Nẵng</option>
                  </select>
                  <FaChevronDown className="absolute text-sm text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-12 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUpdate;
