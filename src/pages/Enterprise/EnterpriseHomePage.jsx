import React, { useState } from 'react';
import EnterpriseSidebar from '../../components/EnterpriseSidebar';

const EnterpriseHomePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const requests = [
        {
            id: 1,
            type: 'Nhựa (PET)',
            typeColor: 'bg-blue-100 text-blue-700',
            weight: '1.2 Tấn',
            location: 'Khu công nghiệp Bắc Thăng L',
            time: '2 giờ trước'
        },
        {
            id: 2,
            type: 'Hữu cơ',
            typeColor: 'bg-green-100 text-green-700',
            weight: '450 kg',
            location: 'Chung cư Green Valley, Quận 7',
            time: '5 giờ trước'
        },
        {
            id: 3,
            type: 'Giấy vụn',
            typeColor: 'bg-orange-100 text-orange-700',
            weight: '800 kg',
            location: 'Tòa nhà Bitexco, Quận 1',
            time: 'Hôm qua'
        },
        {
            id: 4,
            type: 'Điện tử',
            typeColor: 'bg-purple-100 text-purple-700',
            weight: '150 kg',
            location: 'Khu Công nghệ cao, Quận 9',
            time: '2 ngày trước'
        }
    ];

    const totalRequests = 24;
    const totalPages = Math.ceil(totalRequests / itemsPerPage);

    const handleViewDetail = (requestId) => {
        window.history.pushState({}, '', `/enterprise/report/${requestId}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
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
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
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
                            <div className="flex items-center gap-2 border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`px-4 py-2 font-medium text-sm relative ${activeTab === 'pending'
                                        ? 'text-green-600 border-b-2 border-green-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Chờ xử lý
                                    {activeTab === 'pending' && (
                                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                            24
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('in-progress')}
                                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'in-progress'
                                        ? 'text-green-600 border-b-2 border-green-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Đang thực hiện
                                </button>
                                <button
                                    onClick={() => setActiveTab('completed')}
                                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'completed'
                                        ? 'text-green-600 border-b-2 border-green-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Đã hoàn thành
                                </button>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Lọc dữ liệu</span>
                            </button>
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
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">THỜI GIAN</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">THAO TÁC</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {requests.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${request.typeColor}`}>
                                                        {request.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900">{request.weight}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="text-sm text-gray-700">{request.location}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-600">{request.time}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button
                                                        onClick={() => handleViewDetail(request.id)}
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
                                    Hiển thị 1-{itemsPerPage} của {totalRequests} yêu cầu
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
                            <h3 className="text-lg font-bold text-gray-900 mb-4">TỔNG QUAN HÔM NAY</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-4">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">14</div>
                                    <div className="text-xs text-gray-600">Yêu cầu đã nhận</div>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">3.2t</div>
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
        </div>
    );
};

export default EnterpriseHomePage;
