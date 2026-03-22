import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { updateCollectorAssignmentStatus } from "../../service/api";

const COLLECTOR_REQUEST_LIST_PATH = "/collector/request-list";

const STATUS_OPTIONS = [
  { value: "ASSIGNED", label: "Đã giao" },
  { value: "ON_THE_WAY", label: "Đang trên đường" },
  { value: "COLLECTED", label: "Đã thu gom" },
];

/** Chuẩn hóa status từ API (COMPLETED -> COLLECTED) để khớp dropdown giống RequestDetailPage */
const normalizeStatus = (s) =>
  s === "COMPLETED" ? "COLLECTED" : s || "ASSIGNED";

/**
 * Modal cập nhật trạng thái assignment. Gọi API trong modal, toast và callbacks khi xong.
 * @param {boolean} show
 * @param {() => void} onClose
 * @param {string} [initialStatus]
 * @param {string} [statusId] - assignmentId hoặc reportId để gọi API
 * @param {() => void | Promise<void>} [onSuccess] - sau khi cập nhật thành công (vd. refetch), không gọi nếu chuyển ASSIGNED → ON_THE_WAY (khi đó điều hướng về danh sách)
 * @param {() => void} [onCollected] - gọi khi chọn trạng thái COLLECTED thành công (vd. mở UploadProofModal)
 */
const UpdateStatusModal = ({
  show,
  onClose,
  initialStatus = "ASSIGNED",
  statusId,
  onSuccess,
  onCollected,
}) => {
  const [status, setStatus] = useState(() => normalizeStatus(initialStatus));
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!statusId) {
      toast.error("Thiếu thông tin phân công.");
      return;
    }
    const payload = {
      status,
      note: note.trim() || "",
    };

    setSubmitting(true);
    try {
      console.log("[UpdateStatusModal] submit payload:", payload);
      await updateCollectorAssignmentStatus(statusId, payload);
      const fromNormalized = normalizeStatus(initialStatus);
      const navigateToList =
        fromNormalized === "ASSIGNED" && payload.status === "ON_THE_WAY";

      onClose?.();
      toast.success("Cập nhật trạng thái thành công");

      if (navigateToList) {
        window.history.pushState({}, "", COLLECTOR_REQUEST_LIST_PATH);
        window.dispatchEvent(new PopStateEvent("popstate"));
      } else {
        await onSuccess?.();
        if (payload.status === "COLLECTED") {
          onCollected?.();
        }
      }
      setNote("");
    } catch {
      toast.error("Không thể cập nhật trạng thái.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Cập nhật trạng thái
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 transition-colors rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5 text-gray-600"
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Status - Select */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Trạng thái <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Ghi chú{" "}
              <span className="font-normal text-gray-500">(tùy chọn)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none bg-white"
              placeholder="Nhập ghi chú..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
