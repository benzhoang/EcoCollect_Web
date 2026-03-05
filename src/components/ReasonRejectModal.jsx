import React, { useState, useEffect } from "react";

/**
 * Props:
 * - show: boolean - hiển thị hay ẩn modal
 * - onClose: () => void - đóng modal
 * - onConfirm: (reason: string) => void - callback khi xác nhận lý do
 */
const ReasonRejectModal = ({ show, onClose, onConfirm }) => {
    const [reason, setReason] = useState("");

    // Khi mở modal lại thì reset nội dung lý do
    useEffect(() => {
        if (show) {
            setReason("");
        }
    }, [show]);

    if (!show) return null;

    const handleConfirm = () => {
        const trimmed = reason.trim();
        if (!trimmed) {
            alert("Vui lòng nhập lý do từ chối.");
            return;
        }
        if (onConfirm) {
            onConfirm(trimmed);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Lý do từ chối yêu cầu</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <span className="sr-only">Đóng</span>
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-4 space-y-3">
                    <p className="text-sm text-gray-600">
                        Vui lòng nhập lý do từ chối yêu cầu thu gom này. Lý do này có thể được
                        lưu lại để tra cứu sau.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lý do từ chối
                        </label>
                        <textarea
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[120px] resize-y"
                            placeholder="Nhập lý do từ chối..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                        Xác nhận từ chối
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReasonRejectModal;

