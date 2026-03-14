import React, { useEffect, useState } from 'react';
import { getCitizenVoucherRedemptions } from '../../service/api';

const TradeHistory = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({
        page: 0,
        size: 11,
        totalElements: 0,
        totalPages: 1,
    });

    const getStatusBadge = (status) => {
        const normalized = String(status || '').toUpperCase();
        switch (normalized) {
            case 'REDEEMED':
            case 'SUCCESS':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'FAILED':
            case 'CANCELLED':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                setError('');
                const response = await getCitizenVoucherRedemptions({
                    page: currentPage - 1,
                    size: 11,
                    sort: ['redeemedAt,desc'],
                });
                const payload = response?.data ?? response;
                const pageData = payload?.data ?? payload;
                const content = Array.isArray(pageData?.content) ? pageData.content : [];

                const mapped = content.map((item) => {
                    const redeemedAt = item.redeemedAt ? new Date(item.redeemedAt) : null;
                    const dateText = redeemedAt
                        ? redeemedAt.toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        })
                        : '';

                    return {
                        id: item.redemptionId || item.voucherId || item.redeemCode || Math.random().toString(36).slice(2),
                        title: item.voucherTitle || item.voucherCode || 'Đổi voucher',
                        redeemCode: item.redeemCode || '--',
                        status: item.status || '--',
                        note: item.note || '',
                        redeemedAt: dateText,
                    };
                });

                setHistory(mapped);
                setPageInfo({
                    page: pageData?.page ?? (currentPage - 1),
                    size: pageData?.size ?? 11,
                    totalElements: pageData?.totalElements ?? mapped.length,
                    totalPages: pageData?.totalPages ?? 1,
                });
            } catch (err) {
                console.error('Lỗi khi lấy lịch sử đổi quà:', err);
                setError('Không thể tải lịch sử đổi quà. Vui lòng thử lại.');
                setHistory([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [currentPage]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
                    <div>
                        <p className="text-sm text-green-700 font-medium mb-2">Đổi quà</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Lịch sử đổi quà</h1>
                        <p className="text-sm text-gray-600 mt-2">
                            Theo dõi các voucher bạn đã đổi và trạng thái xử lý.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-white border border-green-100 shadow-sm rounded-xl px-4 py-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">Tổng lượt đổi</div>
                            <div className="text-lg font-semibold text-gray-900">{pageInfo.totalElements}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Danh sách lịch sử</h2>
                                <p className="text-xs text-gray-500 mt-1">Cập nhật theo thời gian gần nhất</p>
                            </div>
                            <span className="text-xs text-gray-500">{new Date().toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                                Đang tải lịch sử đổi quà...
                            </div>
                        )}

                        {!isLoading && history.length === 0 && !error && (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-3">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-700">Chưa có lịch sử đổi quà</p>
                                <p className="text-xs text-gray-500 mt-1">Hãy đổi voucher để tích lũy lịch sử tại đây.</p>
                            </div>
                        )}

                        {!isLoading && history.length > 0 && (
                            <div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                                                <th className="text-left py-3 px-2 font-semibold">Voucher</th>
                                                <th className="text-left py-3 px-2 font-semibold">Ngày đổi</th>
                                                <th className="text-left py-3 px-2 font-semibold">Mã đổi</th>
                                                <th className="text-right py-3 px-2 font-semibold">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((item) => (
                                                <tr key={item.id} className="border-b border-gray-100 hover:bg-green-50/40 transition-colors">
                                                    <td className="py-4 px-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                                                            {item.note && (
                                                                <span className="text-xs text-gray-500 mt-1">{item.note}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2 text-sm text-gray-600">{item.redeemedAt}</td>
                                                    <td className="py-4 px-2 text-sm text-gray-600 font-medium">{item.redeemCode}</td>
                                                    <td className="py-4 px-2 text-right">
                                                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadge(item.status)}`}>
                                                            {item.status || '---'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                                    <div>
                                        {pageInfo.totalElements > 0
                                            ? `Hiển thị ${pageInfo.page * pageInfo.size + 1}-${pageInfo.page * pageInfo.size + history.length} của ${pageInfo.totalElements} mục`
                                            : 'Không có dữ liệu'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Trang trước
                                        </button>
                                        <span className="text-sm text-gray-600">Trang {currentPage} / {pageInfo.totalPages}</span>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage((prev) => Math.min(pageInfo.totalPages, prev + 1))}
                                            disabled={currentPage >= pageInfo.totalPages}
                                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Trang sau
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradeHistory;
