import React, { useState } from "react";
import { toast } from "react-hot-toast";

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

const UpdateStatusModal = ({
  show,
  onClose,
  onSubmit,
  initialStatus = "ASSIGNED",
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [note, setNote] = useState("");
  const [latitudeInput, setLatitudeInput] = useState("");
  const [longitudeInput, setLongitudeInput] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
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
    onSubmit({
      status,
      note: note.trim() || "",
      lastKnownLatitude,
      lastKnownLongitude,
    });
    setNote("");
    setLatitudeInput("");
    setLongitudeInput("");
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Cập nhật trạng thái
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú{" "}
              <span className="text-gray-500 font-normal">(tùy chọn)</span>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tọa độ vị trí
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
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
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 bg-white w-full justify-center"
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
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
