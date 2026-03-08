import React from 'react';

/**
 * Props:
 * - show: boolean
 * - rule: object | null
 * - onClose: () => void
 * - onConfirm: () => void
 */
const CancelRewardModal = ({ show, rule, onClose, onConfirm }) => {
    if (!show) return null;

    const isActive = Boolean(rule?.isActive);
    const actionText = isActive ? 'tạm dừng' : 'bật';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl mx-4">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Xác nhận thay đổi trạng thái</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <span className="sr-only">Đóng</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-5">
                    <p className="text-sm text-gray-700">
                        Bạn có chắc chắn muốn <span className="font-semibold">{actionText}</span> reward rule
                        {rule?.name ? <span className="font-semibold"> "{rule.name}"</span> : ''} không?
                    </p>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {isActive ? 'Xác nhận tạm dừng' : 'Xác nhận bật'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelRewardModal;
