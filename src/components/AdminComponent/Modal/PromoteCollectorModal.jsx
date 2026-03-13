import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { promoteAdminUserToCollector } from "../../../service/api";

/**
 * Modal nhập thông tin để chuyển người dùng thành người thu gom.
 * Gọi API promote-collector trong modal, toast và onSuccess khi thành công.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {string} userId - id người dùng cần promote
 * @param {Array<{ id: string, name: string }>} [areaOptions] - danh sách khu vực làm việc khả dụng
 * @param {() => void} [onSuccess] - gọi sau khi promote thành công (vd. refetch user)
 * @param {string} [initialAreaId] - khu vực hiện tại của user để set sẵn trong select
 */
const PromoteCollectorModal = ({
  isOpen,
  onClose,
  userId,
  areaOptions = [],
  onSuccess,
  initialAreaId = "",
}) => {
  const [areaId, setAreaId] = useState(initialAreaId || "");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    const trimmedAreaId = areaId.trim();
    if (!trimmedAreaId) {
      toast.error("Vui lòng chọn khu vực làm việc.");
      return;
    }

    setSubmitting(true);
    try {
      await promoteAdminUserToCollector(userId, { areaId: trimmedAreaId });
      onClose?.();
      toast.success("Đã chuyển thành người thu gom.");
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
            Chuyển thành người thu gom
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="promote-area-select"
                className="block mb-1.5 text-sm font-medium text-gray-700"
              >
                Khu vực làm việc <span className="text-red-500">*</span>
              </label>
              {areaOptions && areaOptions.length > 0 ? (
                <select
                  id="promote-area-select"
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">-- Chọn khu vực --</option>
                  {areaOptions.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="promote-area-input"
                  type="text"
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                  placeholder="Nhập ID khu vực làm việc"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              className="px-4 py-2 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromoteCollectorModal;
