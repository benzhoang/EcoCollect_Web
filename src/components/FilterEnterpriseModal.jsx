import React, { useState, useEffect } from 'react';

const FilterEnterpriseModal = ({ show, onClose, onApply, initialAreaId = '', initialStatus = '' }) => {
    const [areaId, setAreaId] = useState(initialAreaId);
    const [status, setStatus] = useState(initialStatus);

    useEffect(() => {
        if (show) {
            setAreaId(initialAreaId);
            setStatus(initialStatus);
        }
    }, [show, initialAreaId, initialStatus]);

    const handleApply = () => {
        onApply({
            areaId: areaId || null,
            status: status || null
        });
        onClose();
    };

    const handleReset = () => {
        setAreaId('');
        setStatus('');
        onApply({
            areaId: null,
            status: null
        });
        onClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Lọc dữ liệu</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        type="button"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Area ID Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Khu vực (Area ID)
                        </label>
                        <input
                            type="text"
                            value={areaId}
                            onChange={(e) => setAreaId(e.target.value)}
                            placeholder="Nhập Area ID"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Status Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái (Status)
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">-- Chọn trạng thái --</option>
                            <option value="PENDING">Chờ xử lý</option>
                            <option value="IN_PROGRESS">Đang thực hiện</option>
                            <option value="COMPLETED">Đã hoàn thành</option>
                            <option value="REJECTED">Đã từ chối</option>
                            <option value="CANCELLED">Đã hủy</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Đặt lại
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleApply}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterEnterpriseModal;
