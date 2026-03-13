import React, { useEffect, useMemo, useState } from 'react';
import { getComplaints } from '../../service/api';
import UpdateComplainModal from '../../components/Modal/UpdateComplainModal';

const CATEGORY_OPTIONS = [
    { value: '', label: 'Tất cả' },
    { value: 'MISSED_PICKUP', label: 'Bỏ sót thu gom' },
    { value: 'WRONG_WASTE_TYPE', label: 'Sai loại rác' },
    { value: 'INVALID_PROOF', label: 'Bằng chứng không hợp lệ' },
    { value: 'POINTS_WRONG', label: 'Điểm thưởng sai' },
    { value: 'OTHER', label: 'Khác' },
];

const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả' },
    { value: 'OPEN', label: 'Đang mở' },
    { value: 'IN_REVIEW', label: 'Đang xem xét' },
    { value: 'RESOLVED', label: 'Đã giải quyết' },
    { value: 'REJECTED', label: 'Từ chối' },
];

const STATUS_STYLES = {
    OPEN: 'bg-orange-100 text-orange-700',
    IN_REVIEW: 'bg-blue-100 text-blue-700',
    RESOLVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
};

const formatDateTime = (value) => {
    if (!value) return '--';
    try {
        return new Date(value).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    } catch {
        return value;
    }
};

const Complaints = () => {
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const categoryLabelMap = useMemo(() => {
        const map = {};
        CATEGORY_OPTIONS.forEach((opt) => {
            if (opt.value) map[opt.value] = opt.label;
        });
        return map;
    }, []);

    const statusLabelMap = useMemo(() => {
        const map = {};
        STATUS_OPTIONS.forEach((opt) => {
            if (opt.value) map[opt.value] = opt.label;
        });
        return map;
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getComplaints({
                category: category || undefined,
                status: status || undefined,
                page,
                size: 8,
                sort: ['createdAt,desc'],
            });

            const payload = response?.data ?? response;
            const pageData = payload?.data ?? payload;
            const content = Array.isArray(pageData?.content) ? pageData.content : [];
            setComplaints(content);
            setTotalPages(Number(pageData?.totalPages || 0));
        } catch (err) {
            setError(err?.message || 'Không thể tải danh sách khiếu nại.');
            setComplaints([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [category, status, page]);

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setPage(0);
    };

    return (
        <div className="min-h-screen bg-green-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Đơn khiếu nại</h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Theo dõi tình trạng xử lý khiếu nại của bạn.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Loại khiếu nại</label>
                            <select
                                value={category}
                                onChange={handleFilterChange(setCategory)}
                                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                {CATEGORY_OPTIONS.map((opt) => (
                                    <option key={opt.value || 'all'} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                            <select
                                value={status}
                                onChange={handleFilterChange(setStatus)}
                                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value || 'all'} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <div className="w-full rounded-lg border border-dashed border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                Tổng đơn: <span className="font-semibold">{complaints.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-10 text-sm text-gray-600">Đang tải danh sách khiếu nại...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {complaints.map((item) => {
                            const categoryLabel = categoryLabelMap[item.category] || item.category || '--';
                            const statusLabel = statusLabelMap[item.status] || item.status || '--';
                            const statusClass = STATUS_STYLES[item.status] || 'bg-gray-100 text-gray-700';

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Mã khiếu nại</p>
                                            <p className="text-sm font-semibold text-gray-900 break-all">#{item.id}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                                                {statusLabel}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedComplaint(item);
                                                    setIsUpdateOpen(true);
                                                }}
                                                className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
                                                title="Chỉnh sửa khiếu nại"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 3.487a2.1 2.1 0 013.05 2.9l-9.1 9.1-4.242 1.06 1.06-4.242 9.232-8.818z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-2-2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-gray-500">Mã người khiếu nại</p>
                                            <p className="text-sm text-gray-800 break-all">{item.complainantId || '--'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Loại khiếu nại</p>
                                            <p className="text-sm text-gray-800">{categoryLabel}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Mô tả</p>
                                            <p className="text-sm text-gray-700 line-clamp-3">{item.description || '--'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 flex flex-wrap gap-3">
                                        <span>Ngày tạo: {formatDateTime(item.createdAt)}</span>
                                        <span>Ngày xử lý: {formatDateTime(item.resolvedAt)}</span>
                                    </div>
                                </div>
                            );
                        })}

                        {complaints.length === 0 && !loading && !error && (
                            <div className="col-span-full text-center py-12">
                                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v9a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600">Chưa có đơn khiếu nại nào.</p>
                            </div>
                        )}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                            disabled={page === 0}
                            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Trước
                        </button>
                        <span className="text-sm text-gray-600">Trang {page + 1} / {totalPages}</span>
                        <button
                            type="button"
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                            disabled={page + 1 >= totalPages}
                            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sau
                        </button>
                    </div>
                )}

                <UpdateComplainModal
                    isOpen={isUpdateOpen}
                    onClose={() => {
                        setIsUpdateOpen(false);
                        setSelectedComplaint(null);
                    }}
                    defaultData={selectedComplaint || {}}
                    onSubmit={() => fetchComplaints()}
                />
            </div>
        </div>
    );
};

export default Complaints;
