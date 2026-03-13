import React from 'react';

const Contact = () => {

    const contactInfo = [
        {
            id: 1,
            title: 'Email',
            value: 'support@ecocollect.vn',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            id: 2,
            title: 'Điện thoại',
            value: '012 345 6789',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            id: 3,
            title: 'Địa chỉ',
            value: '123 Đường ABC, Quận XYZ, TP.HCM',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            id: 4,
            title: 'Giờ làm việc',
            value: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        }
    ];

    return (
        <div className="min-h-screen bg-green-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Liên hệ & Hỗ trợ
                        </h1>
                        <p className="text-lg text-green-50 leading-relaxed">
                            Tổng hợp thông tin liên hệ, hướng dẫn hỗ trợ và tài nguyên hữu ích để bạn sử dụng EcoCollect dễ dàng hơn.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-16 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Information - Left */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                                Thông tin liên hệ
                            </h2>
                            <div className="space-y-6">
                                {contactInfo.map((info) => (
                                    <div key={info.id} className="flex items-start gap-4">
                                        <div className={`${info.bgColor} ${info.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                            {info.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {info.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {info.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quy trình xử lý */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                                Quy trình xử lý
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Tiếp nhận</h3>
                                        <p className="text-sm text-gray-600">Chúng tôi tiếp nhận và xác nhận phản hồi/khiếu nại của bạn</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Xử lý</h3>
                                        <p className="text-sm text-gray-600">Đội ngũ chuyên trách sẽ xem xét và xử lý vấn đề</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Phản hồi</h3>
                                        <p className="text-sm text-gray-600">Chúng tôi sẽ thông báo kết quả xử lý qua email hoặc điện thoại</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thời gian xử lý */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg shadow-sm p-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Thời gian xử lý
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Khẩn cấp:</span>
                                    <span className="font-semibold text-gray-900">24 giờ</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Cao:</span>
                                    <span className="font-semibold text-gray-900">2-3 ngày</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Bình thường:</span>
                                    <span className="font-semibold text-gray-900">3-5 ngày</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Thấp:</span>
                                    <span className="font-semibold text-gray-900">5-7 ngày</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Support Info - Right */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                                Trung tâm hỗ trợ
                            </h2>
                            <div className="space-y-6">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">Kênh hỗ trợ nhanh</h3>
                                    <p className="text-sm text-green-700">
                                        Nếu bạn cần hỗ trợ gấp, hãy gọi hotline hoặc gửi email để được phản hồi sớm nhất.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <a
                                            href="tel:0123456789"
                                            className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-100"
                                        >
                                            Gọi hotline
                                        </a>
                                        <a
                                            href="mailto:support@ecocollect.vn"
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700"
                                        >
                                            Gửi email
                                        </a>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border border-gray-200 rounded-lg p-5">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Hướng dẫn sử dụng</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Xem nhanh các bước báo cáo, tích điểm và đổi quà.
                                        </p>
                                        <a href="/point-guide" className="text-green-600 font-semibold text-sm hover:text-green-700">
                                            Xem hướng dẫn
                                        </a>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-5">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Câu hỏi thường gặp</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Tổng hợp các câu hỏi phổ biến về EcoCollect.
                                        </p>
                                        <a href="/faq" className="text-green-600 font-semibold text-sm hover:text-green-700">
                                            Xem FAQ
                                        </a>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Cam kết phản hồi</h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>• Phản hồi trong vòng 24 giờ làm việc với các yêu cầu gấp.</li>
                                        <li>• Hỗ trợ qua email và điện thoại trong giờ hành chính.</li>
                                        <li>• Ưu tiên xử lý các vấn đề liên quan đến thu gom và đổi quà.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

