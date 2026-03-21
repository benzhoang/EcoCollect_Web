import React, { useState, useEffect } from 'react';
import { getWasteCategories } from '../../service/api';

const ConfigPointModal = ({
    show,
    editingRule,
    formData,
    wasteTypes: propWasteTypes,
    onClose,
    onSubmit,
    onInputChange,
    onConditionChange
}) => {
    const [wasteTypes, setWasteTypes] = useState([]);
    const [loadingWasteTypes, setLoadingWasteTypes] = useState(false);

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

                const mapped = categories
                    .filter((cat) => cat?.active === true)
                    .map((cat) => ({
                        value: cat?.id || cat?.value,
                        label: cat?.name || cat?.label || 'Unknown',
                        color: 'bg-blue-100 text-blue-700',
                    }));

                if (!cancelled) {
                    setWasteTypes(mapped);
                }
            } catch (error) {
                console.error('Error loading waste categories:', error);
                if (!cancelled && Array.isArray(propWasteTypes) && propWasteTypes.length > 0) {
                    setWasteTypes(propWasteTypes);
                } else if (!cancelled) {
                    setWasteTypes([]);
                }
            } finally {
                if (!cancelled) {
                    setLoadingWasteTypes(false);
                }
            }
        };

        loadWasteCategories();

        return () => {
            cancelled = true;
        };
    }, [show, propWasteTypes]);

    useEffect(() => {
        if (Array.isArray(propWasteTypes) && propWasteTypes.length > 0 && wasteTypes.length === 0 && !loadingWasteTypes) {
            setWasteTypes(propWasteTypes);
        }
    }, [propWasteTypes, wasteTypes.length, loadingWasteTypes]);

    if (!show) return null;

    const formatDateTimeLocal = (isoString) => {
        if (!isoString) return '';
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return '';
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch {
            return '';
        }
    };

    const handleDateTimeChange = (name, value) => {
        const syntheticEvent = {
            target: {
                name,
                value: value ? new Date(value).toISOString() : ''
            }
        };
        onInputChange(syntheticEvent);
    };

    return (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {editingRule ? 'Chỉnh sửa quy tắc' : 'Tạo quy tắc mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={onSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Loại rác thải */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại rác thải <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="wasteCategoryId"
                                value={formData.wasteCategoryId || ''}
                                onChange={onInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={loadingWasteTypes}
                                required
                            >
                                <option value="">
                                    {loadingWasteTypes ? 'Đang tải...' : 'Chọn loại rác thải'}
                                </option>
                                {wasteTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Điểm số */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Điểm mỗi kg <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="pointsPerKg"
                                    value={formData.pointsPerKg || ''}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Điểm thưởng chất lượng
                                </label>
                                <input
                                    type="number"
                                    name="bonusQualityPoints"
                                    value={formData.bonusQualityPoints || ''}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Điểm hoàn thành nhanh
                                </label>
                                <input
                                    type="number"
                                    name="bonusFastCompletePoints"
                                    value={formData.bonusFastCompletePoints || ''}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        {/* Thời gian hiệu lực */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Có hiệu lực từ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="effectiveFrom"
                                    value={formData.effectiveFrom ? formatDateTimeLocal(formData.effectiveFrom) : ''}
                                    onChange={(e) => handleDateTimeChange('effectiveFrom', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Có hiệu lực đến <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="effectiveTo"
                                    value={formData.effectiveTo ? formatDateTimeLocal(formData.effectiveTo) : ''}
                                    onChange={(e) => handleDateTimeChange('effectiveTo', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Độ ưu tiên */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Độ ưu tiên
                            </label>
                            <input
                                type="number"
                                name="priority"
                                value={formData.priority || ''}
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
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            {editingRule ? 'Cập nhật' : 'Tạo quy tắc'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConfigPointModal;