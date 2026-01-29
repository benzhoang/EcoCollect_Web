import React from 'react';

const ConfigPointModal = ({
    show,
    editingRule,
    formData,
    wasteTypes,
    onClose,
    onSubmit,
    onInputChange,
    onConditionChange
}) => {
    if (!show) return null;

    const renderConditionFields = () => {
        switch (formData.type) {
            case 'waste_type':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại rác thải
                            </label>
                            <select
                                value={formData.conditions.wasteType || ''}
                                onChange={(e) => onConditionChange('wasteType', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Chọn loại rác</option>
                                {wasteTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Khối lượng tối thiểu (kg)
                            </label>
                            <input
                                type="number"
                                value={formData.conditions.minWeight || ''}
                                onChange={(e) => onConditionChange('minWeight', parseInt(e.target.value, 10))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Nhập khối lượng tối thiểu"
                                min="0"
                            />
                        </div>
                    </div>
                );
            case 'report_quality':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Điểm chất lượng tối thiểu (0-10)
                            </label>
                            <input
                                type="number"
                                value={formData.conditions.qualityScore || ''}
                                onChange={(e) => onConditionChange('qualityScore', parseInt(e.target.value, 10))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Nhập điểm chất lượng"
                                min="0"
                                max="10"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="hasImages"
                                checked={formData.conditions.hasImages || false}
                                onChange={(e) => onConditionChange('hasImages', e.target.checked)}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label htmlFor="hasImages" className="ml-2 text-sm text-gray-700">
                                Yêu cầu có hình ảnh
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="hasDescription"
                                checked={formData.conditions.hasDescription || false}
                                onChange={(e) => onConditionChange('hasDescription', e.target.checked)}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label htmlFor="hasDescription" className="ml-2 text-sm text-gray-700">
                                Yêu cầu có mô tả chi tiết
                            </label>
                        </div>
                    </div>
                );
            case 'processing_time':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thời gian xử lý tối đa (giờ)
                            </label>
                            <input
                                type="number"
                                value={formData.conditions.maxHours || ''}
                                onChange={(e) => onConditionChange('maxHours', parseInt(e.target.value, 10))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Nhập số giờ tối đa"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thời gian xử lý tối thiểu (giờ) - Tùy chọn
                            </label>
                            <input
                                type="number"
                                value={formData.conditions.minHours || ''}
                                onChange={(e) => onConditionChange('minHours', parseInt(e.target.value, 10))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Nhập số giờ tối thiểu (không bắt buộc)"
                                min="1"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên quy tắc <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Nhập tên quy tắc"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Loại quy tắc <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="waste_type">Loại rác thải</option>
                                    <option value="report_quality">Chất lượng báo cáo</option>
                                    <option value="processing_time">Thời gian xử lý</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Điểm thưởng <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="points"
                                    value={formData.points}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Nhập số điểm"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={onInputChange}
                                    className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-700">
                                    Kích hoạt quy tắc ngay sau khi tạo
                                </label>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Điều kiện áp dụng <span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-xs text-gray-500">Phụ thuộc vào loại quy tắc</span>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    {renderConditionFields()}
                                </div>
                            </div>
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

