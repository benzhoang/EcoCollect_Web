import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { createCitizenComplaint } from '../../service/api';

const ComplainModal = ({ isOpen, onClose, defaultData = {}, onSubmit }) => {
    const [formData, setFormData] = useState({
        reportId: '',
        category: 'MISSED_PICKUP',
        description: '',
        latitude: '',
        longitude: '',
        status: 'OPEN',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setFormData({
            reportId: defaultData.reportId || '',
            category: defaultData.category || 'MISSED_PICKUP',
            description: defaultData.description || '',
            latitude: defaultData.latitude ?? '',
            longitude: defaultData.longitude ?? '',
            status: defaultData.status || 'OPEN',
        });
    }, [isOpen, defaultData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.reportId) {
            toast.error('Thiếu mã báo cáo để tạo khiếu nại.');
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                reportId: formData.reportId,
                category: formData.category,
                description: formData.description,
                latitude: formData.latitude === '' ? null : Number(formData.latitude),
                longitude: formData.longitude === '' ? null : Number(formData.longitude),
                status: formData.status,
            };

            const response = await createCitizenComplaint(payload);
            if (typeof onSubmit === 'function') {
                onSubmit(response);
            }
            toast.success('Gửi khiếu nại thành công.');
            onClose();
        } catch (error) {
            console.error('Lỗi tạo khiếu nại:', error);
            toast.error(error?.message || 'Không thể tạo khiếu nại. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-lg border border-gray-200">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Tạo đơn khiếu nại</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Đóng"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mã báo cáo</label>
                        <input
                            name="reportId"
                            value={formData.reportId}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            placeholder="Mã báo cáo"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Loại khiếu nại</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="MISSED_PICKUP">Bỏ sót thu gom</option>
                            <option value="WRONG_WASTE_TYPE">Sai loại rác</option>
                            <option value="INVALID_PROOF">Bằng chứng không hợp lệ</option>
                            <option value="POINTS_WRONG">Điểm thưởng sai</option>
                            <option value="OTHER">Khác</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            placeholder="Mô tả chi tiết khiếu nại"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vĩ độ</label>
                            <input
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                type="number"
                                step="any"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Vĩ độ"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kinh độ</label>
                            <input
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                type="number"
                                step="any"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Kinh độ"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="OPEN">Đang mở</option>
                            <option value="IN_REVIEW">Đang xem xét</option>
                            <option value="RESOLVED">Đã giải quyết</option>
                            <option value="REJECTED">Từ chối</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi khiếu nại'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComplainModal;
