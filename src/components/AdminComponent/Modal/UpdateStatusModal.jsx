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

  const handleClose = () => {
    if (submitting) return;
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const trimmedStatus = status.trim();
    const trimmedReason = reason.trim();

    if (!trimmedStatus) {
      toast.error("Vui lòng chọn trạng thái");
      return;
    }
    if (!trimmedReason) {
      toast.error("Vui lòng nhập lý do");
      return;
    }

    setSubmitting(true);
    try {
      await updateAdminUserStatus(userId, {
        status: trimmedStatus,
        reason: trimmedReason,
      });
      onClose?.();
      toast.success("Cập nhật trạng thái thành công");
      onSuccess?.();
    } catch {
      toast.error("Không thể cập nhật trạng thái. Vui lòng thử lại.");
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
            Cập nhật trạng thái người dùng
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
                htmlFor="update-status-select"
                className="block mb-1.5 text-sm font-medium text-gray-700"
              >
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                id="update-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={submitting}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                disabled={submitting}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-required="true"
              />
            </div>
          </div>

          <div className="flex justify-end px-6 py-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="px-12 py-2.5 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
