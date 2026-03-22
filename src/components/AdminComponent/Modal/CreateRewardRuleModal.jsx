import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  getWasteCategories,
  upsertAdminRewardRuleByWasteCategory,
} from "../../../service/api";

const CreateRewardRuleModal = ({
  show,
  formData = {},
  onClose,
  onSuccess,
  onInputChange,
}) => {
  const [wasteTypes, setWasteTypes] = useState([]);
  const [loadingWasteTypes, setLoadingWasteTypes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!show) return;
    let cancelled = false;
    const loadWasteCategories = async () => {
      setLoadingWasteTypes(true);
      try {
        const response = await getWasteCategories();
        let categories = [];
        if (Array.isArray(response)) {
          categories = response;
        } else if (Array.isArray(response?.data)) {
          categories = response.data;
        } else if (Array.isArray(response?.content)) {
          categories = response.content;
        }
        const mapped = categories.map((cat) => ({
          value: cat?.id ?? cat?.value,
          label: cat?.name ?? cat?.label ?? "—",
        }));
        if (!cancelled) setWasteTypes(mapped);
      } catch (err) {
        console.error("Error loading waste categories:", err);
        if (!cancelled) setWasteTypes([]);
      } finally {
        if (!cancelled) setLoadingWasteTypes(false);
      }
    };
    loadWasteCategories();
    return () => {
      cancelled = true;
    };
  }, [show]);

  if (!show) return null;

  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      if (Number.isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return "";
    }
  };

  const handleDateTimeChange = (name, value) => {
    const syntheticEvent = {
      target: {
        name,
        value: value ? new Date(value).toISOString() : "",
      },
    };
    onInputChange?.(syntheticEvent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    const wasteCategoryId =
      formData.wasteCategoryId?.trim?.() || formData.wasteCategoryId;
    if (!wasteCategoryId) {
      toast.error("Vui lòng chọn loại rác thải.");
      return;
    }
    const body = {
      pointsPerKg: Number(formData.pointsPerKg) || 0,
      bonusQualityPoints: Number(formData.bonusQualityPoints) || 0,
      bonusFastCompletePoints: Number(formData.bonusFastCompletePoints) || 0,
      effectiveFrom: formData.effectiveFrom || new Date().toISOString(),
      effectiveTo: formData.effectiveTo || new Date().toISOString(),
      priority: Number(formData.priority) || 0,
    };
    setSubmitting(true);
    try {
      await upsertAdminRewardRuleByWasteCategory(wasteCategoryId, body);
      toast.success("Tạo quy tắc thưởng thành công.");
      onSuccess?.();
      onClose?.();
    } catch {
      toast.error("Tạo quy tắc thưởng thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-y-auto bg-white rounded-lg shadow-xl max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Tạo quy tắc thưởng mới
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 transition-colors rounded-lg hover:bg-gray-100"
          >
            <FaTimes className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {submitError && (
            <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
              {submitError}
            </div>
          )}
          <div className="space-y-6">
            {/* Loại rác thải */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Loại rác thải <span className="text-red-500">*</span>
              </label>
              <select
                name="wasteCategoryId"
                value={formData.wasteCategoryId ?? ""}
                onChange={onInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loadingWasteTypes}
                required
              >
                <option value="">
                  {loadingWasteTypes ? "Đang tải..." : "Chọn loại rác thải"}
                </option>
                {wasteTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Điểm số */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Điểm mỗi kg <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="pointsPerKg"
                  value={formData.pointsPerKg ?? ""}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Điểm thưởng chất lượng
                </label>
                <input
                  type="number"
                  name="bonusQualityPoints"
                  value={formData.bonusQualityPoints ?? ""}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Điểm hoàn thành nhanh
                </label>
                <input
                  type="number"
                  name="bonusFastCompletePoints"
                  value={formData.bonusFastCompletePoints ?? ""}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Thời gian hiệu lực */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Có hiệu lực từ <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="effectiveFrom"
                  value={
                    formData.effectiveFrom
                      ? formatDateTimeLocal(formData.effectiveFrom)
                      : ""
                  }
                  onChange={(e) =>
                    handleDateTimeChange("effectiveFrom", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Có hiệu lực đến <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="effectiveTo"
                  value={
                    formData.effectiveTo
                      ? formatDateTimeLocal(formData.effectiveTo)
                      : ""
                  }
                  onChange={(e) =>
                    handleDateTimeChange("effectiveTo", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Độ ưu tiên */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Độ ưu tiên
              </label>
              <input
                type="number"
                name="priority"
                value={formData.priority ?? ""}
                onChange={onInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                Số càng cao, độ ưu tiên càng lớn
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang tạo..." : "Tạo quy tắc"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRewardRuleModal;
