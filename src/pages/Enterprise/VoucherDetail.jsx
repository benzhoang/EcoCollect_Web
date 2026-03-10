import React, { useEffect, useMemo, useState } from 'react';
import EnterpriseSidebar from '../../components/EnterpriseSidebar';
import { getEnterpriseVoucherById } from '../../service/api';

const VoucherDetail = () => {
    const [isSidebarOpen] = useState(true);

    const voucherId = useMemo(() => {
        const parts = window.location.pathname.split('/');
        return parts[parts.length - 1];
    }, []);

    const [voucher, setVoucher] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        const fetchVoucherDetail = async () => {
            try {
                setIsLoading(true);
                setErrorMessage('');
                const response = await getEnterpriseVoucherById(voucherId);
                const payload = response?.data ?? response;

                const mapped = payload
                    ? {
                        id: payload.id,
                        name: payload.title || payload.code || 'Voucher',
                        code: payload.code || 'N/A',
                        pointsRequired: payload.pointsCost ?? 0,
                        quantity: payload.stock ?? 0,
                        remaining: payload.stock ?? 0,
                        availableFrom: payload.availableFrom ? payload.availableFrom.split('T')[0] : 'N/A',
                        expiryDate: payload.availableTo ? payload.availableTo.split('T')[0] : 'N/A',
                        description: payload.description || '',
                        isActive: payload.active ?? true,
                        createdAt: payload.createdAt ? payload.createdAt.split('T')[0] : 'N/A',
                        updatedAt: payload.updatedAt ? payload.updatedAt.split('T')[0] : 'N/A',
                        usedCount: payload.usedCount ?? 0,
                        imageUrl: payload.imageUrl || '',
                    }
                    : null;

                if (isMounted) {
                    setVoucher(mapped);
                }
            } catch (error) {
                if (isMounted) {
                    setErrorMessage(error?.message || 'Không thể tải chi tiết voucher.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (voucherId) {
            fetchVoucherDetail();
        }

        return () => {
            isMounted = false;
        };
    }, [voucherId]);

    const getVoucherStatusColor = (active) => (active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700');

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
            <EnterpriseSidebar isOpen={isSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Chi tiết voucher</h1>
                        <p className="text-sm text-gray-600">Xem thông tin và trạng thái voucher</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href="/enterprise/vouchers"
                            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Quay lại danh sách
                        </a>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-sm text-gray-600">
                            Đang tải chi tiết voucher...
                        </div>
                    ) : errorMessage ? (
                        <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm text-sm text-red-600">
                            {errorMessage}
                        </div>
                    ) : voucher ? (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-2xl font-semibold text-gray-900">{voucher.name}</h2>
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getVoucherStatusColor(voucher.isActive)}`}>
                                                    {voucher.isActive ? 'Hoạt động' : 'Tạm dừng'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">Mã voucher: <span className="font-medium text-gray-800">{voucher.code}</span></p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin voucher</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-gray-400">Điểm đổi</p>
                                                <p className="text-sm font-medium text-gray-900 mt-1">{voucher.pointsRequired} điểm</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-gray-400">Số lượng</p>
                                                <p className="text-sm font-medium text-gray-900 mt-1">{voucher.remaining}/{voucher.quantity}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-gray-400">Ngày tạo</p>
                                                <p className="text-sm font-medium text-gray-900 mt-1">{voucher.createdAt}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-gray-400">Cập nhật gần nhất</p>
                                                <p className="text-sm font-medium text-gray-900 mt-1">{voucher.updatedAt}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-gray-400">Bắt đầu</p>
                                                <p className="text-sm font-medium text-gray-900 mt-1">{voucher.availableFrom || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-gray-400">Kết thúc</p>
                                                <p className="text-sm font-medium text-gray-900 mt-1">{voucher.expiryDate}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả</h3>
                                        <p className="text-sm text-gray-700 leading-relaxed">{voucher.description || 'Chưa có mô tả'}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tình trạng</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Trạng thái</span>
                                                <span className={`font-medium ${voucher.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                                                    {voucher.isActive ? 'Đang hoạt động' : 'Đã tạm dừng'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Còn lại</span>
                                                <span className="font-medium text-gray-900">{voucher.remaining} voucher</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Tổng số</span>
                                                <span className="font-medium text-gray-900">{voucher.quantity} voucher</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6 w-full lg:w-2/3 lg:mr-auto">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh voucher</h3>
                                {voucher.imageUrl ? (
                                    <img
                                        src={voucher.imageUrl}
                                        alt={voucher.name}
                                        className="w-full h-56 md:h-64 rounded-2xl object-cover border border-gray-200"
                                    />
                                ) : (
                                    <div className="w-full h-56 md:h-64 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400">
                                        Chưa có ảnh
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-sm text-gray-600">
                            Không tìm thấy voucher.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoucherDetail;
