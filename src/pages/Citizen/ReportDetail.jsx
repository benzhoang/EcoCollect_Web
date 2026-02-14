import React, { useState, useEffect } from 'react';

const ReportDetail = () => {
    const [reportId, setReportId] = useState(null);
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        // Lấy reportId từ URL
        const pathParts = window.location.pathname.split('/');
        const id = pathParts[pathParts.length - 1];
        setReportId(id);

        // Dữ liệu mẫu các báo cáo (giống với Report.jsx)
        const mockReports = {
            '1': {
                id: 1,
                wasteType: 'Rác thông thường',
                wasteTypeColor: 'bg-gray-100 text-gray-700',
                status: 'Từ chối',
                statusColor: 'bg-red-100 text-red-700',
                address: '234 Điện Biên Phủ, Quận Bình Thạnh',
                fullAddress: '234 Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP.HCM',
                date: '10/01/2024 - 15:45',
                submittedAt: '2024-01-10 15:45',
                points: '0 điểm',
                pointsColor: 'text-red-600',
                image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=300&fit=crop',
                description: 'Báo cáo về rác thải thông thường tại khu vực này. Rác đã được thu gom nhưng không đủ điều kiện để nhận điểm thưởng.',
                coordinates: { lat: 10.8019, lng: 106.7149 }
            },
            '2': {
                id: 2,
                wasteType: 'Rác điện tử',
                wasteTypeColor: 'bg-orange-100 text-orange-700',
                status: 'Đã thu gom',
                statusColor: 'bg-green-100 text-green-700',
                address: '56 Võ Văn Tần, Quận 3, TP.HCM',
                fullAddress: '56 Võ Văn Tần, Phường 6, Quận 3, TP.HCM',
                date: '12/01/2024 - 16:00',
                submittedAt: '2024-01-12 16:00',
                points: '+40 điểm',
                pointsColor: 'text-green-600',
                image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
                description: 'Rác thải điện tử bao gồm các thiết bị điện tử cũ như điện thoại, máy tính, pin cũ. Đã được thu gom và xử lý đúng quy trình.',
                coordinates: { lat: 10.7829, lng: 106.6904 }
            },
            '3': {
                id: 3,
                wasteType: 'Rác tái chế',
                wasteTypeColor: 'bg-blue-100 text-blue-700',
                status: 'Chờ xử lý',
                statusColor: 'bg-orange-100 text-orange-700',
                address: '12 Pasteur, Quận 3, TP.HCM',
                fullAddress: '12 Pasteur, Phường Đa Kao, Quận 1, TP.HCM',
                date: '14/01/2024 - 09:15',
                submittedAt: '2024-01-14 09:15',
                points: 'Chờ duyệt điểm',
                pointsColor: 'text-gray-600',
                image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
                description: 'Rác thải tái chế bao gồm chai nhựa, giấy, bìa carton. Đang chờ xử lý và duyệt điểm thưởng.',
                coordinates: { lat: 10.7769, lng: 106.7009 }
            },
            '4': {
                id: 4,
                wasteType: 'Rác nguy hại',
                wasteTypeColor: 'bg-red-100 text-red-700',
                status: 'Đã tiếp nhận',
                statusColor: 'bg-orange-100 text-orange-700',
                address: '78 Trần Hưng Đạo, Quận 5, TP.HCM',
                fullAddress: '78 Trần Hưng Đạo, Phường 11, Quận 5, TP.HCM',
                date: '14/01/2024 - 14:20',
                submittedAt: '2024-01-14 14:20',
                points: '+30 điểm',
                pointsColor: 'text-green-600',
                image: 'https://images.unsplash.com/photo-1611909023030-19c0c2a79fb8?w=400&h=300&fit=crop',
                description: 'Rác thải nguy hại bao gồm pin, bóng đèn huỳnh quang, hóa chất. Đã được tiếp nhận và xử lý an toàn.',
                coordinates: { lat: 10.7544, lng: 106.6674 }
            },
            '5': {
                id: 5,
                wasteType: 'Rác hữu cơ',
                wasteTypeColor: 'bg-green-100 text-green-700',
                status: 'Đã phân công',
                statusColor: 'bg-blue-100 text-blue-700',
                address: '45 Lê Lợi, Quận 1, TP.HCM',
                fullAddress: '45 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
                date: '15/01/2024 - 05:30',
                submittedAt: '2024-01-15 05:30',
                points: '+20 điểm',
                pointsColor: 'text-green-600',
                image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
                description: 'Rác thải hữu cơ từ thức ăn thừa, rau củ quả. Đã được phân công cho đội thu gom xử lý.',
                coordinates: { lat: 10.7769, lng: 106.7009 }
            },
            '6': {
                id: 6,
                wasteType: 'Rác tái chế',
                wasteTypeColor: 'bg-blue-100 text-blue-700',
                status: 'Đã thu gom',
                statusColor: 'bg-green-100 text-green-700',
                address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
                fullAddress: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
                date: '15/01/2024 - 08:30',
                submittedAt: '2024-01-15 08:30',
                points: '+25 điểm',
                pointsColor: 'text-green-600',
                image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
                description: 'Rác thải tái chế đã được thu gom thành công. Bao gồm chai nhựa, lon nước, giấy vụn.',
                coordinates: { lat: 10.7769, lng: 106.7009 }
            }
        };

        if (mockReports[id]) {
            setReportData(mockReports[id]);
        }
    }, []);

    const handleBack = () => {
        window.history.pushState({}, '', '/report');
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    if (!reportData) {
        return (
            <div className="min-h-screen bg-green-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="text-gray-500 mb-4">Đang tải thông tin...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Quay lại danh sách báo cáo</span>
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Chi tiết báo cáo</h1>
                            <p className="text-sm text-gray-600">Mã báo cáo: #{reportData.id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${reportData.statusColor}`}>
                                {reportData.status}
                            </span>
                            <span className={`px-4 py-2 rounded-lg text-xs font-semibold ${reportData.wasteTypeColor}`}>
                                {reportData.wasteType}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Thông tin báo cáo</h2>
                                <span className={`text-sm font-semibold ${reportData.pointsColor}`}>
                                    {reportData.points}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">Ngày tạo: {reportData.submittedAt}</p>
                        </div>

                        {/* Basic Information */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin cơ bản</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Loại rác thải</label>
                                    <div className="mt-1">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${reportData.wasteTypeColor}`}>
                                            {reportData.wasteType}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Mô tả</label>
                                    <p className="mt-1 text-gray-700">{reportData.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin địa điểm</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Địa điểm</label>
                                    <div className="mt-1 flex items-start gap-2">
                                        <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-gray-900 font-medium">{reportData.address}</p>
                                            <p className="text-sm text-gray-600 mt-1">{reportData.fullAddress}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg overflow-hidden border border-gray-200 h-64">
                                    <iframe
                                        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1234567890123!2d${reportData.coordinates.lng}!3d${reportData.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f5c8c8c8c8d%3A0x8c8c8c8c8c8c8c8c!2sHo%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s`}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Bản đồ vị trí"
                                    ></iframe>
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        {reportData.image && (
                            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Hình ảnh</h3>
                                <div className="rounded-lg overflow-hidden border border-gray-200">
                                    <img
                                        src={reportData.image}
                                        alt={reportData.wasteType}
                                        className="w-full h-64 object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Summary */}
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Tóm tắt</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                                    <div className="mt-1">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${reportData.statusColor}`}>
                                            {reportData.status}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Điểm thưởng</label>
                                    <p className={`mt-1 text-lg font-semibold ${reportData.pointsColor}`}>
                                        {reportData.points}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Ngày báo cáo</label>
                                    <p className="mt-1 text-gray-900">{reportData.date}</p>
                                </div>
                            </div>
                        </div>

                        {/* Back Button */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <button
                                onClick={handleBack}
                                className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Quay lại danh sách
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetail;
