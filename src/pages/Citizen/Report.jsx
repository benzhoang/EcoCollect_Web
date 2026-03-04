import React, { useState, useEffect } from 'react';
import { getCitizenReports, getWasteCategories } from '../../service/api';

const Report = () => {
    const [activeFilter, setActiveFilter] = useState('Tất cả');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('Mới nhất');
    const [reports, setReports] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            const statusConfig = getStatusConfig(item.currentStatus);
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
                const response = await getCitizenReports(0, 20, [sortParam]);
                const pageData = response?.data || {};
                const apiReports = pageData.content || [];
                const uiReports = transformReportsFromApi(apiReports);
                setReports(uiReports);
            } catch (err) {
                setError(err.message || 'Không thể tải danh sách báo cáo');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [sortBy, categoryMap]);

    const filterTabs = ['Tất cả', 'Chờ xử lý', 'Tiếp nhận', 'Phân công', 'Thu gom'];

    // Lọc báo cáo theo filter
    const filteredReports = reports.filter(report => {
        if (activeFilter === 'Tất cả') return true;
        if (activeFilter === 'Chờ xử lý') return report.status === 'Chờ xử lý';
        if (activeFilter === 'Tiếp nhận') return report.status === 'Đã tiếp nhận';
        if (activeFilter === 'Phân công') return report.status === 'Đã phân công';
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
                                <div className="text-2xl font-bold text-gray-900">6</div>
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
                                <div className="text-2xl font-bold text-gray-900">1</div>
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
                                <div className="text-2xl font-bold text-gray-900">2</div>
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
                                <div className="text-2xl font-bold text-gray-900">65</div>
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
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
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
                            onClick={() => setActiveFilter(tab)}
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
                                                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default Report;
