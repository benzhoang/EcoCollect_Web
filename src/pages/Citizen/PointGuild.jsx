import React from 'react';

const PointGuild = () => {
    const earningMethods = [
        {
            id: 1,
            title: 'Thu gom rác thải tái chế',
            description: 'Phân loại và giao nộp rác thải tái chế tại các điểm thu gom',
            icon: 'recycle',
            iconColor: 'bg-green-100 text-green-600',
            points: '10 điểm/kg',
            details: [
                'Nhựa PET: 10 điểm/kg',
                'Giấy vụn: 8 điểm/kg',
                'Kim loại: 15 điểm/kg',
                'Thủy tinh: 5 điểm/kg',
                'Pin cũ: 3 điểm/chiếc'
            ]
        },
        {
            id: 2,
            title: 'Báo cáo bãi rác tự phát',
            description: 'Phát hiện và báo cáo các bãi rác không đúng quy định',
            icon: 'report',
            iconColor: 'bg-orange-100 text-orange-600',
            points: '50-100 điểm',
            details: [
                'Báo cáo được xác nhận: 50 điểm',
                'Báo cáo có ảnh minh chứng: 75 điểm',
                'Báo cáo được xử lý thành công: 100 điểm'
            ]
        },
        {
            id: 3,
            title: 'Tham gia hoạt động tình nguyện',
            description: 'Tham gia các sự kiện dọn dẹp môi trường do EcoCollect tổ chức',
            icon: 'volunteer',
            iconColor: 'bg-blue-100 text-blue-600',
            points: '100-500 điểm',
            details: [
                'Tham gia sự kiện: 100 điểm',
                'Làm tình nguyện viên: 200 điểm',
                'Tổ chức sự kiện: 500 điểm'
            ]
        },
        {
            id: 4,
            title: 'Mời bạn bè tham gia',
            description: 'Chia sẻ mã giới thiệu và nhận điểm khi bạn bè đăng ký',
            icon: 'referral',
            iconColor: 'bg-purple-100 text-purple-600',
            points: '50 điểm/người',
            details: [
                'Bạn bè đăng ký thành công: 50 điểm',
                'Bạn bè tích điểm lần đầu: 100 điểm',
                'Giới thiệu 5 người: Thêm 200 điểm thưởng'
            ]
        },
        {
            id: 5,
            title: 'Hoàn thành thử thách hàng tuần',
            description: 'Tham gia các thử thách bảo vệ môi trường hàng tuần',
            icon: 'challenge',
            iconColor: 'bg-yellow-100 text-yellow-600',
            points: '50-200 điểm',
            details: [
                'Hoàn thành thử thách: 50 điểm',
                'Hoàn thành sớm: 100 điểm',
                'Hoàn thành xuất sắc: 200 điểm'
            ]
        },
        {
            id: 6,
            title: 'Đánh giá và phản hồi',
            description: 'Đánh giá dịch vụ và đóng góp ý kiến xây dựng',
            icon: 'feedback',
            iconColor: 'bg-pink-100 text-pink-600',
            points: '10-30 điểm',
            details: [
                'Đánh giá dịch vụ: 10 điểm',
                'Phản hồi có ích: 20 điểm',
                'Đề xuất được áp dụng: 30 điểm'
            ]
        }
    ];

    const getIcon = (iconType) => {
        switch (iconType) {
            case 'recycle':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                );
            case 'report':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'volunteer':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                );
            case 'referral':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                );
            case 'challenge':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                );
            case 'feedback':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const tips = [
        {
            id: 1,
            tip: 'Phân loại rác đúng cách để nhận được nhiều điểm hơn',
            icon: '💡'
        },
        {
            id: 2,
            tip: 'Tham gia thường xuyên để nhận thêm điểm thưởng',
            icon: '⭐'
        },
        {
            id: 3,
            tip: 'Chia sẻ với bạn bè để cùng tích điểm và bảo vệ môi trường',
            icon: '🤝'
        }
    ];

    return (
        <div className="min-h-screen bg-green-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-8 text-white mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Hướng dẫn tích điểm EcoPoints</h1>
                            <p className="text-green-100 text-lg">Khám phá các cách để tích lũy điểm và đổi quà hấp dẫn</p>
                        </div>
                    </div>
                </div>

                {/* Earning Methods */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Các cách tích điểm</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {earningMethods.map((method) => (
                            <div key={method.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`${method.iconColor} rounded-lg p-3 flex-shrink-0`}>
                                        {getIcon(method.icon)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{method.title}</h3>
                                        <p className="text-gray-600 mb-3">{method.description}</p>
                                        <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                                            {method.points}
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Chi tiết điểm thưởng:</h4>
                                    <ul className="space-y-2">
                                        {method.details.map((detail, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tips Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Mẹo tích điểm nhanh</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {tips.map((tip) => (
                            <div key={tip.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{tip.icon}</span>
                                    <p className="text-gray-700 font-medium">{tip.tip}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Câu hỏi thường gặp</h2>
                    <div className="space-y-4">
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Điểm EcoPoints có hết hạn không?</h3>
                            <p className="text-gray-600 text-sm">Điểm EcoPoints không có thời hạn sử dụng. Bạn có thể tích lũy và sử dụng bất cứ lúc nào.</p>
                        </div>
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Làm thế nào để đổi quà?</h3>
                            <p className="text-gray-600 text-sm">Truy cập trang "Điểm số" và chọn mục "Đổi quà hấp dẫn" để xem danh sách quà tặng và đổi điểm của bạn.</p>
                        </div>
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Điểm được cập nhật khi nào?</h3>
                            <p className="text-gray-600 text-sm">Điểm sẽ được cập nhật ngay sau khi hoạt động của bạn được xác nhận, thường trong vòng 24 giờ.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Có giới hạn số điểm tích được mỗi ngày không?</h3>
                            <p className="text-gray-600 text-sm">Không có giới hạn số điểm bạn có thể tích được mỗi ngày. Hãy tích cực tham gia các hoạt động để nhận nhiều điểm nhất!</p>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="flex justify-center">
                    <a
                        href="/score"
                        className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Quay lại trang điểm số
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PointGuild;
