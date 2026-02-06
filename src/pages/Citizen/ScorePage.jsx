import React, { useState, useEffect } from 'react';

const ScorePage = () => {
    const [ecopoints, setEcopoints] = useState(2450);
    const [wasteCollected, setWasteCollected] = useState(124);
    const [co2Reduced, setCo2Reduced] = useState(38.5);
    const [ranking, setRanking] = useState(12);

    const pointsHistory = [
        {
            id: 1,
            activity: 'Thu gom rác nhựa định kỳ',
            date: '20/10/2023',
            quantity: '5.2 kg',
            points: 52,
            icon: 'truck',
            iconColor: 'text-green-600'
        },
        {
            id: 2,
            activity: 'Báo cáo bãi rác tự phát',
            date: '18/10/2023',
            quantity: '--',
            points: 100,
            icon: 'warning',
            iconColor: 'text-orange-600'
        },
        {
            id: 3,
            activity: 'Tái chế pin cũ',
            date: '15/10/2023',
            quantity: '12 chiếc',
            points: 36,
            icon: 'battery',
            iconColor: 'text-blue-600'
        },
        {
            id: 4,
            activity: 'Thu gom giấy vụn',
            date: '10/10/2023',
            quantity: '10.0 kg',
            points: 80,
            icon: 'truck',
            iconColor: 'text-green-600'
        }
    ];

    const rewards = [
        {
            id: 1,
            name: 'Voucher Highlands Coffee',
            description: 'Giảm giá 30.000₫ cho hóa đơn bất kỳ',
            cost: 500,
            icon: 'coffee',
            canRedeem: true
        },
        {
            id: 2,
            name: 'Túi Canvas EcoCollect',
            description: 'Chất liệu 100% tự nhiên bền đẹp',
            cost: 1200,
            icon: 'bag',
            canRedeem: true
        },
        {
            id: 3,
            name: 'Voucher thuê xe điện',
            description: 'Miễn phí 1 tháng thuê xe điện',
            cost: 5000,
            icon: 'scooter',
            canRedeem: false
        }
    ];

    const getActivityIcon = (iconType) => {
        switch (iconType) {
            case 'truck':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'battery':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getRewardIcon = (iconType) => {
        switch (iconType) {
            case 'coffee':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                    </svg>
                );
            case 'bag':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                );
            case 'scooter':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Current EcoPoints Balance */}
                        <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 opacity-10">
                                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold mb-4">SỐ DƯ ĐIỂM HIỆN TẠI</h2>
                            <div className="mb-6">
                                <div className="text-5xl font-bold mb-2">{formatNumber(ecopoints)}</div>
                                <div className="text-xl font-medium opacity-90">EcoPoints</div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a 
                                    href="/trade"
                                    className="flex-1 bg-white text-green-700 font-semibold py-3 px-4 rounded-lg hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2 text-center"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                    </svg>
                                    Đổi quà ngay
                                </a>
                                <a 
                                    href="/point-guide"
                                    className="flex-1 bg-green-900 bg-opacity-50 text-white font-semibold py-3 px-4 rounded-lg hover:bg-opacity-70 transition-all duration-200 text-center"
                                >
                                    Xem cách tích điểm
                                </a>
                            </div>
                        </div>

                        {/* Points History */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Lịch sử tích điểm</h2>
                                <a href="#" className="text-green-600 hover:text-green-700 font-medium text-sm">
                                    Xem tất cả
                                </a>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">HOẠT ĐỘNG</th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">NGÀY</th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">SỐ LƯỢNG</th>
                                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">ĐIỂM NHẬN</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pointsHistory.map((item) => (
                                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`${item.iconColor}`}>
                                                            {getActivityIcon(item.icon)}
                                                        </div>
                                                        <span className="text-sm text-gray-700">{item.activity}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 text-sm text-gray-600">{item.date}</td>
                                                <td className="py-3 px-2 text-sm text-gray-600">{item.quantity}</td>
                                                <td className="py-3 px-2 text-right">
                                                    <span className="text-sm font-semibold text-green-600">+{item.points} pts</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Your Impact */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Tác động của bạn</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-2xl font-bold text-gray-800">{wasteCollected} kg</div>
                                        <div className="text-sm text-gray-600">Rác thải đã thu gom</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-2xl font-bold text-gray-800">{co2Reduced} kg</div>
                                        <div className="text-sm text-gray-600">Giảm thiểu CO2</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-2xl font-bold text-gray-800">Hạng {ranking}</div>
                                        <div className="text-sm text-gray-600">Trên bảng xếp hạng khu vực</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attractive Rewards */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Đổi quà hấp dẫn</h2>
                            <div className="space-y-4 mb-4">
                                {rewards.map((reward) => {
                                    const pointsNeeded = reward.cost - ecopoints;
                                    const canRedeem = ecopoints >= reward.cost;
                                    return (
                                        <div key={reward.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-green-600">
                                                    {getRewardIcon(reward.icon)}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800 mb-1">{reward.name}</h3>
                                                    <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-semibold text-green-700">{formatNumber(reward.cost)} pts</span>
                                                        <span className={`text-xs font-medium ${canRedeem ? 'text-green-600' : 'text-orange-600'}`}>
                                                            {canRedeem ? 'Cần thêm 0 pts' : `Thiếu ${formatNumber(pointsNeeded)} pts`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <a 
                                href="/trade"
                                className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2 text-center"
                            >
                                Khám phá tất cả quà tặng
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScorePage;
