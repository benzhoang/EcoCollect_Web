import React, { useState, useEffect } from 'react';
import EnterpriseSidebar from '../../components/EnterpriseSidebar';
import FilterEnterpriseModal from '../../components/FilterEnterpriseModal';
import { getEnterpriseReports, getWasteCategories } from '../../service/api';

const EnterpriseHomePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('Tất cả');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterAreaId, setFilterAreaId] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [wasteCategoryMap, setWasteCategoryMap] = useState({});
    const [pageInfo, setPageInfo] = useState({
        page: 0,
        size: 5,
        totalElements: 0,
        totalPages: 1,
    });

    const itemsPerPage = 5;

    const getStatusConfig = (status) => {
        const upperStatus = (status || '').toUpperCase();
        switch (upperStatus) {
            case 'PENDING':
                return { label: 'Chờ xử lý', color: 'bg-orange-100 text-orange-700' };
            case 'ACCEPTED':
                return { label: 'Chấp thuận', color: 'bg-green-100 text-green-700' };
            case 'ASSIGNED':
                return { label: 'Đã phân công', color: 'bg-blue-100 text-blue-700' };
            case 'ON_THE_WAY':
                return { label: 'Đang trên đường', color: 'bg-purple-100 text-purple-700' };
            case 'COLLECTED':
                return { label: 'Đã thu gom', color: 'bg-green-100 text-green-700' };
            case 'REJECTED':
                return { label: 'Từ chối', color: 'bg-red-100 text-red-700' };
            case 'CANCELLED':
            case 'CANCELED':
                return { label: 'Hủy bỏ', color: 'bg-gray-100 text-gray-700' };
            default:
                return { label: status || 'Không rõ', color: 'bg-gray-100 text-gray-700' };
        }
    };

    // Lấy danh mục loại rác để map ID -> tên loại rác
    useEffect(() => {
        const fetchWasteCategories = async () => {
            try {
                const response = await getWasteCategories();

                // Swagger: { success, code, message, data: [...], timestamp }
                let rawData = null;
                if (response && typeof response === 'object') {
                    rawData = response.data ?? response;
                }

                const items = Array.isArray(rawData)
                    ? rawData
                    : Array.isArray(rawData?.items)
                        ? rawData.items
                        : [];

                const map = {};
                items.forEach((cat) => {
                    if (!cat || !cat.id) return;
                    map[cat.id] = cat.name || cat.code || cat.id;
                });
                setWasteCategoryMap(map);
            } catch (err) {
                console.error('Không thể tải danh mục loại rác:', err);
            }
        };

        fetchWasteCategories();
    }, []);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                setError(null);
                // API dùng page index 0-based, còn UI dùng 1-based
                const res = await getEnterpriseReports(currentPage - 1, itemsPerPage, ['createdAt,desc']);
                const pageData = res?.data || {};
                const list = Array.isArray(pageData.content) ? pageData.content : [];
                const mapped = list.map((report) => {
                    const statusConfig = getStatusConfig(report.currentStatus);
                    return {
                        ...report,
                        statusLabel: statusConfig.label,
                        statusColor: statusConfig.color,
                        rawStatus: (report.currentStatus || '').toUpperCase(),
                    };
                });
                setReports(mapped);
                setPageInfo({
                    page: pageData.page ?? (currentPage - 1),
                    size: pageData.size ?? itemsPerPage,
                    totalElements: pageData.totalElements ?? list.length,
                    totalPages: pageData.totalPages ?? 1,
                });
            } catch (err) {
                setError(err?.message || 'Không thể tải danh sách báo cáo');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [currentPage, itemsPerPage]);

    const totalPages = pageInfo.totalPages || 1;

    const getWasteCategoryName = (id) => {
        if (!id) return 'Không rõ';
        return wasteCategoryMap[id] || id || 'Không rõ';
    };

    const handleViewDetail = (requestId) => {
        window.history.pushState({}, '', `/enterprise/report/${requestId}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    const handleFilterApply = (filters) => {
        setFilterAreaId(filters.areaId || '');
        setFilterStatus(filters.status || '');
    };

    const summaryStats = reports.reduce(
        (acc, report) => {
            if (report.rawStatus === 'PENDING') acc.pending += 1;
            if (['ACCEPTED', 'ASSIGNED', 'ON_THE_WAY', 'COLLECTED'].includes(report.rawStatus)) {
                acc.received += 1;
            }
            const weightValue = Number(report.estimatedWeightKg ?? report.actualWeightKg ?? 0) || 0;
            acc.totalWeightKg += weightValue;
            return acc;
        },
        { pending: 0, received: 0, totalWeightKg: 0 }
    );

    const formatWeightDisplay = (kg) => {
        if (!kg) return '0 kg';
        if (kg >= 1000) {
            return `${(kg / 1000).toFixed(1)}t`;
        }
        return `${kg.toFixed(0)} kg`;
    };

    const filterTabs = ['Tất cả', 'Chờ xử lý', 'Chấp thuận', 'Đã phân công', 'Đang trên đường', 'Từ chối', 'Hủy bỏ', 'Thu gom'];

    const filteredReports = reports.filter((report) => {
        if (activeTab === 'Tất cả') return true;
        if (activeTab === 'Chờ xử lý') return report.statusLabel === 'Chờ xử lý';
        if (activeTab === 'Chấp thuận') return report.statusLabel === 'Chấp thuận';
        if (activeTab === 'Đã phân công') return report.statusLabel === 'Đã phân công';
        if (activeTab === 'Đang trên đường') return report.statusLabel === 'Đang trên đường';
        if (activeTab === 'Từ chối') return report.statusLabel === 'Từ chối';
        if (activeTab === 'Hủy bỏ') return report.statusLabel === 'Hủy bỏ';
        if (activeTab === 'Thu gom') return report.statusLabel === 'Đã thu gom';
        return true;
    });

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <EnterpriseSidebar isOpen={isSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý yêu cầu thu gom</h1>
                            <p className="text-sm text-gray-600">Theo dõi và phê duyệt các yêu cầu thu gom rác thải mới nhất.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm mã yêu cầu, địa điểm..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-80"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Left Content - Request Table */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Tabs */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex flex-wrap gap-2">
                                {filterTabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === tab
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            {/* <button
                                onClick={() => setIsFilterModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Lọc dữ liệu</span>
                            </button> */}
                        </div>

                        {/* Request Table */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">LOẠI RÁC THẢI</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">KHỐI LƯỢNG</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ĐỊA ĐIỂM</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">TRẠNG THÁI</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">THAO TÁC</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loading && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Đang tải danh sách báo cáo...
                                                </td>
                                            </tr>
                                        )}
                                        {!loading && error && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-red-500">
                                                    {error}
                                                </td>
                                            </tr>
                                        )}
                                        {!loading && !error && filteredReports.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Không có báo cáo nào.
                                                </td>
                                            </tr>
                                        )}
                                        {!loading && !error && filteredReports.map((report) => (
                                            <tr key={report.reportId} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                        {getWasteCategoryName(report.wasteCategoryId)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {report.estimatedWeightKg != null ? `${report.estimatedWeightKg} kg` : '—'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="text-sm text-gray-700">
                                                            {report.addressText || 'Không có địa chỉ'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${report.statusColor}`}>
                                                        {report.statusLabel}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button
                                                        onClick={() => handleViewDetail(report.reportId)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                    >
                                                        View Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    {pageInfo.totalElements > 0 ? (
                                        <>
                                            Hiển thị {pageInfo.page * pageInfo.size + 1}
                                            -
                                            {pageInfo.page * pageInfo.size + filteredReports.length} của {pageInfo.totalElements} yêu cầu
                                        </>
                                    ) : (
                                        'Không có yêu cầu nào'
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => setCurrentPage(index + 1)}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === index + 1
                                                ? 'bg-green-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto p-6 space-y-6">
                        {/* Today's Overview */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">TỔNG QUAN</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-4">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">{pageInfo.totalElements}</div>
                                    <div className="text-xs text-gray-600">Tổng yêu cầu</div>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">{formatWeightDisplay(summaryStats.totalWeightKg)}</div>
                                    <div className="text-xs text-gray-600">Ước tính khối lượng</div>
                                </div>
                            </div>
                        </div>

                        {/* Dispatch Map */}
                        <div className="bg-white border border-gray-200 rounded-lg p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <h3 className="text-lg font-bold text-gray-900">BẢN ĐỒ ĐIỀU PHỐI</h3>
                            </div>
                            <div className="rounded-lg h-48 mb-3 overflow-hidden border border-gray-200">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31355.873315876!2d106.6297!3d10.8231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f5c8c8c8c8d%3A0x8c8c8c8c8c8c8c8c!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Bản đồ điều phối"
                                ></iframe>
                            </div>
                            <p className="text-xs text-gray-600">Theo dõi xe thu gom theo thời gian thực</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            <FilterEnterpriseModal
                show={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleFilterApply}
                initialAreaId={filterAreaId}
                initialStatus={filterStatus}
            />
        </div>
    );
};

export default EnterpriseHomePage;
