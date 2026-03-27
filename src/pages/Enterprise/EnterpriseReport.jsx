import React, { useState, useEffect } from 'react';
import EnterpriseSidebar from '../../components/EnterpriseSidebar';
import { getEnterpriseStatisticsOverview, getWasteCategories, getAreaTree, getEnterpriseReports } from '../../service/api';
import { downloadEnterprisePdfReport, getEnterpriseFallbackRows } from '../../components/PDFReport';

const EnterpriseReport = () => {
    const [isSidebarOpen] = useState(true);
    const [timeFilter, setTimeFilter] = useState('month'); // day, week, month, year
    const [wasteTypeFilter, setWasteTypeFilter] = useState('all');
    const [areaFilter, setAreaFilter] = useState('all');
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    // Dữ liệu mẫu
    const [reportData, setReportData] = useState({
        totalCollected: 0,
        totalRecycled: 0,
        totalReportsReceived: 0,
        totalReportsCompleted: 0,
        totalAcceptedWasteCategories: 0,
        byType: [],
        byArea: [],
        byTime: []
    });

    const [wasteTypes, setWasteTypes] = useState([
        { value: 'all', label: 'Tất cả loại' }
    ]);
    const [isWasteTypesLoading, setIsWasteTypesLoading] = useState(false);

    const [areas, setAreas] = useState([
        { value: 'all', label: 'Tất cả khu vực' }
    ]);
    const [isAreasLoading, setIsAreasLoading] = useState(false);

    const [reportRows, setReportRows] = useState([]);
    const [isReportsLoading, setIsReportsLoading] = useState(false);
    const [reportsError, setReportsError] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        // Simulate data fetching for charts/tables
        const generateReportData = () => {
            const sampleByType = wasteTypes
                .filter((type) => type.value !== 'all')
                .map((type, index) => {
                    const base = 300 + index * 120;
                    const collected = base + (index % 3) * 80;
                    const recycled = Math.floor(collected * (0.8 + (index % 3) * 0.05));
                    const percentage = collected > 0 ? Math.round((recycled / collected) * 100) : 0;

                    return {
                        type: type.value,
                        collected,
                        recycled,
                        percentage
                    };
                });

            const sampleByArea = areas
                .filter((area) => area.value !== 'all')
                .map((area, index) => {
                    const base = 400 + index * 150;
                    const collected = base + (index % 4) * 90;
                    const recycled = Math.floor(collected * (0.78 + (index % 4) * 0.05));

                    return {
                        area: area.value,
                        name: area.label,
                        collected,
                        recycled
                    };
                });

            const sampleByTime = [
                { date: '2024-01-01', collected: 450, recycled: 400 },
                { date: '2024-01-02', collected: 520, recycled: 460 },
                { date: '2024-01-03', collected: 480, recycled: 430 },
                { date: '2024-01-04', collected: 550, recycled: 490 },
                { date: '2024-01-05', collected: 500, recycled: 450 },
                { date: '2024-01-06', collected: 530, recycled: 480 },
                { date: '2024-01-07', collected: 510, recycled: 460 }
            ];

            setReportData((prev) => ({
                ...prev,
                byType: sampleByType,
                byArea: sampleByArea,
                byTime: sampleByTime
            }));
        };

        const fetchOverview = async () => {
            try {
                const rangeMap = {
                    day: 'DAY',
                    week: 'WEEK',
                    month: 'MONTH',
                    year: 'YEAR'
                };
                const response = await getEnterpriseStatisticsOverview({
                    range: rangeMap[timeFilter] || 'MONTH'
                });
                const data = response?.data ?? response;

                setReportData((prev) => ({
                    ...prev,
                    totalReportsReceived: Number(data?.totalReportsReceived ?? 0),
                    totalRecycled: Number(data?.totalRecycledWeightKg ?? prev.totalRecycled ?? 0),
                    totalReportsCompleted: Number(data?.totalCompletedReports ?? 0),
                    totalCollected: Number(data?.totalRecycledWeightKg ?? prev.totalCollected ?? 0),
                    byType: prev.byType,
                    byArea: prev.byArea,
                    byTime: prev.byTime,
                    totalAcceptedWasteCategories: Number(data?.totalAcceptedWasteCategories ?? prev.byType?.length ?? 0)
                }));
            } catch (error) {
                console.error('Không thể tải thống kê tổng quan:', error);
            }
        };

        generateReportData();
        fetchOverview();
    }, [timeFilter, wasteTypeFilter, areaFilter, dateRange, wasteTypes, areas]);

    useEffect(() => {
        const loadWasteCategories = async () => {
            try {
                setIsWasteTypesLoading(true);
                const response = await getWasteCategories();
                const raw = response?.data ?? response;
                const items = Array.isArray(raw)
                    ? raw
                    : Array.isArray(raw?.items)
                        ? raw.items
                        : [];

                const mapped = items
                    .filter((c) => c && c.id)
                    .map((c) => ({
                        id: c.id,
                        value: c.code || c.name || c.id,
                        label: c.name || c.displayName || c.code || 'Rác thải',
                        color: 'bg-gray-100 text-gray-700'
                    }));

                setWasteTypes([{ value: 'all', label: 'Tất cả loại' }, ...mapped]);
            } catch (error) {
                console.error('Không thể tải danh sách loại rác:', error);
                setWasteTypes([{ value: 'all', label: 'Tất cả loại' }]);
            } finally {
                setIsWasteTypesLoading(false);
            }
        };

        loadWasteCategories();
    }, []);

    useEffect(() => {
        const loadAreas = async () => {
            try {
                setIsAreasLoading(true);
                const response = await getAreaTree();
                const raw = response?.data ?? response;
                const roots = Array.isArray(raw) ? raw : raw ? [raw] : [];
                const wards = [];

                const collectWards = (nodes) => {
                    nodes.forEach((node) => {
                        const children = Array.isArray(node?.children) ? node.children : [];
                        if (!children.length && node?.id) {
                            wards.push({
                                value: node.id,
                                label: node.name || 'Khu vực'
                            });
                        } else if (children.length) {
                            collectWards(children);
                        }
                    });
                };

                collectWards(roots);

                setAreas([{ value: 'all', label: 'Tất cả khu vực' }, ...wards.slice(0, 7)]);
            } catch (error) {
                console.error('Không thể tải danh sách khu vực:', error);
                setAreas([{ value: 'all', label: 'Tất cả khu vực' }]);
            } finally {
                setIsAreasLoading(false);
            }
        };

        loadAreas();
    }, []);

    useEffect(() => {
        const loadReports = async () => {
            try {
                setIsReportsLoading(true);
                setReportsError(null);
                const response = await getEnterpriseReports(0, 50, ['createdAt,desc']);
                const pageData = response?.data || {};
                const list = Array.isArray(pageData.content) ? pageData.content : [];
                const collected = list.filter((report) => String(report?.currentStatus || '').toUpperCase() === 'COLLECTED');

                const mapped = collected.map((report) => {
                    const statusConfig = getStatusConfig(report?.currentStatus);
                    const weightValue = Number(report?.actualWeightKg ?? report?.estimatedWeightKg ?? 0) || 0;

                    return {
                        id: report.id,
                        wasteCategoryId: report.wasteCategoryId,
                        areaId: report.areaId,
                        addressText: report.addressText,
                        weightKg: weightValue,
                        statusLabel: statusConfig.label,
                        statusColor: statusConfig.color,
                        date: report.collectedAt || report.completedAt || report.updatedAt || report.createdAt
                    };
                });

                setReportRows(mapped);
            } catch (error) {
                console.error('Không thể tải danh sách báo cáo:', error);
                setReportsError(error?.message || 'Không thể tải danh sách báo cáo');
                setReportRows([]);
            } finally {
                setIsReportsLoading(false);
            }
        };

        loadReports();
    }, []);

    const getWasteTypeLabel = (type) => {
        const found = wasteTypes.find(t => t.value === type || t.id === type);
        return found ? found.label : type;
    };

    const getWasteTypeColor = (type) => {
        const found = wasteTypes.find(t => t.value === type || t.id === type);
        return found ? found.color : 'bg-gray-100 text-gray-700';
    };

    const getAreaLabel = (id) => {
        const found = areas.find((a) => a.value === id);
        return found ? found.label : 'Không rõ';
    };

    const getStatusConfig = (status) => {
        const upperStatus = String(status || '').toUpperCase();
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

    const formatNumber = (num) => {
        return num.toLocaleString('vi-VN');
    };

    const getMaxValue = (data, key) => {
        return Math.max(...data.map(item => item[key]), 0);
    };

    const handleExportReport = () => {
        try {
            setIsExporting(true);

            const rowsForPdf = reportRows.length
                ? reportRows.map((row) => ({
                    wasteType: getWasteTypeLabel(row.wasteCategoryId),
                    area: row.addressText || getAreaLabel(row.areaId),
                    weightKg: row.weightKg,
                    status: row.statusLabel,
                    date: row.date
                }))
                : getEnterpriseFallbackRows();

            downloadEnterprisePdfReport({
                generatedAt: new Date(),
                filters: {
                    timeFilter,
                    startDate: dateRange.start,
                    endDate: dateRange.end,
                    wasteType: wasteTypeFilter === 'all' ? 'Tat ca loai' : getWasteTypeLabel(wasteTypeFilter),
                    area: areaFilter === 'all' ? 'Tat ca khu vuc' : getAreaLabel(areaFilter)
                },
                summary: {
                    totalReportsReceived: reportData.totalReportsReceived,
                    totalRecycled: reportData.totalRecycled,
                    totalReportsCompleted: reportData.totalReportsCompleted,
                    totalAcceptedWasteCategories: reportData.totalAcceptedWasteCategories || reportData.byType.length
                },
                rows: rowsForPdf
            });
        } catch (error) {
            console.error('Khong the xuat bao cao PDF:', error);
            window.alert('Khong the xuat bao cao PDF. Vui long thu lai.');
        } finally {
            setIsExporting(false);
        }
    };

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
                            <h1 className="text-2xl font-bold text-gray-900">Báo cáo thống kê</h1>
                            <p className="text-sm text-gray-600">Theo dõi khối lượng rác đã thu gom và tái chế</p>
                        </div>
                    </div>
                    <button
                        onClick={handleExportReport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{isExporting ? 'Đang xuất...' : 'Xuất báo cáo'}</span>
                    </button>
                </header>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Time Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                                <select
                                    value={timeFilter}
                                    onChange={(e) => setTimeFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="day">Theo ngày</option>
                                    <option value="week">Theo tuần</option>
                                    <option value="month">Theo tháng</option>
                                    <option value="year">Theo năm</option>
                                </select>
                            </div>

                            {/* Date Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Waste Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Loại rác</label>
                                <select
                                    value={wasteTypeFilter}
                                    onChange={(e) => setWasteTypeFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    disabled={isWasteTypesLoading}
                                >
                                    {isWasteTypesLoading && (
                                        <option value="all">Đang tải...</option>
                                    )}
                                    {!isWasteTypesLoading && wasteTypes.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Area Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực</label>
                                <select
                                    value={areaFilter}
                                    onChange={(e) => setAreaFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    disabled={isAreasLoading}
                                >
                                    {isAreasLoading && (
                                        <option value="all">Đang tải...</option>
                                    )}
                                    {!isAreasLoading && areas.map(area => (
                                        <option key={area.value} value={area.value}>{area.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tổng báo cáo đã nhận</p>
                                    <p className="text-3xl font-bold text-gray-900">{formatNumber(reportData.totalReportsReceived)}</p>
                                </div>
                                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tổng khối lượng tái chế</p>
                                    <p className="text-3xl font-bold text-green-600">{formatNumber(reportData.totalRecycled)} kg</p>
                                </div>
                                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tổng báo cáo đã hoàn thành</p>
                                    <p className="text-3xl font-bold text-orange-600">{formatNumber(reportData.totalReportsCompleted)}</p>
                                </div>
                                <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Số loại rác</p>
                                    <p className="text-3xl font-bold text-purple-600">{formatNumber(reportData.totalAcceptedWasteCategories || reportData.byType.length)}</p>
                                </div>
                                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Chart by Type */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Theo loại rác</h3>
                            <div className="space-y-4">
                                {reportData.byType.map((item, index) => {
                                    const maxCollected = getMaxValue(reportData.byType, 'collected');
                                    const collectedWidth = (item.collected / maxCollected) * 100;
                                    const recycledWidth = (item.recycled / maxCollected) * 100;

                                    return (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getWasteTypeColor(item.type)}`}>
                                                    {getWasteTypeLabel(item.type)}
                                                </span>
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-semibold text-gray-900">{formatNumber(item.collected)} kg</span>
                                                    {' / '}
                                                    <span className="font-semibold text-green-600">{formatNumber(item.recycled)} kg</span>
                                                    {' ('}
                                                    <span className="text-orange-600">{item.percentage}%</span>
                                                    {')'}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500" style={{ width: `${collectedWidth}%` }}></div>
                                                </div>
                                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-green-500" style={{ width: `${recycledWidth}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>Thu gom: {formatNumber(item.collected)} kg</span>
                                                <span>Tái chế: {formatNumber(item.recycled)} kg</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Chart by Area */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Theo khu vực</h3>
                            <div className="space-y-4">
                                {reportData.byArea.map((item, index) => {
                                    const maxCollected = getMaxValue(reportData.byArea, 'collected');
                                    const collectedWidth = (item.collected / maxCollected) * 100;
                                    const recycledWidth = (item.recycled / maxCollected) * 100;

                                    return (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-semibold text-gray-900">{formatNumber(item.collected)} kg</span>
                                                    {' / '}
                                                    <span className="font-semibold text-green-600">{formatNumber(item.recycled)} kg</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: `${collectedWidth}%` }}></div>
                                                </div>
                                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-green-500" style={{ width: `${recycledWidth}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>Thu gom: {formatNumber(item.collected)} kg</span>
                                                <span>Tái chế: {formatNumber(item.recycled)} kg</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Chi tiết báo cáo</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Loại rác</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Địa điểm</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Khối lượng(kg)</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ngày</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {isReportsLoading && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-500">
                                                Đang tải danh sách báo cáo...
                                            </td>
                                        </tr>
                                    )}
                                    {!isReportsLoading && reportsError && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-6 text-center text-sm text-red-500">
                                                {reportsError}
                                            </td>
                                        </tr>
                                    )}
                                    {!isReportsLoading && !reportsError && reportRows.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-500">
                                                Chưa có báo cáo đã thu gom.
                                            </td>
                                        </tr>
                                    )}
                                    {!isReportsLoading && !reportsError && reportRows.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getWasteTypeColor(row.wasteCategoryId)}`}>
                                                    {getWasteTypeLabel(row.wasteCategoryId)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">{row.addressText || getAreaLabel(row.areaId)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">{formatNumber(row.weightKg)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${row.statusColor}`}>
                                                    {row.statusLabel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">
                                                    {row.date ? new Date(row.date).toLocaleDateString('vi-VN') : '—'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnterpriseReport;
