import React, { useEffect, useState } from 'react';

/**
 * Props:
 * - show: boolean
 * - onClose: () => void
 * - onConfirm: (reason: string) => void | Promise<void>
 * - loading?: boolean
 */
const CancelModal = ({ show, onClose, onConfirm, loading = false }) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            setReason('Tôi muốn hủy báo cáo này');
            setError('');
        }
    }, [show]);

    if (!show) return null;

    const handleConfirm = async () => {
        const trimmedReason = reason.trim();
        if (!trimmedReason) {
            setError('Vui lòng nhập lý do hủy báo cáo.');
            return;
        }

        setError('');
        await onConfirm(trimmedReason);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl mx-4">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Hủy báo cáo</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <span className="sr-only">Đóng</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-4 space-y-3">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="cancel-reason">
                        Nhập lý do hủy báo cáo:
                    </label>
                    <textarea
                        id="cancel-reason"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[110px] resize-y"
                        placeholder="Nhập lý do hủy..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        disabled={loading}
                    />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Đang hủy...' : 'Xác nhận hủy'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelModal;
