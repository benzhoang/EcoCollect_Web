import React, { useEffect, useState } from "react";
import {
    getWasteCategories,
    upsertAdminWasteCapability,
} from "../../../service/api";

const WasteCapabilitiesModal = ({ isOpen, onClose, onSubmit }) => {
    const [wasteCategoryId, setWasteCategoryId] = useState("");
    const [dailyCapacityKg, setDailyCapacityKg] = useState("");
    const [wasteCategories, setWasteCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [categoryError, setCategoryError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        const fetchCategories = async () => {
            setLoadingCategories(true);
            setCategoryError("");
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
                setCategoryError(
                    err?.message || "Không thể tải danh sách loại rác thải.",
                );
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
        setSubmitError("");

        if (!wasteCategoryId) {
            setSubmitError("Vui lòng chọn loại rác thải.");
            return;
        }

        const capacityValue = Number(dailyCapacityKg);
        if (Number.isNaN(capacityValue) || capacityValue < 0) {
            setSubmitError("Công suất mỗi ngày không hợp lệ.");
            return;
        }

        try {
            setIsSubmitting(true);
            await upsertAdminWasteCapability(wasteCategoryId, {
                dailyCapacityKg: capacityValue,
                accepting: true,
            });
            if (onSubmit) {
                onSubmit({
                    wasteCategoryId,
                    dailyCapacityKg: capacityValue,
                });
            }
            setWasteCategoryId("");
            setDailyCapacityKg("");
            onClose();
        } catch (err) {
            setSubmitError(err?.message || "Không thể thêm công suất.");
        } finally {
            setIsSubmitting(false);
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
                <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Thêm công suất
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Nhập thông tin loại rác thải và công suất/ngày.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-5 space-y-4">
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
                                className="w-full mt-2 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                            {categoryError && (
                                <p className="mt-2 text-sm text-red-600">{categoryError}</p>
                            )}
                            {submitError && (
                                <p className="mt-2 text-sm text-red-600">{submitError}</p>
                            )}
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
                                className="w-full mt-2 px-3 py-2 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang lưu..." : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WasteCapabilitiesModal;
