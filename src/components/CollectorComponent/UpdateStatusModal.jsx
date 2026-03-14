import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { updateCollectorAssignmentStatus } from "../../service/api";

const STATUS_OPTIONS = [
  { value: "ASSIGNED", label: "Đã giao" },
  { value: "ON_THE_WAY", label: "Đang trên đường" },
  { value: "COLLECTED", label: "Đã thu gom" },
];

const isValidLatitude = (value) => {
  const v = String(value ?? "").trim();
  if (!v) return false;
  const n = Number(v);
  return Number.isFinite(n) && n >= -90 && n <= 90;
};
const isValidLongitude = (value) => {
  const v = String(value ?? "").trim();
  if (!v) return false;
  const n = Number(v);
  return Number.isFinite(n) && n >= -180 && n <= 180;
};

/** Chuẩn hóa status từ API (COMPLETED -> COLLECTED) để khớp dropdown giống RequestDetailPage */
const normalizeStatus = (s) =>
  s === "COMPLETED" ? "COLLECTED" : s || "ASSIGNED";

/**
 * Modal cập nhật trạng thái assignment. Gọi API trong modal, toast và callbacks khi xong.
 * @param {boolean} show
 * @param {() => void} onClose
 * @param {string} [initialStatus]
 * @param {string} [statusId] - assignmentId hoặc reportId để gọi API
 * @param {() => void | Promise<void>} [onSuccess] - sau khi cập nhật thành công (vd. refetch)
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
  const [latitudeInput, setLatitudeInput] = useState("");
  const [longitudeInput, setLongitudeInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt không hỗ trợ lấy vị trí.", { duration: 4000 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords || {};
        if (typeof lat === "number") setLatitudeInput(String(lat));
        if (typeof lng === "number") setLongitudeInput(String(lng));
        toast.success("Đã lấy vị trí hiện tại!", { duration: 2000 });
      },
      (error) => {
        console.error("Lỗi lấy vị trí hiện tại:", error);
        toast.error("Không thể lấy vị trí. Vui lòng thử lại.", {
          duration: 4000,
        });
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!statusId) {
      toast.error("Thiếu thông tin phân công.");
      return;
    }
    const hasLat = latitudeInput.trim() !== "";
    const hasLng = longitudeInput.trim() !== "";
    if (hasLat && !isValidLatitude(latitudeInput)) {
      toast.error("Vui lòng nhập vĩ độ hợp lệ (-90 đến 90).", {
        duration: 4000,
      });
      return;
    }
    if (hasLng && !isValidLongitude(longitudeInput)) {
      toast.error("Vui lòng nhập kinh độ hợp lệ (-180 đến 180).", {
        duration: 4000,
      });
      return;
    }
    const lastKnownLatitude = hasLat ? Number(latitudeInput) : 0;
    const lastKnownLongitude = hasLng ? Number(longitudeInput) : 0;
    const payload = {
      status,
      note: note.trim() || "",
      lastKnownLatitude,
      lastKnownLongitude,
    };

    setSubmitting(true);
    try {
      await updateCollectorAssignmentStatus(statusId, payload);
      onClose?.();
      toast.success("Cập nhật trạng thái thành công.");
      await onSuccess?.();
      if (payload.status === "COLLECTED") {
        onCollected?.();
      }
      setNote("");
      setLatitudeInput("");
      setLongitudeInput("");
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

          {/* Tọa độ vị trí: 2 ô nhập + Lấy vị trí hiện tại bên dưới */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tọa độ vị trí
            </label>
            <div className="grid grid-cols-1 gap-3 mb-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Vĩ độ
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={latitudeInput}
                  onChange={(e) => setLatitudeInput(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  placeholder="Ví dụ: 10.8231"
                />
                <p className="text-xs text-gray-500">Giới hạn: -90 đến 90</p>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Kinh độ
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={longitudeInput}
                  onChange={(e) => setLongitudeInput(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  placeholder="Ví dụ: 106.6297"
                />
                <p className="text-xs text-gray-500">Giới hạn: -180 đến 180</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium text-blue-600 transition-colors bg-white border border-gray-200 rounded-lg hover:text-blue-700 hover:bg-blue-50"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Lấy toạ độ vị trí hiện tại</span>
            </button>
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
              {submitting ? "Đang xử lý..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
