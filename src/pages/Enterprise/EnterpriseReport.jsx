import React, { useState, useEffect } from 'react';
import EnterpriseSidebar from '../../components/EnterpriseSidebar';

const EnterpriseReport = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
        byType: [],
        byArea: [],
        byTime: []
    });

    const wasteTypes = [
        { value: 'all', label: 'Tất cả loại' },
        { value: 'PET', label: 'Nhựa PET', color: 'bg-blue-100 text-blue-700' },
        { value: 'HDPE', label: 'Nhựa HDPE', color: 'bg-indigo-100 text-indigo-700' },
        { value: 'ORGANIC', label: 'Rác hữu cơ', color: 'bg-green-100 text-green-700' },
        { value: 'PAPER', label: 'Giấy vụn', color: 'bg-orange-100 text-orange-700' },
        { value: 'METAL', label: 'Kim loại', color: 'bg-gray-100 text-gray-700' },
        { value: 'GLASS', label: 'Thủy tinh', color: 'bg-cyan-100 text-cyan-700' },
        { value: 'ELECTRONIC', label: 'Điện tử', color: 'bg-purple-100 text-purple-700' }
    ];

    const areas = [
        { value: 'all', label: 'Tất cả khu vực' },
        { value: 'q1', label: 'Quận 1' },
        { value: 'q2', label: 'Quận 2' },
        { value: 'q3', label: 'Quận 3' },
        { value: 'q7', label: 'Quận 7' },
        { value: 'q9', label: 'Quận 9' },
        { value: 'btl', label: 'Bắc Thăng Long' }
    ];

    useEffect(() => {
        // Simulate data fetching
        const generateReportData = () => {
            const sampleByType = [
                { type: 'PET', collected: 1250, recycled: 1100, percentage: 88 },
                { type: 'HDPE', collected: 850, recycled: 720, percentage: 85 },
                { type: 'ORGANIC', collected: 2100, recycled: 1890, percentage: 90 },
                { type: 'PAPER', collected: 980, recycled: 850, percentage: 87 },
                { type: 'METAL', collected: 650, recycled: 580, percentage: 89 },
                { type: 'GLASS', collected: 420, recycled: 380, percentage: 90 },
                { type: 'ELECTRONIC', collected: 180, recycled: 150, percentage: 83 }
            ];

            const sampleByArea = [
                { area: 'q1', name: 'Quận 1', collected: 1200, recycled: 1050 },
                { area: 'q2', name: 'Quận 2', collected: 980, recycled: 850 },
                { area: 'q3', name: 'Quận 3', collected: 1100, recycled: 950 },
                { area: 'q7', name: 'Quận 7', collected: 1350, recycled: 1200 },
                { area: 'q9', name: 'Quận 9', collected: 900, recycled: 800 },
                { area: 'btl', name: 'Bắc Thăng Long', collected: 1420, recycled: 1280 }
            ];

            const sampleByTime = [
                { date: '2024-01-01', collected: 450, recycled: 400 },
                { date: '2024-01-02', collected: 520, recycled: 460 },
                { date: '2024-01-03', collected: 480, recycled: 430 },
                { date: '2024-01-04', collected: 550, recycled: 490 },
                { date: '2024-01-05', collected: 500, recycled: 450 },
                { date: '2024-01-06', collected: 530, recycled: 480 },
                { date: '2024-01-07', collected: 510, recycled: 460 }
            ];

            const totalCollected = sampleByType.reduce((sum, item) => sum + item.collected, 0);
            const totalRecycled = sampleByType.reduce((sum, item) => sum + item.recycled, 0);

            setReportData({
                totalCollected,
                totalRecycled,
                byType: sampleByType,
                byArea: sampleByArea,
                byTime: sampleByTime
            });
        };

        generateReportData();
    }, [timeFilter, wasteTypeFilter, areaFilter, dateRange]);

    const getWasteTypeLabel = (type) => {
        const found = wasteTypes.find(t => t.value === type);
        return found ? found.label : type;
    };

    const getWasteTypeColor = (type) => {
        const found = wasteTypes.find(t => t.value === type);
        return found ? found.color : 'bg-gray-100 text-gray-700';
    };

    const getAreaName = (area) => {
        const found = areas.find(a => a.value === area);
        return found ? found.label : area;
    };

    const formatNumber = (num) => {
        return num.toLocaleString('vi-VN');
    };

    const getMaxValue = (data, key) => {
        return Math.max(...data.map(item => item[key]), 0);
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
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Xuất báo cáo</span>
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
                                >
                                    {wasteTypes.map(type => (
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
                                >
                                    {areas.map(area => (
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
                                    <p className="text-sm text-gray-600 mb-1">Tổng khối lượng thu gom</p>
                                    <p className="text-3xl font-bold text-gray-900">{formatNumber(reportData.totalCollected)} kg</p>
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
                                    <p className="text-sm text-gray-600 mb-1">Tỷ lệ tái chế</p>
                                    <p className="text-3xl font-bold text-orange-600">
                                        {reportData.totalCollected > 0
                                            ? ((reportData.totalRecycled / reportData.totalCollected) * 100).toFixed(1)
                                            : 0}%
                                    </p>
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
                                    <p className="text-3xl font-bold text-purple-600">{reportData.byType.length}</p>
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

                    {/* Time Series Chart */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Theo thời gian</h3>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {reportData.byTime.map((item, index) => {
                                const maxCollected = getMaxValue(reportData.byTime, 'collected');
                                const collectedHeight = (item.collected / maxCollected) * 100;
                                const recycledHeight = (item.recycled / maxCollected) * 100;

                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                                        <div className="w-full flex flex-col items-center justify-end gap-1 h-48">
                                            <div
                                                className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                                                style={{ height: `${collectedHeight}%` }}
                                                title={`Thu gom: ${formatNumber(item.collected)} kg`}
                                            ></div>
                                            <div
                                                className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                                                style={{ height: `${recycledHeight}%` }}
                                                title={`Tái chế: ${formatNumber(item.recycled)} kg`}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-600 mt-2">
                                            {new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                <span className="text-sm text-gray-600">Thu gom</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded"></div>
                                <span className="text-sm text-gray-600">Tái chế</span>
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
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Khu vực</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Khối lượng thu gom (kg)</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Khối lượng tái chế (kg)</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tỷ lệ tái chế (%)</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ngày</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.byType.flatMap((typeItem, typeIndex) =>
                                        reportData.byArea.map((areaItem, areaIndex) => {
                                            const collected = Math.floor(Math.random() * 500) + 100;
                                            const recycled = Math.floor(collected * 0.85);
                                            const percentage = ((recycled / collected) * 100).toFixed(1);
                                            const date = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

                                            return (
                                                <tr key={`${typeIndex}-${areaIndex}`} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getWasteTypeColor(typeItem.type)}`}>
                                                            {getWasteTypeLabel(typeItem.type)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-900">{areaItem.name}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-medium text-gray-900">{formatNumber(collected)}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-medium text-green-600">{formatNumber(recycled)}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-medium text-orange-600">{percentage}%</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-600">
                                                            {new Date(date).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
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
