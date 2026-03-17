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
      toast.error("Thiếu thông tin khiếu nại hoặc trạng thái.");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        status,
        resolutionNote: resolutionNote?.trim() || "",
      };
      await patchAdminComplaintProcessing(complaintId, payload);
      toast.success("Cập nhật trạng thái khiếu nại thành công.");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      const message =
        err?.message ??
        "Không thể cập nhật trạng thái khiếu nại. Vui lòng thử lại.";
      toast.error(message);
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
        className="relative w-full max-w-xl p-6 mx-4 bg-white rounded-lg shadow-xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={submitting}
          className="absolute text-gray-500 transition-colors top-4 right-4 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaTimes className="text-xl" />
        </button>

        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Cập nhật trạng thái khiếu nại
        </h2>
        <p className="mb-6 text-sm text-gray-600">
          Chọn trạng thái mới cho khiếu nại và ghi chú lại cách xử lý để tiện
          theo dõi sau này.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <p className="mt-1 text-xs text-gray-500">
              Thông tin này sẽ giúp các quản trị viên khác hiểu bối cảnh xử lý
              khiếu nại.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting || !status}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
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
