import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { removeAdminUserRole } from "../../../service/api";

/**
 * Modal xóa vai trò khỏi người dùng.
 * API: DELETE /admin/users/{userId}/roles/{roleCode}
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {string} userId - id người dùng
 * @param {string[]} roles - danh sách mã vai trò hiện tại (vd: ["ROLE_CITIZEN", "ROLE_COLLECTOR"])
 * @param {() => void} [onSuccess] - callback sau khi xóa thành công (vd. refetch user)
 */
const DeleteRoleModal = ({ isOpen, onClose, userId, roles = [], onSuccess }) => {
  const [roleCode, setRoleCode] = useState(roles[0] || "");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    const trimmedRole = (roleCode || "").trim();
    if (!trimmedRole) {
      toast.error("Vui lòng chọn vai trò cần xóa.");
      return;
    }

    setSubmitting(true);
    try {
      await removeAdminUserRole(userId, trimmedRole);
      onClose?.();
      toast.success("Đã xóa vai trò.");
      onSuccess?.();
    } catch (err) {
      toast.error(err?.message || "Thao tác thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute text-gray-500 transition-colors top-6 right-6 hover:text-gray-700"
          type="button"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Header */}
        <div className="px-5 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Xóa vai trò khỏi tài khoản
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="delete-role-select"
                className="block mb-1.5 text-sm font-medium text-gray-700"
              >
                Mã vai trò <span className="text-red-500">*</span>
              </label>
              {roles && roles.length > 0 ? (
                <select
                  id="delete-role-select"
                  value={roleCode}
                  onChange={(e) => setRoleCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">-- Chọn vai trò --</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="delete-role-input"
                  type="text"
                  value={roleCode}
                  onChange={(e) => setRoleCode(e.target.value)}
                  placeholder="Nhập mã vai trò (vd: ROLE_COLLECTOR)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-white transition-colors bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang xử lý..." : "Xóa vai trò"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteRoleModal;
