import React, { useState, useMemo, useEffect } from 'react';
import { getEnterpriseCollectors, assignEnterpriseReport } from '../service/api';

/**
 * Modal giao việc cho collector
 *
 * Props:
 * - show: boolean - có hiển thị modal hay không
 * - onClose: () => void - hàm đóng modal
 * - onAssign: (collector, response) => void - callback khi giao việc thành công
 * - collectors?: array - danh sách collector (tùy chọn, nếu không truyền sẽ gọi API)
 * - areaId?: string - ID khu vực của báo cáo, dùng để tự động lọc collector theo khu vực
 * - reportId?: string - ID report để gọi API assign
 */
const AssignModal = ({ show, onClose, onAssign, collectors, areaId, reportId }) => {
    const [selectedCollectorId, setSelectedCollectorId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [apiCollectors, setApiCollectors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [error, setError] = useState(null);

    // Lấy danh sách collector từ API nếu không truyền qua props
    useEffect(() => {
        // Chỉ load khi modal mở
        if (!show) return;

        // Nếu đã truyền collectors từ bên ngoài thì không cần gọi API
        if (collectors && Array.isArray(collectors) && collectors.length > 0) {
            return;
        }

        const fetchCollectors = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await getEnterpriseCollectors({
                    areaId,
                    page: 0,
                    size: 50,
                    // Có thể sort theo fullName nếu backend hỗ trợ
                    // sort: ['fullName,asc'],
                });

                // Swagger: data.content là mảng collector
                const rawData = res && typeof res === 'object' ? (res.data ?? res) : null;
                const content = Array.isArray(rawData?.content)
                    ? rawData.content
                    : Array.isArray(rawData)
                        ? rawData
                        : [];

                const mapped = content.map((c, index) => ({
                    id: c.id,
                    name: c.fullName || `Collector ${index + 1}`,
                    code: c.email || '',
                    area: c.areaName || c.areaId || '',
                    status: 'Đang rảnh',
                    statusColor: 'bg-green-100 text-green-700',
                    activeTasks: typeof c.activeAssignments === 'number' ? c.activeAssignments : 0,
                    raw: c,
                }));

                setApiCollectors(mapped);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Đã xảy ra lỗi khi tải danh sách collector.');
            } finally {
                setLoading(false);
            }
        };

        fetchCollectors();
    }, [show, areaId, collectors]);

    const collectorList = useMemo(() => {
        if (collectors && Array.isArray(collectors) && collectors.length > 0) {
            return collectors;
        }
        return apiCollectors;
    }, [collectors, apiCollectors]);

    const filteredCollectors = useMemo(() => {
        if (!searchText.trim()) return collectorList;
        const lower = searchText.toLowerCase();
        return collectorList.filter((c) =>
            (c.name && c.name.toLowerCase().includes(lower)) ||
            (c.code && c.code.toLowerCase().includes(lower)) ||
            (c.area && c.area.toLowerCase().includes(lower))
        );
    }, [collectorList, searchText]);

    if (!show) return null;

    const handleConfirm = async () => {
        const selected = collectorList.find((c) => c.id === selectedCollectorId);
        if (!selected) {
            alert('Vui lòng chọn một collector để giao việc.');
            return;
        }

        if (!reportId) {
            alert('Không tìm thấy ID báo cáo để giao việc.');
            return;
        }

        try {
            setAssigning(true);
            const res = await assignEnterpriseReport(reportId, selected.id);
            if (onAssign) {
                onAssign(selected, res);
            }
        } catch (err) {
            console.error(err);
            alert(err?.message || 'Đã xảy ra lỗi khi giao việc cho collector.');
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Giao việc cho collector</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Chọn một collector phù hợp để giao nhiệm vụ thu gom báo cáo này.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Tìm theo tên, mã hoặc khu vực collector..."
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <svg
                                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-500">
                            Tổng: {collectorList.length} | Hiển thị: {filteredCollectors.length}
                        </span>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {loading && (
                        <div className="text-center text-sm text-gray-500 py-6">
                            Đang tải danh sách collector...
                        </div>
                    )}
                    {!loading && error && (
                        <div className="text-center text-sm text-red-600 py-6">
                            {error}
                        </div>
                    )}
                    {!loading && !error && filteredCollectors.length === 0 && (
                        <div className="text-center text-sm text-gray-500 py-8">
                            Không tìm thấy collector phù hợp với từ khóa.
                        </div>
                    )}
                    {filteredCollectors.map((collector) => (
                        <button
                            key={collector.id}
                            type="button"
                            onClick={() => setSelectedCollectorId(collector.id)}
                            className={`w-full text-left rounded-lg border px-4 py-3 flex items-center justify-between gap-3 transition-colors ${selectedCollectorId === collector.id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-semibold">
                                    {collector.name?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {collector.name}
                                        </p>
                                        {collector.code && (
                                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px] font-medium">
                                                {collector.code}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                        {collector.area && (
                                            <span className="inline-flex items-center gap-1">
                                                <svg
                                                    className="w-3 h-3 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                                <span>{collector.area}</span>
                                            </span>
                                        )}
                                        {typeof collector.activeTasks === 'number' && (
                                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                                Đang xử lý: {collector.activeTasks}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                {collector.status && (
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${collector.statusColor || 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {collector.status}
                                    </span>
                                )}
                                <span
                                    className={`w-3 h-3 rounded-full border ${selectedCollectorId === collector.id
                                        ? 'border-green-600 bg-green-500'
                                        : 'border-gray-300 bg-white'
                                        }`}
                                />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={assigning}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${assigning ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {assigning ? 'Đang giao việc...' : 'Giao việc'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignModal;

