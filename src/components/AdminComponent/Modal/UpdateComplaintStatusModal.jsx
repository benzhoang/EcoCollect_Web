import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { patchAdminComplaintProcessing } from "../../../service/api";

const STATUS_OPTIONS = [
  { value: "IN_REVIEW", label: "Đang xem xét" },
  { value: "RESOLVED", label: "Đã xử lý" },
  { value: "REJECTED", label: "Từ chối" },
];

const UpdateComplaintStatusModal = ({
  isOpen,
  onClose,
  complaintId,
  onSuccess, // () => void
  initialStatus = "",
  initialResolutionNote = "",
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [resolutionNote, setResolutionNote] = useState(initialResolutionNote);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatus(initialStatus || "");
      setResolutionNote(initialResolutionNote || "");
    }
  }, [isOpen, initialStatus, initialResolutionNote]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (submitting) return;
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!status || !complaintId) {
      toast.error("Thiếu thông tin khiếu nại hoặc trạng thái");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        status,
        resolutionNote: resolutionNote?.trim() || "",
      };
      await patchAdminComplaintProcessing(complaintId, payload);
      toast.success("Cập nhật trạng thái khiếu nại thành công");
      onSuccess?.();
      onClose?.();
    } catch {
      toast.error("Không thể cập nhật trạng thái khiếu nại. Vui lòng thử lại.");
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
        className="relative w-full max-w-xl mx-4 bg-white shadow-xl rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Cập nhật trạng thái khiếu nại
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
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Trạng thái xử lý <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={submitting}
                required
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Ghi chú xử lý
              </label>
              <textarea
                rows={5}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Mô tả cách bạn đã xử lý khiếu nại này, ví dụ: đã liên hệ với công dân, đã điều chỉnh điểm, lý do từ chối..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting || !status}
              className="px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang lưu..." : "Lưu trạng thái"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateComplaintStatusModal;
