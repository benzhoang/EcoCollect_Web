import React, { useState, useEffect } from 'react';
import EnterpriseSidebar from '../../components/EnterpriseSidebar';
import AssignModal from '../../components/AssignModal';
import { getEnterpriseReportById, getWasteCategories } from '../../service/api';

const ReportDetail = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [requestId, setRequestId] = useState(null);
    const [requestData, setRequestData] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                // Lấy requestId từ URL
                const pathParts = window.location.pathname.split('/');
                const id = pathParts[pathParts.length - 1];
                setRequestId(id);

                setLoading(true);
                setError(null);

                // Gọi song song: chi tiết báo cáo + danh mục loại rác để map ID -> tên
                const [reportRes, wasteCategoriesRes] = await Promise.all([
                    getEnterpriseReportById(id),
                    getWasteCategories()
                ]);

                const apiReport = reportRes?.data;
                if (!apiReport) {
                    throw new Error('Không tìm thấy dữ liệu báo cáo');
                }

                // Chuẩn hóa danh sách waste category
                let rawCats = null;
                if (wasteCategoriesRes && typeof wasteCategoriesRes === 'object') {
                    rawCats = wasteCategoriesRes.data ?? wasteCategoriesRes;
                }
                const catItems = Array.isArray(rawCats)
                    ? rawCats
                    : Array.isArray(rawCats?.items)
                        ? rawCats.items
                        : [];

                const wasteCategoryMap = {};
                catItems.forEach((cat) => {
                    if (!cat || !cat.id) return;
                    wasteCategoryMap[cat.id] = cat.name || cat.code || cat.id;
                });

                const wasteTypeName = apiReport.wasteCategoryId
                    ? (wasteCategoryMap[apiReport.wasteCategoryId] || apiReport.wasteCategoryId)
                    : 'Không rõ';

                const status = apiReport.currentStatus || apiReport.status || 'PENDING';
                let statusLabel = 'Chờ xử lý';
                let statusColor = 'bg-yellow-100 text-yellow-700';
                switch (status) {
                    case 'IN_PROGRESS':
                        statusLabel = 'Đang thực hiện';
                        statusColor = 'bg-blue-100 text-blue-700';
                        break;
                    case 'COMPLETED':
                        statusLabel = 'Đã hoàn thành';
                        statusColor = 'bg-green-100 text-green-700';
                        break;
                    default:
                        break;
                }

                const createdAt = apiReport.createdAt ? new Date(apiReport.createdAt) : null;
                const createdText = createdAt
                    ? createdAt.toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })
                    : '';

                const mediaList = Array.isArray(apiReport.media) ? apiReport.media : [];
                const reportImages = mediaList
                    .filter(m => m.mediaType === 'REPORT_IMAGE')
                    .map(m => m.url)
                    .filter(Boolean);

                const mapped = {
                    id: apiReport.id,
                    code: apiReport.code || apiReport.id,
                    type: wasteTypeName,
                    typeColor: 'bg-blue-100 text-blue-700',
                    weight: apiReport.actualWeightKg != null ? `${apiReport.actualWeightKg} kg` : 'Đang cập nhật',
                    location: apiReport.addressText || 'Chưa có địa chỉ',
                    fullAddress: apiReport.addressText || 'Chưa có địa chỉ chi tiết',
                    time: createdText,
                    submittedAt: createdText,
                    status: statusLabel,
                    statusColor,
                    description: apiReport.description || 'Không có mô tả',
                    contactPerson: apiReport.contactName || 'Đang cập nhật',
                    contactPhone: apiReport.contactPhone || 'Đang cập nhật',
                    contactEmail: apiReport.contactEmail || '',
                    images: reportImages,
                    coordinates: (apiReport.latitude && apiReport.longitude)
                        ? { lat: apiReport.latitude, lng: apiReport.longitude }
                        : { lat: 10.8231, lng: 106.6297 },
                };

                setRequestData(mapped);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Đã xảy ra lỗi khi tải chi tiết báo cáo');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, []);

    const handleBack = () => {
        window.history.pushState({}, '', '/enterprise');
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    const handleAccept = () => {
        // TODO: Gọi API chấp nhận yêu cầu
        console.log('Accept request:', requestId);
        alert('Yêu cầu đã được chấp nhận!');
    };

    const handleReject = () => {
        // TODO: Gọi API từ chối yêu cầu
        console.log('Reject request:', requestId);
        alert('Yêu cầu đã bị từ chối!');
    };

    const handleOpenAssignModal = () => {
        setIsAssignModalOpen(true);
    };

    const handleCloseAssignModal = () => {
        setIsAssignModalOpen(false);
    };

    const handleAssignCollector = (collector) => {
        // TODO: Gọi API để giao nhiệm vụ cho collector đã chọn
        console.log('Assign request:', requestId, 'to collector:', collector);
        alert(`Đã giao yêu cầu cho collector: ${collector.name || collector.code || collector.id}`);
        setIsAssignModalOpen(false);
    };

    if (loading) {
        return (
            <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
                <EnterpriseSidebar isOpen={isSidebarOpen} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-gray-500 mb-2">Đang tải thông tin báo cáo...</div>
                        {requestId && (
                            <div className="text-xs text-gray-400">Mã báo cáo: {requestId}</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
                <EnterpriseSidebar isOpen={isSidebarOpen} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-md bg-white rounded-lg shadow-sm border border-red-200 p-6 text-center">
                        <h2 className="text-lg font-bold text-red-600 mb-2">Không thể tải chi tiết báo cáo</h2>
                        <p className="text-sm text-gray-700 mb-4">{error}</p>
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!requestData) {
        return (
            <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
                <EnterpriseSidebar isOpen={isSidebarOpen} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-gray-500 mb-4">Không có dữ liệu báo cáo.</div>
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
                                            onClick={handleOpenAssignModal}
                                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Giao việc cho collector
                                        </button>
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

            {/* Assign Modal */}
            <AssignModal
                show={isAssignModalOpen}
                onClose={handleCloseAssignModal}
                onAssign={handleAssignCollector}
            />
        </div>
    );
};

export default ReportDetail;
