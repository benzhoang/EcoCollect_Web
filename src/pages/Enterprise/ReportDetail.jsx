import React, { useState, useEffect } from 'react';
import EnterpriseSidebar from '../../components/EnterpriseSidebar';

const ReportDetail = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [requestId, setRequestId] = useState(null);
    const [requestData, setRequestData] = useState(null);

    useEffect(() => {
        // Lấy requestId từ URL
        const pathParts = window.location.pathname.split('/');
        const id = pathParts[pathParts.length - 1];
        setRequestId(id);

        // Giả lập dữ liệu yêu cầu (trong thực tế sẽ fetch từ API)
        const mockRequests = {
            '1': {
                id: 1,
                code: 'REQ-2024-001',
                type: 'Nhựa (PET)',
                typeColor: 'bg-blue-100 text-blue-700',
                weight: '1.2 Tấn',
                location: 'Khu công nghiệp Bắc Thăng L',
                fullAddress: '123 Đường ABC, Khu công nghiệp Bắc Thăng L, Quận 1, TP.HCM',
                time: '2 giờ trước',
                submittedAt: '2024-01-15 14:30',
                status: 'Chờ xử lý',
                statusColor: 'bg-yellow-100 text-yellow-700',
                description: 'Rác thải nhựa PET từ quá trình sản xuất, đã được phân loại và đóng gói sẵn.',
                contactPerson: 'Nguyễn Văn A',
                contactPhone: '0901234567',
                contactEmail: 'nguyenvana@example.com',
                images: [
                    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop'
                ],
                coordinates: { lat: 10.8231, lng: 106.6297 }
            },
            '2': {
                id: 2,
                code: 'REQ-2024-002',
                type: 'Hữu cơ',
                typeColor: 'bg-green-100 text-green-700',
                weight: '450 kg',
                location: 'Chung cư Green Valley, Quận 7',
                fullAddress: '456 Đường XYZ, Chung cư Green Valley, Quận 7, TP.HCM',
                time: '5 giờ trước',
                submittedAt: '2024-01-15 11:30',
                status: 'Chờ xử lý',
                statusColor: 'bg-yellow-100 text-yellow-700',
                description: 'Rác thải hữu cơ từ khu vực chung cư, bao gồm thức ăn thừa và rác vườn.',
                contactPerson: 'Trần Thị B',
                contactPhone: '0907654321',
                contactEmail: 'tranthib@example.com',
                images: [
                    'https://images.unsplash.com/photo-1611909023030-19c0c2a79fb8?w=400&h=300&fit=crop'
                ],
                coordinates: { lat: 10.7300, lng: 106.7200 }
            },
            '3': {
                id: 3,
                code: 'REQ-2024-003',
                type: 'Giấy vụn',
                typeColor: 'bg-orange-100 text-orange-700',
                weight: '800 kg',
                location: 'Tòa nhà Bitexco, Quận 1',
                fullAddress: '789 Đường DEF, Tòa nhà Bitexco, Quận 1, TP.HCM',
                time: 'Hôm qua',
                submittedAt: '2024-01-14 16:00',
                status: 'Chờ xử lý',
                statusColor: 'bg-yellow-100 text-yellow-700',
                description: 'Giấy vụn từ văn phòng, đã được phân loại và đóng thùng.',
                contactPerson: 'Phạm Minh C',
                contactPhone: '0912345678',
                contactEmail: 'phamminhc@example.com',
                images: [],
                coordinates: { lat: 10.7719, lng: 106.7042 }
            },
            '4': {
                id: 4,
                code: 'REQ-2024-004',
                type: 'Điện tử',
                typeColor: 'bg-purple-100 text-purple-700',
                weight: '150 kg',
                location: 'Khu Công nghệ cao, Quận 9',
                fullAddress: '321 Đường GHI, Khu Công nghệ cao, Quận 9, TP.HCM',
                time: '2 ngày trước',
                submittedAt: '2024-01-13 10:00',
                status: 'Chờ xử lý',
                statusColor: 'bg-yellow-100 text-yellow-700',
                description: 'Thiết bị điện tử cũ cần tái chế, bao gồm máy tính, điện thoại và các linh kiện.',
                contactPerson: 'Hoàng Văn D',
                contactPhone: '0923456789',
                contactEmail: 'hoangvand@example.com',
                images: [
                    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop'
                ],
                coordinates: { lat: 10.8417, lng: 106.8099 }
            }
        };

        if (mockRequests[id]) {
            setRequestData(mockRequests[id]);
        }
    }, []);

    const handleBack = () => {
        window.history.pushState({}, '', '/enterprise');
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    const handleAccept = () => {
        // Handle accept logic here
        console.log('Accept request:', requestId);
        alert('Yêu cầu đã được chấp nhận!');
    };

    const handleReject = () => {
        // Handle reject logic here
        console.log('Reject request:', requestId);
        alert('Yêu cầu đã bị từ chối!');
    };

    if (!requestData) {
        return (
            <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
                <EnterpriseSidebar isOpen={isSidebarOpen} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-gray-500 mb-4">Đang tải thông tin...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <EnterpriseSidebar isOpen={isSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm font-medium">Quay lại</span>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Chi tiết yêu cầu thu gom</h1>
                            <p className="text-sm text-gray-600">Mã yêu cầu: {requestData.code}</p>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* Status Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">Thông tin yêu cầu</h2>
                                    <p className="text-sm text-gray-600">Ngày tạo: {requestData.submittedAt}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${requestData.statusColor}`}>
                                        {requestData.status}
                                    </span>
                                    <span className={`px-4 py-2 rounded-lg text-xs font-semibold ${requestData.typeColor}`}>
                                        {requestData.type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Main Info */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Basic Information */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin cơ bản</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Loại rác thải</label>
                                            <div className="mt-1">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${requestData.typeColor}`}>
                                                    {requestData.type}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Khối lượng</label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{requestData.weight}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Mô tả</label>
                                            <p className="mt-1 text-gray-700">{requestData.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location Information */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin địa điểm</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Địa điểm</label>
                                            <div className="mt-1 flex items-start gap-2">
                                                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <div>
                                                    <p className="text-gray-900 font-medium">{requestData.location}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{requestData.fullAddress}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-lg overflow-hidden border border-gray-200 h-64">
                                            <iframe
                                                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1234567890123!2d${requestData.coordinates.lng}!3d${requestData.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f5c8c8c8c8d%3A0x8c8c8c8c8c8c8c8c!2sHo%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s`}
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

                                {/* Images */}
                                {requestData.images && requestData.images.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Hình ảnh</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {requestData.images.map((image, index) => (
                                                <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
                                                    <img
                                                        src={image}
                                                        alt={`Hình ảnh ${index + 1}`}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Actions */}
                            <div className="space-y-6">
                                {/* Action Buttons */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Thao tác</h3>
                                    <div className="space-y-3">
                                        <button
                                            onClick={handleAccept}
                                            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                        >
                                            Chấp nhận yêu cầu
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                        >
                                            Từ chối yêu cầu
                                        </button>
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
                </div>
            </div>
        </div>
    );
};

export default ReportDetail;
