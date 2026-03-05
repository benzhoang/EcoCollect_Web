import React, { useState, useEffect } from 'react';
import { getCitizenReportById, getWasteCategories } from '../../service/api';

const ReportDetail = () => {
    const [reportId, setReportId] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleString('vi-VN');
        } catch {
            return dateString;
        }
    };

    const getStatusInfo = (status) => {
        const normalized = (status || '').toUpperCase();
        switch (normalized) {
            case 'PENDING':
                return { label: 'Chờ xử lý', color: 'bg-orange-100 text-orange-700' };
            case 'ASSIGNED':
                return { label: 'Đã phân công', color: 'bg-blue-100 text-blue-700' };
            case 'COLLECTED':
                return { label: 'Đã thu gom', color: 'bg-green-100 text-green-700' };
            case 'REJECTED':
                return { label: 'Từ chối', color: 'bg-red-100 text-red-700' };
            default:
                return { label: status || 'Không xác định', color: 'bg-gray-100 text-gray-700' };
        }
    };

    useEffect(() => {
        const fetchReportDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                // Lấy reportId từ URL
                const pathParts = window.location.pathname.split('/');
                const id = pathParts[pathParts.length - 1];
                setReportId(id);

                const [reportResponse, categoryResponse] = await Promise.all([
                    getCitizenReportById(id),
                    getWasteCategories()
                ]);
                // response theo format: { success, code, message, data, timestamp }
                const apiReport = reportResponse?.data;

                if (!apiReport) {
                    throw new Error('Không tìm thấy dữ liệu báo cáo');
                }

                const categoryList = categoryResponse?.data || [];
                const categoryMap = {};
                if (Array.isArray(categoryList)) {
                    categoryList.forEach((cat) => {
                        if (cat && cat.id) {
                            categoryMap[cat.id] = cat.name || cat.displayName || 'Rác thải';
                        }
                    });
                }

                const wasteTypeName = apiReport.wasteCategoryId
                    ? (categoryMap[apiReport.wasteCategoryId] || 'Rác thải')
                    : 'Rác thải';

                const statusInfo = getStatusInfo(apiReport.currentStatus);

                // Map dữ liệu backend -> cấu trúc UI hiện tại
                const mappedReport = {
                    id: apiReport.id,
                    wasteType: wasteTypeName,
                    wasteTypeColor: 'bg-blue-100 text-blue-700',
                    status: statusInfo.label,
                    statusColor: statusInfo.color,
                    address: apiReport.addressText || 'Chưa có địa chỉ',
                    fullAddress: apiReport.addressText || 'Chưa có địa chỉ chi tiết',
                    date: formatDateTime(apiReport.createdAt),
                    submittedAt: formatDateTime(apiReport.createdAt),
                    points: apiReport.rewardPoints != null ? `+${apiReport.rewardPoints} điểm` : 'Chưa có điểm',
                    pointsColor: apiReport.rewardPoints > 0 ? 'text-green-600' : 'text-gray-600',
                    image: Array.isArray(apiReport.media) && apiReport.media.length > 0 ? apiReport.media[0].url : null,
                    description: apiReport.description || 'Không có mô tả',
                    coordinates: (apiReport.latitude && apiReport.longitude)
                        ? { lat: apiReport.latitude, lng: apiReport.longitude }
                        : { lat: 10.7769, lng: 106.7009 }, // fallback HCM
                    latitude: apiReport.latitude || null,
                    longitude: apiReport.longitude || null,
                    estimatedWeightKg: apiReport.estimatedWeightKg || null,
                };

                setReportData(mappedReport);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Đã xảy ra lỗi khi tải chi tiết báo cáo');
            } finally {
                setLoading(false);
            }
        };

        fetchReportDetail();
    }, []);

    const handleBack = () => {
        window.history.pushState({}, '', '/report');
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-green-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="text-gray-500 mb-4">Đang tải thông tin...</div>
                        {reportId && (
                            <div className="text-xs text-gray-400">Mã báo cáo: #{reportId}</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-green-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md border border-red-200 p-6 text-center">
                        <h2 className="text-lg font-bold text-red-600 mb-2">Không thể tải chi tiết báo cáo</h2>
                        <p className="text-sm text-gray-700 mb-4">{error}</p>
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                            Quay lại danh sách báo cáo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!reportData) {
        return (
            <div className="min-h-screen bg-green-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="text-gray-500 mb-4">Không có dữ liệu báo cáo.</div>
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
                                {reportData.estimatedWeightKg != null && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Trọng lượng ước tính</label>
                                        <p className="mt-1 text-gray-900 font-medium">{reportData.estimatedWeightKg} kg</p>
                                    </div>
                                )}
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
                                {(reportData.latitude != null || reportData.longitude != null) && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {reportData.latitude != null && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Vĩ độ (Latitude)</label>
                                                <p className="mt-1 text-gray-900 font-medium">{reportData.latitude}</p>
                                            </div>
                                        )}
                                        {reportData.longitude != null && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Kinh độ (Longitude)</label>
                                                <p className="mt-1 text-gray-900 font-medium">{reportData.longitude}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
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
