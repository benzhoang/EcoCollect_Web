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
const DeleteRoleModal = ({
  isOpen,
  onClose,
  userId,
  roles = [],
  onSuccess,
}) => {
  const [roleCode, setRoleCode] = useState(roles[0] || "");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (submitting) return;
    onClose?.();
  };

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
      toast.success("Xóa vai trò thành công");
      onSuccess?.();
    } catch {
      toast.error("Không thể xóa vai trò. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md mx-4 bg-white shadow-xl rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Xóa vai trò khỏi tài khoản
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50"
          >
            <span className="sr-only">Đóng</span>
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
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
                  disabled={submitting}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  disabled={submitting}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end px-6 py-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="px-12 py-2.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang xóa..." : "Xóa vai trò"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteRoleModal;
