import React, { useEffect, useMemo, useState } from 'react';
import EnterpriseSidebar from '../../components/EnterpriseSidebar';

const FollowProgress = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const requestIdFromPath = useMemo(() => {
        const parts = window.location.pathname.split('/').filter(Boolean);
        const idx = parts.findIndex(p => p === 'follow-progress');
        if (idx === -1) return null;
        return parts[idx + 1] || null;
    }, []);

    const [request, setRequest] = useState(null);

    useEffect(() => {
        // Mock: lấy request từ sessionStorage do CoordinationFollow set
        const raw = sessionStorage.getItem('followProgressRequest');
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                setRequest(parsed);
                return;
            } catch (e) {
                // ignore
            }
        }

        // Fallback: nếu user reload trang hoặc truy cập trực tiếp
        setRequest({
            id: requestIdFromPath || 'N/A',
            code: `YC-${requestIdFromPath || '0000'}`,
            type: 'Nhựa (PET)',
            weight: '1.2 Tấn',
            location: 'Khu công nghiệp Bắc Thăng Long, Hà Nội',
            progress: 45,
            assignedCollector: {
                name: 'Lê Văn C',
                phone: '0923456789',
                vehicle: 'Xe tải 29C-12345',
                status: 'on_way',
                statusLabel: 'Đang đến',
                latitude: 21.03,
                longitude: 105.85
            }
        });
    }, [requestIdFromPath]);

    const statusSteps = [
        { key: 'assigned', label: 'Đã gán', color: 'bg-yellow-500' },
        { key: 'on_way', label: 'Đang đến', color: 'bg-blue-500' },
        { key: 'collecting', label: 'Đang thu gom', color: 'bg-purple-500' },
        { key: 'completed', label: 'Hoàn thành', color: 'bg-green-500' }
    ];

    const handleBack = () => {
        window.history.pushState({}, '', '/enterprise/dispatch');
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    if (!request) return null;

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
            <EnterpriseSidebar isOpen={isSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Theo dõi tiến độ thu gom</h1>
                            <p className="text-sm text-gray-600">Chi tiết yêu cầu, tiến trình và bản đồ theo thời gian thực (mock)</p>
                        </div>
                    </div>

                    <button
                        onClick={handleBack}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Quay lại điều phối
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Summary */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-sm text-gray-600">Mã yêu cầu</div>
                                <div className="text-xl font-bold text-gray-900">{request.code}</div>
                                <div className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium text-gray-900">{request.type}</span> • {request.weight}
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{request.location}</span>
                                </div>
                            </div>

                            <div className="min-w-[220px]">
                                <div className="text-sm text-gray-600 mb-2">Tiến độ</div>
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                    <span>Hoàn thành</span>
                                    <span className="font-semibold text-gray-900">{Math.round(request.progress || 0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-green-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${request.progress || 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Collector + Steps */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Collector</h2>
                            {request.assignedCollector ? (
                                <div className="space-y-3 text-sm text-gray-700">
                                    <div>
                                        <div className="text-xs text-gray-500">Tên</div>
                                        <div className="font-medium text-gray-900">{request.assignedCollector.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">SĐT</div>
                                        <div className="font-medium text-gray-900">{request.assignedCollector.phone}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Xe</div>
                                        <div className="font-medium text-gray-900">{request.assignedCollector.vehicle}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Trạng thái</div>
                                        <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                            {request.assignedCollector.statusLabel}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-600">Chưa gán collector.</div>
                            )}
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tiến trình</h2>
                            <div className="flex items-center justify-between gap-3">
                                {statusSteps.map(step => (
                                    <div key={step.key} className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${step.color}`} />
                                            <div className="text-sm text-gray-700">{step.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-green-600 h-4 rounded-full transition-all duration-300"
                                        style={{ width: `${request.progress || 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    {request.assignedCollector?.latitude != null && request.assignedCollector?.longitude != null && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bản đồ</h2>
                            <div className="rounded-lg h-[420px] overflow-hidden border border-gray-200">
                                <iframe
                                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1234567890123!2d${request.assignedCollector.longitude}!3d${request.assignedCollector.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f5c8c8c8c8d%3A0x8c8c8c8c8c8c8c8c!2sHo%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Vị trí Collector"
                                />
                            </div>
                            <p className="text-xs text-gray-600 mt-2">Vị trí được hiển thị theo dữ liệu mock (sessionStorage).</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowProgress;
