import React, { useState, useEffect } from 'react';
import EnterpriseSidebar from '../../components/EnterpriseSidebar';
import AssignCollectorModal from '../../components/Modal/AssignCollectorModal';

const CoordinationFollow = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedCollector, setSelectedCollector] = useState('');

    // Dữ liệu mẫu - yêu cầu thu gom
    const [requests, setRequests] = useState([
        {
            id: 1,
            code: 'YC-2024-001',
            type: 'Nhựa (PET)',
            typeColor: 'bg-blue-100 text-blue-700',
            weight: '1.2 Tấn',
            location: 'Khu công nghiệp Bắc Thăng Long, Hà Nội',
            address: '123 Đường ABC, Phường XYZ',
            latitude: 21.0285,
            longitude: 105.8542,
            time: '2 giờ trước',
            status: 'pending',
            statusLabel: 'Chờ điều phối',
            statusColor: 'bg-yellow-100 text-yellow-700',
            citizen: 'Nguyễn Văn A',
            phone: '0901234567',
            assignedCollector: null,
            progress: 0
        },
        {
            id: 2,
            code: 'YC-2024-002',
            type: 'Hữu cơ',
            typeColor: 'bg-green-100 text-green-700',
            weight: '450 kg',
            location: 'Chung cư Green Valley, Quận 7, TP.HCM',
            address: '456 Đường DEF, Phường UVW',
            latitude: 10.7302,
            longitude: 106.6931,
            time: '5 giờ trước',
            status: 'assigned',
            statusLabel: 'Đã gán',
            statusColor: 'bg-blue-100 text-blue-700',
            citizen: 'Trần Thị B',
            phone: '0912345678',
            assignedCollector: {
                id: 1,
                name: 'Lê Văn C',
                phone: '0923456789',
                vehicle: 'Xe tải 29C-12345',
                status: 'on_way',
                statusLabel: 'Đang đến',
                latitude: 10.7350,
                longitude: 106.6950,
                progress: 45
            },
            progress: 45
        },
        {
            id: 3,
            code: 'YC-2024-003',
            type: 'Giấy vụn',
            typeColor: 'bg-orange-100 text-orange-700',
            weight: '800 kg',
            location: 'Tòa nhà Bitexco, Quận 1, TP.HCM',
            address: '789 Đường GHI, Phường RST',
            latitude: 10.7718,
            longitude: 106.7042,
            time: 'Hôm qua',
            status: 'in_progress',
            statusLabel: 'Đang thu gom',
            statusColor: 'bg-purple-100 text-purple-700',
            citizen: 'Phạm Văn D',
            phone: '0934567890',
            assignedCollector: {
                id: 2,
                name: 'Hoàng Văn E',
                phone: '0945678901',
                vehicle: 'Xe tải 30A-67890',
                status: 'collecting',
                statusLabel: 'Đang thu gom',
                latitude: 10.7718,
                longitude: 106.7042,
                progress: 75
            },
            progress: 75
        },
        {
            id: 4,
            code: 'YC-2024-004',
            type: 'Điện tử',
            typeColor: 'bg-purple-100 text-purple-700',
            weight: '150 kg',
            location: 'Khu Công nghệ cao, Quận 9, TP.HCM',
            address: '321 Đường JKL, Phường MNO',
            latitude: 10.8419,
            longitude: 106.8099,
            time: '2 ngày trước',
            status: 'completed',
            statusLabel: 'Hoàn thành',
            statusColor: 'bg-green-100 text-green-700',
            citizen: 'Võ Thị F',
            phone: '0956789012',
            assignedCollector: {
                id: 3,
                name: 'Đỗ Văn G',
                phone: '0967890123',
                vehicle: 'Xe tải 51B-11111',
                status: 'completed',
                statusLabel: 'Hoàn thành',
                latitude: null,
                longitude: null,
                progress: 100
            },
            progress: 100,
            completedAt: '2024-01-17 14:30'
        }
    ]);

    // Danh sách collector thuộc doanh nghiệp
    const collectors = [
        { id: 1, name: 'Lê Văn C', phone: '0923456789', vehicle: 'Xe tải 29C-12345', status: 'available', statusLabel: 'Sẵn sàng' },
        { id: 2, name: 'Hoàng Văn E', phone: '0945678901', vehicle: 'Xe tải 30A-67890', status: 'busy', statusLabel: 'Đang bận' },
        { id: 3, name: 'Đỗ Văn G', phone: '0967890123', vehicle: 'Xe tải 51B-11111', status: 'available', statusLabel: 'Sẵn sàng' },
        { id: 4, name: 'Nguyễn Văn H', phone: '0978901234', vehicle: 'Xe tải 43D-22222', status: 'available', statusLabel: 'Sẵn sàng' }
    ];

    // Mô phỏng cập nhật theo thời gian thực
    useEffect(() => {
        const interval = setInterval(() => {
            setRequests(prevRequests =>
                prevRequests.map(request => {
                    if (request.status === 'assigned' && request.assignedCollector) {
                        // Cập nhật tiến độ và vị trí collector
                        const newProgress = Math.min(request.progress + Math.random() * 2, 100);
                        const collector = request.assignedCollector;

                        // Cập nhật vị trí collector (mô phỏng di chuyển)
                        if (collector.latitude && collector.longitude) {
                            collector.latitude += (Math.random() - 0.5) * 0.001;
                            collector.longitude += (Math.random() - 0.5) * 0.001;
                        }

                        // Cập nhật trạng thái dựa trên tiến độ
                        let newStatus = request.status;
                        let newStatusLabel = request.statusLabel;
                        let newStatusColor = request.statusColor;

                        if (newProgress >= 100 && request.status !== 'completed') {
                            newStatus = 'completed';
                            newStatusLabel = 'Hoàn thành';
                            newStatusColor = 'bg-green-100 text-green-700';
                            collector.status = 'completed';
                            collector.statusLabel = 'Hoàn thành';
                        } else if (newProgress >= 75 && request.status === 'assigned') {
                            newStatus = 'in_progress';
                            newStatusLabel = 'Đang thu gom';
                            newStatusColor = 'bg-purple-100 text-purple-700';
                            collector.status = 'collecting';
                            collector.statusLabel = 'Đang thu gom';
                        }

                        return {
                            ...request,
                            progress: newProgress,
                            status: newStatus,
                            statusLabel: newStatusLabel,
                            statusColor: newStatusColor,
                            assignedCollector: { ...collector }
                        };
                    }
                    return request;
                })
            );
        }, 3000); // Cập nhật mỗi 3 giây

        return () => clearInterval(interval);
    }, []);

    const handleAssignCollector = () => {
        if (!selectedCollector) {
            alert('Vui lòng chọn collector');
            return;
        }

        const collector = collectors.find(c => c.id === parseInt(selectedCollector));
        if (!collector) return;

        setRequests(prevRequests =>
            prevRequests.map(request =>
                request.id === selectedRequest?.id
                    ? {
                        ...request,
                        status: 'assigned',
                        statusLabel: 'Đã gán',
                        statusColor: 'bg-blue-100 text-blue-700',
                        assignedCollector: {
                            ...collector,
                            status: 'on_way',
                            statusLabel: 'Đang đến',
                            latitude: request.latitude + (Math.random() - 0.5) * 0.01,
                            longitude: request.longitude + (Math.random() - 0.5) * 0.01,
                            progress: 0
                        },
                        progress: 0
                    }
                    : request
            )
        );

        setShowAssignModal(false);
        setSelectedRequest(null);
        setSelectedCollector('');
    };

    const handleOpenAssignModal = (request) => {
        setSelectedRequest(request);
        setShowAssignModal(true);
    };

    const handleOpenTrackingModal = (request) => {
        // Lưu dữ liệu để trang FollowProgress đọc lại (mock, chưa có API)
        try {
            sessionStorage.setItem('followProgressRequest', JSON.stringify(request));
        } catch (e) {
            // ignore
        }
        window.history.pushState({}, '', `/enterprise/follow-progress/${request.id}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    const filteredRequests = requests.filter(request => {
        switch (activeTab) {
            case 'pending':
                return request.status === 'pending';
            case 'assigned':
                return request.status === 'assigned' || request.status === 'in_progress';
            case 'completed':
                return request.status === 'completed';
            default:
                return true;
        }
    });

    const getStatusStats = () => {
        return {
            pending: requests.filter(r => r.status === 'pending').length,
            assigned: requests.filter(r => r.status === 'assigned' || r.status === 'in_progress').length,
            completed: requests.filter(r => r.status === 'completed').length
        };
    };

    const stats = getStatusStats();

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
                            <h1 className="text-2xl font-bold text-gray-900">Điều phối & Theo dõi</h1>
                            <p className="text-sm text-gray-600">Gán và theo dõi yêu cầu thu gom cho Collector theo thời gian thực</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-700">Đang cập nhật</span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Left Content - Request List */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Chờ điều phối</p>
                                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Đang thực hiện</p>
                                        <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Đã hoàn thành</p>
                                        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Tổng yêu cầu</p>
                                        <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                    Chờ điều phối
                                    {activeTab === 'pending' && stats.pending > 0 && (
                                        <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                            {stats.pending}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('assigned')}
                                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'assigned'
                                        ? 'text-green-600 border-b-2 border-green-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Đang thực hiện
                                    {activeTab === 'assigned' && stats.assigned > 0 && (
                                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                            {stats.assigned}
                                        </span>
                                    )}
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
                        </div>

                        {/* Request List */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {filteredRequests.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-600 mb-2">Không có yêu cầu nào</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {filteredRequests.map((request) => (
                                        <div key={request.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">{request.code}</h3>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${request.typeColor}`}>
                                                            {request.type}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${request.statusColor}`}>
                                                            {request.statusLabel}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                                        <div>
                                                            <div className="text-sm text-gray-600 mb-1">Khối lượng</div>
                                                            <div className="text-sm font-medium text-gray-900">{request.weight}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-gray-600 mb-1">Người yêu cầu</div>
                                                            <div className="text-sm font-medium text-gray-900">{request.citizen}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="text-sm text-gray-700">{request.location}</span>
                                                    </div>
                                                    {request.assignedCollector && (
                                                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    <span className="text-sm font-semibold text-blue-900">Collector đã gán</span>
                                                                </div>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${request.assignedCollector.status === 'on_way' ? 'bg-yellow-100 text-yellow-700' :
                                                                    request.assignedCollector.status === 'collecting' ? 'bg-purple-100 text-purple-700' :
                                                                        'bg-green-100 text-green-700'
                                                                    }`}>
                                                                    {request.assignedCollector.statusLabel}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-700">
                                                                <div>Tên: <span className="font-medium">{request.assignedCollector.name}</span></div>
                                                                <div>Xe: <span className="font-medium">{request.assignedCollector.vehicle}</span></div>
                                                            </div>
                                                            {request.progress > 0 && (
                                                                <div className="mt-2">
                                                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                                        <span>Tiến độ</span>
                                                                        <span>{Math.round(request.progress)}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                                        <div
                                                                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                                            style={{ width: `${request.progress}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    {request.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleOpenAssignModal(request)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                        >
                                                            Gán Collector
                                                        </button>
                                                    )}
                                                    {request.assignedCollector && (
                                                        <button
                                                            onClick={() => handleOpenTrackingModal(request)}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                        >
                                                            Theo dõi
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Gán Collector */}
            <AssignCollectorModal
                show={showAssignModal}
                request={selectedRequest}
                collectors={collectors}
                selectedCollector={selectedCollector}
                onSelectedCollectorChange={setSelectedCollector}
                onClose={() => {
                    setShowAssignModal(false);
                    setSelectedRequest(null);
                    setSelectedCollector('');
                }}
                onConfirm={handleAssignCollector}
            />

            {/* Theo dõi đã chuyển sang trang FollowProgress */}
        </div>
    );
};

export default CoordinationFollow;
