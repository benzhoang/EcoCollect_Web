import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { cancelCitizenReport, getCitizenPointsBalance, getCitizenReports, getWasteCategories } from '../../service/api';
import CancelModal from '../../components/CancelModal';

const Report = () => {
    const [activeFilter, setActiveFilter] = useState('Tất cả');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('Mới nhất');
    const [reports, setReports] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5;
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [cancelSubmitting, setCancelSubmitting] = useState(false);
    const [rewardPoints, setRewardPoints] = useState(0);
    const [rewardPointsLoading, setRewardPointsLoading] = useState(false);

    const getSortParam = (sortLabel) => {
        switch (sortLabel) {
            case 'Mới nhất':
                return 'createdAt,desc';
            case 'Cũ nhất':
                return 'createdAt,asc';
            case 'Điểm cao nhất':
                return 'createdAt,desc'; // Tạm thời vẫn sort theo thời gian
            case 'Điểm thấp nhất':
                return 'createdAt,asc';
            default:
                return 'createdAt,desc';
        }
    };

    const getStatusConfig = (status) => {
        const upperStatus = (status || '').toUpperCase();
        switch (upperStatus) {
            case 'PENDING':
                return {
                    label: 'Chờ xử lý',
                    color: 'bg-orange-100 text-orange-700',
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            case 'RECEIVED':
                return {
                    label: 'Đã tiếp nhận',
                    color: 'bg-orange-100 text-orange-700',
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )
                };
            case 'ASSIGNED':
                return {
                    label: 'Đã phân công',
                    color: 'bg-blue-100 text-blue-700',
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    )
                };
            case 'ON_THE_WAY':
                return {
                    label: 'Đang trên đường',
                    color: 'bg-purple-100 text-purple-700',
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            case 'COLLECTED':
                return {
                    label: 'Đã thu gom',
                    color: 'bg-green-100 text-green-700',
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )
                };
            case 'REJECTED':
                return {
                    label: 'Từ chối',
                    color: 'bg-red-100 text-red-700',
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )
                };
            case 'CANCELLED':
            case 'CANCELED':
                return {
                    label: 'Hủy bỏ',
                    color: 'bg-gray-100 text-gray-700',
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )
                };
            case 'ACCEPTED':
                return {
                    label: 'Chấp thuận',
                    color: 'bg-green-100 text-green-700',
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )
                };
            default:
                return {
                    label: status || 'Không xác định',
                    color: 'bg-gray-100 text-gray-700',
                    icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
        }
    };

    const transformReportsFromApi = (apiReports) => {
        if (!Array.isArray(apiReports)) return [];
        return apiReports.map((item) => {
            const rawStatus = (item.currentStatus || '').toUpperCase();
            const statusConfig = getStatusConfig(rawStatus);
            const mediaList = Array.isArray(item.media) ? item.media : [];
            const imageMedia = mediaList.find(m => m.mediaType === 'REPORT_IMAGE') || mediaList[0];
            const imageUrl = imageMedia?.url || 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop';

            const wasteCategoryId = item.wasteCategoryId;
            const wasteCategoryName = wasteCategoryId ? categoryMap[wasteCategoryId] : null;
            const displayWasteType = wasteCategoryName || 'Rác thải';

            const createdAt = item.createdAt ? new Date(item.createdAt) : null;
            const dateText = createdAt
                ? createdAt.toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })
                : '';

            return {
                id: item.id,
                rawStatus,
                wasteType: displayWasteType,
                wasteTypeColor: 'bg-gray-100 text-gray-700',
                status: statusConfig.label,
                statusColor: statusConfig.color,
                statusIcon: statusConfig.icon,
                address: item.addressText || 'Chưa có địa chỉ',
                date: dateText,
                points: 'Đang cập nhật',
                pointsColor: 'text-gray-600',
                image: imageUrl
            };
        });
    };

    useEffect(() => {
        const fetchWasteCategories = async () => {
            try {
                const response = await getWasteCategories();
                const data = response?.data || [];
                if (Array.isArray(data)) {
                    const map = {};
                    data.forEach((cat) => {
                        if (cat && cat.id) {
                            map[cat.id] = cat.name || cat.displayName || 'Rác thải';
                        }
                    });
                    setCategoryMap(map);
                }
            } catch (err) {
                console.error('Không thể tải danh sách loại rác:', err);
            }
        };

        fetchWasteCategories();
    }, []);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            setError('');
            try {
                const sortParam = getSortParam(sortBy);
                const response = await getCitizenReports(page, pageSize, [sortParam]);
                const pageData = response?.data || {};
                const apiReports = pageData.content || [];
                const uiReports = transformReportsFromApi(apiReports);
                setReports(uiReports);
                const total = Number(pageData.totalPages ?? 1) || 1;
                setTotalPages(total);
            } catch (err) {
                const rawMessage = err?.message || '';
                const isUnauthorized = rawMessage.toLowerCase().includes('unauthorized');
                const friendlyMessage = isUnauthorized
                    ? 'Vui lòng đăng nhập để xem báo cáo của bạn và theo dõi tình trạng xử lý.'
                    : rawMessage || 'Không thể tải danh sách báo cáo';
                setError(friendlyMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [sortBy, categoryMap, page]);

    useEffect(() => {
        const fetchRewardPoints = async () => {
            try {
                setRewardPointsLoading(true);
                const response = await getCitizenPointsBalance();
                const payload = response?.data ?? response;
                const currentPoints = Number(payload?.currentPoints ?? 0);
                setRewardPoints(currentPoints);
            } catch (err) {
                console.error('Không thể tải điểm thưởng:', err);
                setRewardPoints(0);
            } finally {
                setRewardPointsLoading(false);
            }
        };

        fetchRewardPoints();
    }, []);

    const filterTabs = ['Tất cả', 'Chờ xử lý', 'Chấp thuận', 'Đã phân công', 'Đang trên đường', 'Từ chối', 'Hủy bỏ', 'Thu gom'];

    const openCancelModal = (id) => {
        setSelectedReportId(id);
        setCancelModalOpen(true);
    };

    const closeCancelModal = () => {
        if (cancelSubmitting) return;
        setCancelModalOpen(false);
        setSelectedReportId(null);
    };

    const handleConfirmCancelReport = async (reason) => {
        if (!selectedReportId) return;

        try {
            setCancelSubmitting(true);
            await cancelCitizenReport(selectedReportId, reason);
            const cancelledConfig = getStatusConfig('CANCELLED');
            setReports((prev) =>
                prev.map((r) =>
                    r.id === selectedReportId
                        ? {
                            ...r,
                            rawStatus: 'CANCELLED',
                            status: cancelledConfig.label,
                            statusColor: cancelledConfig.color,
                            statusIcon: cancelledConfig.icon,
                        }
                        : r
                )
            );
            toast.success('Đã hủy báo cáo thành công!', { duration: 2500 });
            setCancelModalOpen(false);
            setSelectedReportId(null);
        } catch (err) {
            console.error(err);
            toast.error(err?.message || 'Không thể hủy báo cáo. Vui lòng thử lại.', { duration: 3500 });
        } finally {
            setCancelSubmitting(false);
        }
    };

    // Lọc báo cáo theo filter
    const filteredReports = reports.filter(report => {
        if (activeFilter === 'Tất cả') return true;
        if (activeFilter === 'Chờ xử lý') return report.status === 'Chờ xử lý';
        if (activeFilter === 'Chấp thuận') return report.status === 'Chấp thuận';
        if (activeFilter === 'Đã phân công') return report.status === 'Đã phân công';
        if (activeFilter === 'Đang trên đường') return report.status === 'Đang trên đường';
        if (activeFilter === 'Từ chối') return report.status === 'Từ chối';
        if (activeFilter === 'Hủy bỏ') return report.status === 'Hủy bỏ';
        if (activeFilter === 'Thu gom') return report.status === 'Đã thu gom';
        return true;
    });

    // Tìm kiếm
    const searchedReports = filteredReports.filter(report => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return report.address.toLowerCase().includes(query) ||
            report.wasteType.toLowerCase().includes(query);
    });

    const hasPrevPage = page > 0;
    const hasNextPage = page + 1 < totalPages;

    const totalReports = reports.length;
    const pendingReports = reports.filter((r) => r.rawStatus === 'PENDING').length;
    const collectedReports = reports.filter((r) => r.rawStatus === 'COLLECTED').length;

    return (
        <div className="min-h-screen w-full bg-green-50 m-0 p-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Báo cáo của tôi</h1>
                            <p className="text-sm text-gray-600 mt-1">Quản lý và theo dõi các báo cáo rác thải</p>
                        </div>
                        <a
                            href="/report/create"
                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tạo báo cáo
                        </a>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{totalReports}</div>
                                <div className="text-xs text-gray-600">Tổng báo cáo</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{pendingReports}</div>
                                <div className="text-xs text-gray-600">Đang chờ</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{collectedReports}</div>
                                <div className="text-xs text-gray-600">Đã thu gom</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {rewardPointsLoading ? '...' : rewardPoints}
                                </div>
                                <div className="text-xs text-gray-600">Điểm thưởng</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Sort Section */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo địa chỉ hoặc loại rác..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(0);
                            }}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setPage(0);
                            }}
                            className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white cursor-pointer"
                        >
                            <option>Mới nhất</option>
                            <option>Cũ nhất</option>
                            <option>Điểm cao nhất</option>
                            <option>Điểm thấp nhất</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveFilter(tab);
                                setPage(0);
                            }}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeFilter === tab
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Reports List */}
                {error && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="text-center py-8 text-sm text-gray-600">
                        Đang tải danh sách báo cáo...
                    </div>
                )}

                {!loading && (
                    <>
                        <div className="space-y-4">
                            {searchedReports.map((report) => (
                                <a
                                    key={report.id}
                                    href={`/report/${report.id}`}
                                    className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                                                <img
                                                    src={report.image}
                                                    alt={report.wasteType}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${report.wasteTypeColor}`}>
                                                        {report.wasteType}
                                                    </span>
                                                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${report.statusColor} flex items-center gap-1`}>
                                                        {report.statusIcon}
                                                        {report.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    {report.rawStatus === 'PENDING' && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                openCancelModal(report.id);
                                                            }}
                                                            className="text-red-500 hover:text-red-600"
                                                            title="Hủy báo cáo"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-3h4m-6 0h8m-9 3h10" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 font-medium mb-1">
                                                {report.address}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500">
                                                    {report.date}
                                                </span>
                                                <span className={`text-sm font-semibold ${report.pointsColor}`}>
                                                    {report.points}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {searchedReports.length === 0 && !error && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600">Không tìm thấy báo cáo nào</p>
                            </div>
                        )}

                        {totalPages > 1 && !error && (
                            <div className="flex items-center justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                                    disabled={!hasPrevPage}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${hasPrevPage
                                        ? 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        }`}
                                >
                                    Trang trước
                                </button>
                                <div className="text-sm text-gray-600">
                                    Trang {page + 1} / {totalPages}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                                    disabled={!hasNextPage}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${hasNextPage
                                        ? 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        }`}
                                >
                                    Trang sau
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <CancelModal
                show={cancelModalOpen}
                onClose={closeCancelModal}
                onConfirm={handleConfirmCancelReport}
                loading={cancelSubmitting}
            />
        </div>
    );
};

export default Report;
