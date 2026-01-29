import React from 'react';

const AssignCollectorModal = ({
    show,
    request,
    collectors,
    selectedCollector,
    onSelectedCollectorChange,
    onClose,
    onConfirm
}) => {
    if (!show || !request) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Gán Collector</h2>
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
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Thông tin yêu cầu</h3>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            <div className="text-sm">
                                <span className="text-gray-600">Mã yêu cầu:</span>
                                <span className="font-medium text-gray-900 ml-2">{request.code}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-gray-600">Loại rác:</span>
                                <span className="font-medium text-gray-900 ml-2">{request.type}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-gray-600">Địa điểm:</span>
                                <span className="font-medium text-gray-900 ml-2">{request.location}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn Collector <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedCollector}
                            onChange={(e) => onSelectedCollectorChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">-- Chọn Collector --</option>
                            {collectors
                                .filter(c => c.status === 'available')
                                .map(collector => (
                                    <option key={collector.id} value={collector.id}>
                                        {collector.name} - {collector.vehicle} ({collector.statusLabel})
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Xác nhận gán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignCollectorModal;

