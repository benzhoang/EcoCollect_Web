import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { updateAdminUserStatus } from "../../../service/api";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "SUSPENDED", label: "Đình chỉ" },
];

/**
 * Modal nhập trạng thái và lý do, gọi API cập nhật và toast.
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {string} userId
 * @param {() => void} [onSuccess] - gọi sau khi cập nhật thành công (vd. refetch user)
 * @param {string} [initialStatus] - trạng thái ban đầu để hiển thị trong select
 */
const UpdateStatusModal = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
  initialStatus = "ACTIVE",
}) => {
  const [status, setStatus] = useState(initialStatus || "ACTIVE");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const trimmedStatus = status.trim();
    const trimmedReason = reason.trim();

    if (!trimmedStatus) {
      toast.error("Vui lòng chọn trạng thái.");
      return;
    }
    if (!trimmedReason) {
      toast.error("Vui lòng nhập lý do.");
      return;
    }

    setSubmitting(true);
    try {
      await updateAdminUserStatus(userId, {
        status: trimmedStatus,
        reason: trimmedReason,
      });
      onClose?.();
      toast.success("Đã cập nhật trạng thái.");
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
        <button
          onClick={onClose}
          className="absolute text-gray-500 transition-colors top-6 right-6 hover:text-gray-700"
          type="button"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="px-5 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Cập nhật trạng thái người dùng
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="update-status-select"
                className="block mb-1.5 text-sm font-medium text-gray-700"
              >
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                id="update-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="update-status-reason"
                className="block mb-1.5 text-sm font-medium text-gray-700"
              >
                Lý do <span className="text-red-500">*</span>
              </label>
              <textarea
                id="update-status-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Nhập lý do (bắt buộc)"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-required="true"
              />
            </div>
          </div>

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
              className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang xử lý..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
