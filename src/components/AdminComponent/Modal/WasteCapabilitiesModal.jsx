import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  getWasteCategories,
  upsertAdminWasteCapability,
} from "../../../service/api";

const WasteCapabilitiesModal = ({ isOpen, onClose, onSubmit }) => {
  const [wasteCategoryId, setWasteCategoryId] = useState("");
  const [dailyCapacityKg, setDailyCapacityKg] = useState("");
  const [wasteCategories, setWasteCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await getWasteCategories();
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.content)
              ? response.data.content
              : [];
        setWasteCategories(list);
      } catch (err) {
        toast.error(err?.message || "Không thể tải danh sách loại rác thải.");
        setWasteCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!wasteCategoryId) {
      toast.error("Vui lòng chọn loại rác thải");
      return;
    }

    const capacityValue = Number(dailyCapacityKg);
    if (Number.isNaN(capacityValue) || capacityValue < 0) {
      toast.error("Công suất mỗi ngày không hợp lệ");
      return;
    }

    try {
      setIsSubmitting(true);
      await upsertAdminWasteCapability(wasteCategoryId, {
        dailyCapacityKg: capacityValue,
        accepting: true,
      });
      toast.success("Thêm công suất thành công");
      if (onSubmit) {
        onSubmit({
          wasteCategoryId,
          dailyCapacityKg: capacityValue,
        });
      }
      setWasteCategoryId("");
      setDailyCapacityKg("");
      onClose();
    } catch {
      toast.error("Không thể thêm công suất. Vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose?.();
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
          <h2 className="text-lg font-bold text-gray-900">Thêm công suất</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            <span className="sr-only">Đóng</span>
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label
                htmlFor="wasteType"
                className="block text-sm font-medium text-gray-700"
              >
                Loại rác thải
              </label>
              <select
                id="wasteType"
                value={wasteCategoryId}
                onChange={(e) => setWasteCategoryId(e.target.value)}
                className="w-full px-3 py-2 mt-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loadingCategories || isSubmitting}
                required
              >
                <option value="">
                  {loadingCategories
                    ? "Đang tải loại rác thải..."
                    : "Chọn loại rác thải"}
                </option>
                {wasteCategories.map((category) => (
                  <option
                    key={category.id ?? category.code ?? category.name}
                    value={category.id ?? category.wasteCategoryId ?? ""}
                  >
                    {category.name ??
                      category.wasteCategoryName ??
                      category.wasteType ??
                      ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="dailyCapacityKg"
                className="block text-sm font-medium text-gray-700"
              >
                Công suất mỗi ngày (kg)
              </label>
              <input
                id="dailyCapacityKg"
                type="number"
                min="0"
                step="1"
                placeholder="Ví dụ: 1200"
                value={dailyCapacityKg}
                onChange={(e) => setDailyCapacityKg(e.target.value)}
                className="w-full px-3 py-2 mt-2 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex justify-end px-6 py-4 border-t border-gray-200">
            <button
              type="submit"
              className="px-12 py-2.5 text-white font-medium transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang thêm..." : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WasteCapabilitiesModal;
