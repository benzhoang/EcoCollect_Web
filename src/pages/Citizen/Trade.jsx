import React, { useEffect, useState } from 'react';
import { getCitizenPointTransactions, getPublicVouchers } from '../../service/api';

const Trade = () => {
    const [userPoints, setUserPoints] = useState(0);
    const [vouchers, setVouchers] = useState([]);
    const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);
    const [isLoadingPoints, setIsLoadingPoints] = useState(false);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                setIsLoadingVouchers(true);
                const response = await getPublicVouchers({ page: 0, size: 20, sort: ['createdAt,desc'] });
                const payload = response?.data ?? response;
                const pageData = payload?.data ?? payload;
                const content = Array.isArray(pageData?.content) ? pageData.content : [];

                const mapped = content.map((item) => ({
                    id: item.id,
                    name: item.title || item.code || 'Voucher',
                    code: item.code || 'N/A',
                    cost: Number(item.pointsCost) || 0,
                    expires: item.availableTo ? new Date(item.availableTo).toLocaleDateString('vi-VN') : 'Không giới hạn',
                    quantity: Number(item.stock) || 0,
                    status: item.displayStatus === 'OPEN' || item.active ? 'available' : 'out',
                    description: item.description || 'Voucher ưu đãi',
                    canRedeem: Boolean(item.canRedeem),
                }));

                setVouchers(mapped);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách voucher:', error);
                setVouchers([]);
            } finally {
                setIsLoadingVouchers(false);
            }
        };

        fetchVouchers();
    }, []);

    useEffect(() => {
        const fetchUserPoints = async () => {
            try {
                setIsLoadingPoints(true);
                const response = await getCitizenPointTransactions(0, 20, ['createdAt,desc']);
                const transactions = response?.data?.content || [];

                const currentPoints = transactions.reduce((total, tx) => {
                    const points = Number(tx?.points) || 0;
                    const txType = String(tx?.txType || '').toUpperCase();

                    if (txType === 'EARN') return total + points;
                    if (txType === 'SPEND') return total - points;
                    return total;
                }, 0);

                setUserPoints(Math.max(0, currentPoints));
            } catch (error) {
                console.error('Lỗi khi lấy số dư điểm hiện tại:', error);
                setUserPoints(0);
            } finally {
                setIsLoadingPoints(false);
            }
        };

        fetchUserPoints();
    }, []);

    const statusBadge = (status) => {
        switch (status) {
            case 'available':
                return <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Đang mở</span>;
            case 'out':
                return <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">Tạm hết</span>;
            case 'coming-soon':
                return <span className="px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">Sắp mở</span>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-green-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Đổi quà</p>
                        <h1 className="text-2xl font-bold text-gray-900">Kho quà tặng EcoPoints</h1>
                        <p className="text-sm text-gray-600 mt-2">
                            Chọn voucher phù hợp, bấm Đổi ngay và nhận mã đổi thưởng tức thì.
                        </p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg border border-green-200">
                        <div className="text-xs uppercase font-semibold tracking-wide">Điểm hiện có</div>
                        <div className="text-2xl font-bold">
                            {isLoadingPoints ? 'Đang tải...' : `${userPoints.toLocaleString()} pts`}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoadingVouchers && (
                        <div className="col-span-full text-sm text-gray-600">Đang tải danh sách voucher...</div>
                    )}
                    {!isLoadingVouchers && vouchers.length === 0 && (
                        <div className="col-span-full text-sm text-gray-600">Chưa có voucher phù hợp.</div>
                    )}
                    {vouchers.map((voucher) => {
                        const canRedeem = voucher.status === 'available' && userPoints >= voucher.cost && voucher.canRedeem;
                        const isDisabled = voucher.status !== 'available' || !canRedeem;

                        return (
                            <div key={voucher.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-lg font-semibold text-gray-900 leading-snug">{voucher.name}</h3>
                                    {statusBadge(voucher.status)}
                                </div>
                                <p className="text-sm text-gray-600">{voucher.description}</p>
                                <div className="flex items-center justify-between text-sm text-gray-700">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-green-700">{voucher.cost.toLocaleString()} pts</span>
                                        <span className="text-xs text-gray-500">Điểm cần</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-semibold text-gray-800">{voucher.code}</span>
                                        <span className="text-xs text-gray-500">Mã voucher</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>HSD: {voucher.expires}</span>
                                    <span>Còn lại: {voucher.quantity} suất</span>
                                </div>
                                <button
                                    className={`w-full py-2.5 mt-auto rounded-lg font-semibold transition-all ${isDisabled
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                    disabled={isDisabled}
                                >
                                    {voucher.status === 'out'
                                        ? 'Tạm hết'
                                        : voucher.status === 'coming-soon'
                                            ? 'Sắp mở'
                                            : canRedeem
                                                ? 'Đổi ngay'
                                                : 'Chưa đủ điểm'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Trade;
