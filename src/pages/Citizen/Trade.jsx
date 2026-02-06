import React from 'react';

const Trade = () => {
    const userPoints = 2450;

    const vouchers = [
        {
            id: 1,
            name: 'Voucher Highlands Coffee - 30.000₫',
            code: 'ECO-HLC-30K',
            cost: 500,
            expires: '31/12/2024',
            quantity: 120,
            status: 'available',
            description: 'Giảm 30.000₫ cho mọi hóa đơn tại Highlands Coffee.'
        },
        {
            id: 2,
            name: 'Túi Canvas EcoCollect',
            code: 'ECO-BAG-1200',
            cost: 1200,
            expires: 'Không giới hạn',
            quantity: 45,
            status: 'available',
            description: 'Túi canvas thân thiện môi trường, thiết kế bền đẹp.'
        },
        {
            id: 3,
            name: 'Voucher thuê xe điện 1 tháng',
            code: 'ECO-EV-5000',
            cost: 5000,
            expires: '15/02/2025',
            quantity: 12,
            status: 'coming-soon',
            description: 'Miễn phí 1 tháng thuê xe điện, áp dụng tại các điểm liên kết.'
        },
        {
            id: 4,
            name: 'Giảm 20% mua sắm xanh',
            code: 'ECO-GREEN-20',
            cost: 900,
            expires: '30/11/2024',
            quantity: 60,
            status: 'available',
            description: 'Giảm 20% cho hóa đơn tại các cửa hàng đối tác EcoCollect.'
        },
        {
            id: 5,
            name: 'Vé xem phim eco-day',
            code: 'ECO-CINEMA-15',
            cost: 1500,
            expires: '20/12/2024',
            quantity: 35,
            status: 'available',
            description: '01 vé xem phim cho sự kiện ngày xanh tại hệ thống CGV/BHD.'
        },
        {
            id: 6,
            name: 'Voucher mua sách',
            code: 'ECO-BOOK-80',
            cost: 800,
            expires: '05/01/2025',
            quantity: 80,
            status: 'out',
            description: 'Giảm 80.000₫ khi mua sách tại các hiệu sách đối tác.'
        }
    ];

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
        <div className="min-h-screen bg-gray-50">
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
                        <div className="text-2xl font-bold">{userPoints.toLocaleString()} pts</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vouchers.map((voucher) => {
                        const canRedeem = voucher.status === 'available' && userPoints >= voucher.cost;
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
