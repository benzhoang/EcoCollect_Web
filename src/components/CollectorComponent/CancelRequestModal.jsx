import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { cancelCollectorAssignment } from "../../service/api";

const COLLECTOR_REQUEST_LIST_PATH = "/collector/request-list";

/**
 * Modal hủy phân công (collector) — UI giống CancelModal.jsx
 *
 * Props:
 * - show: boolean
 * - onClose: () => void
 * - assignmentId: string | null | undefined — UUID phân công (URL hoặc từ chi tiết)
 */
const CancelRequestModal = ({ show, onClose, assignmentId }) => {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setReason("");
      }, 0);
    }
  }, [show]);

  if (!show) return null;

  const handleConfirm = async () => {
    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      toast.error("Vui lòng nhập lý do hủy yêu cầu.");
      return;
    }

    const id = assignmentId;
    if (!id) {
      toast.error(
        "Không tìm thấy yêu cầu. Vui lòng quay lại danh sách và mở lại.",
      );
      return;
    }

    setSubmitting(true);
    try {
      console.log("[CancelRequestModal] submit payload:", {
        id,
        reason: trimmedReason,
      });
      await cancelCollectorAssignment(id, { reason: trimmedReason });
      toast.success("Hủy yêu cầu thành công");
      onClose();
      window.history.pushState({}, "", COLLECTOR_REQUEST_LIST_PATH);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch {
      toast.error("Không thể hủy yêu cầu. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md mx-4 bg-white shadow-xl rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Hủy yêu cầu</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50"
          >
            <span className="sr-only">Đóng</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-3">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="cancel-request-reason"
          >
            Lý do hủy yêu cầu:
          </label>
          <textarea
            id="cancel-request-reason"
            className="w-full min-h-[110px] px-3 py-2 text-sm border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Nhập lý do hủy..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {submitting ? "Đang hủy..." : "Xác nhận hủy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelRequestModal;
