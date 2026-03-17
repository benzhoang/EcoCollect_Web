import React, { useEffect, useMemo, useState } from 'react';
import { getCitizenStatisticsOverview } from '../../service/api';

const Statistic = () => {
    const [filterType, setFilterType] = useState('month');
    const [overview, setOverview] = useState({
        reportsSentThisMonth: 0,
        totalVoucherRedemptions: 0,
        redeemedVouchers: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadOverview = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await getCitizenStatisticsOverview(filterType === 'month' ? new Date().toISOString().slice(0, 7) : undefined);
                const data = response?.data ?? response;
                setOverview({
                    reportsSentThisMonth: Number(data?.reportsSentThisMonth ?? 0),
                    totalVoucherRedemptions: Number(data?.totalVoucherRedemptions ?? 0),
                    redeemedVouchers: Array.isArray(data?.redeemedVouchers) ? data.redeemedVouchers : []
                });
            } catch (err) {
                setError(err?.message || 'Không thể tải thống kê. Vui lòng thử lại.');
                setOverview({
                    reportsSentThisMonth: 0,
                    totalVoucherRedemptions: 0,
                    redeemedVouchers: []
                });
            } finally {
                setLoading(false);
            }
        };

        loadOverview();
    }, [filterType]);

    const totalRedeemed = overview.redeemedVouchers.length;

    const statusLabel = (status) => {
        const s = String(status || '').toUpperCase();
        if (s === 'USED') return { label: 'Đã dùng', color: 'bg-gray-100 text-gray-700' };
        if (s === 'REDEEMED') return { label: 'Đã đổi', color: 'bg-green-100 text-green-700' };
        if (s === 'EXPIRED') return { label: 'Hết hạn', color: 'bg-red-100 text-red-700' };
        return { label: status || 'Không rõ', color: 'bg-gray-100 text-gray-700' };
    };

    const voucherRows = useMemo(() => {
        return overview.redeemedVouchers.map((voucher) => {
            const statusInfo = statusLabel(voucher?.status);
            return {
                id: voucher?.voucherId || voucher?.redeemCode || Math.random().toString(36),
                title: voucher?.voucherTitle || 'Voucher',
                redeemCode: voucher?.redeemCode || '—',
                redeemedAt: voucher?.redeemedAt,
                statusLabel: statusInfo.label,
                statusColor: statusInfo.color
            };
        });
    }, [overview.redeemedVouchers]);

    return (
        <div className="min-h-screen w-full bg-green-50 m-0 p-0">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Thống kê</h1>
                            <p className="text-sm text-gray-600">Tổng quan hoạt động và voucher đã đổi của bạn.</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Dữ liệu được cập nhật theo kỳ đã chọn
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Bộ lọc thống kê</h2>
                            <p className="text-sm text-gray-500">Chọn kỳ để xem số liệu phù hợp.</p>
                        </div>
                        <div className="w-full sm:w-64">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                            >
                                <option value="week">Theo tuần</option>
                                <option value="month">Theo tháng</option>
                                <option value="year">Theo năm</option>
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Báo cáo trong kỳ</p>
                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-8 0h8M7 10h10" />
                                </svg>
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">
                            {loading ? '...' : overview.reportsSentThisMonth}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Tổng số báo cáo đã gửi</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Lượt đổi voucher</p>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 01-8 0m8 0a4 4 0 10-8 0m8 0V6a2 2 0 00-2-2H10a2 2 0 00-2 2v1m8 0v1a2 2 0 01-2 2H10a2 2 0 01-2-2V7" />
                                </svg>
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-bold text-blue-600">
                            {loading ? '...' : overview.totalVoucherRedemptions}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Số lần đổi trong kỳ</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Voucher đã đổi</p>
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zm0 0v14m-7 0h14" />
                                </svg>
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-bold text-purple-600">
                            {loading ? '...' : totalRedeemed}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Voucher trong danh sách</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Danh sách voucher đã đổi</h2>
                            <p className="text-xs text-gray-500 mt-1">Theo dõi lịch sử đổi voucher của bạn.</p>
                        </div>
                        <span className="text-xs text-gray-500">Tổng: {loading ? '...' : totalRedeemed}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tên voucher</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mã đổi</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Thời gian đổi</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                                            Đang tải dữ liệu...
                                        </td>
                                    </tr>
                                )}
                                {!loading && voucherRows.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                                            Chưa có voucher đã đổi trong kỳ này.
                                        </td>
                                    </tr>
                                )}
                                {!loading && voucherRows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {row.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {row.redeemCode}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {row.redeemedAt ? new Date(row.redeemedAt).toLocaleString('vi-VN') : '—'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${row.statusColor}`}>
                                                {row.statusLabel}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistic;
