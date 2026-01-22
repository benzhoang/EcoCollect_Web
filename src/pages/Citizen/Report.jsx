import React, { useState } from 'react';
import ReportModal from '../../components/ReportModal';

const Report = () => {
    const [activeFilter, setActiveFilter] = useState('Tất cả');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('Mới nhất');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dữ liệu mẫu các báo cáo
    const reports = [
        {
            id: 1,
            wasteType: 'Rác thông thường',
            wasteTypeColor: 'bg-gray-100 text-gray-700',
            status: 'Từ chối',
            statusColor: 'bg-red-100 text-red-700',
            statusIcon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
            address: '234 Điện Biên Phủ, Quận Bình Thạnh',
            date: '10/01/2024 - 15:45',
            points: '0 điểm',
            pointsColor: 'text-red-600',
            image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=300&fit=crop'
        },
        {
            id: 2,
            wasteType: 'Rác điện tử',
            wasteTypeColor: 'bg-orange-100 text-orange-700',
            status: 'Đã thu gom',
            statusColor: 'bg-green-100 text-green-700',
            statusIcon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            address: '56 Võ Văn Tần, Quận 3, TP.HCM',
            date: '12/01/2024 - 16:00',
            points: '+40 điểm',
            pointsColor: 'text-green-600',
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop'
        },
        {
            id: 3,
            wasteType: 'Rác tái chế',
            wasteTypeColor: 'bg-blue-100 text-blue-700',
            status: 'Chờ xử lý',
            statusColor: 'bg-orange-100 text-orange-700',
            statusIcon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            address: '12 Pasteur, Quận 3, TP.HCM',
            date: '14/01/2024 - 09:15',
            points: 'Chờ duyệt điểm',
            pointsColor: 'text-gray-600',
            image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop'
        },
        {
            id: 4,
            wasteType: 'Rác nguy hại',
            wasteTypeColor: 'bg-red-100 text-red-700',
            status: 'Đã tiếp nhận',
            statusColor: 'bg-orange-100 text-orange-700',
            statusIcon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            address: '78 Trần Hưng Đạo, Quận 5, TP.HCM',
            date: '14/01/2024 - 14:20',
            points: '+30 điểm',
            pointsColor: 'text-green-600',
            image: 'https://images.unsplash.com/photo-1611909023030-19c0c2a79fb8?w=400&h=300&fit=crop'
        },
        {
            id: 5,
            wasteType: 'Rác hữu cơ',
            wasteTypeColor: 'bg-green-100 text-green-700',
            status: 'Đã phân công',
            statusColor: 'bg-blue-100 text-blue-700',
            statusIcon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            address: '45 Lê Lợi, Quận 1, TP.HCM',
            date: '15/01/2024 - 05:30',
            points: '+20 điểm',
            pointsColor: 'text-green-600',
            image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop'
        },
        {
            id: 6,
            wasteType: 'Rác tái chế',
            wasteTypeColor: 'bg-blue-100 text-blue-700',
            status: 'Đã thu gom',
            statusColor: 'bg-green-100 text-green-700',
            statusIcon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
            date: '15/01/2024 - 08:30',
            points: '+25 điểm',
            pointsColor: 'text-green-600',
            image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop'
        }
    ];

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
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tạo báo cáo
                        </button>
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
                <div className="space-y-4">
                    {searchedReports.map((report) => (
                        <div
                            key={report.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
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
                        </div>
                    ))}
                </div>

                {searchedReports.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-600">Không tìm thấy báo cáo nào</p>
                    </div>
                )}
            </div>

            {/* Report Modal */}
            <ReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Report;
