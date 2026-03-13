import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { updateCitizenComplaint } from '../../service/api';

const CATEGORY_OPTIONS = [
    { value: 'MISSED_PICKUP', label: 'Bỏ sót thu gom' },
    { value: 'WRONG_WASTE_TYPE', label: 'Sai loại rác' },
    { value: 'INVALID_PROOF', label: 'Bằng chứng không hợp lệ' },
    { value: 'POINTS_WRONG', label: 'Điểm thưởng sai' },
    { value: 'OTHER', label: 'Khác' },
];

const STATUS_OPTIONS = [
    { value: 'OPEN', label: 'Đang mở' },
    { value: 'IN_REVIEW', label: 'Đang xem xét' },
    { value: 'RESOLVED', label: 'Đã giải quyết' },
    { value: 'REJECTED', label: 'Từ chối' },
];

const UpdateComplainModal = ({ isOpen, onClose, defaultData = {}, onSubmit }) => {
    const [formData, setFormData] = useState({
        id: '',
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
            id: defaultData.id || '',
            reportId: defaultData.reportId || defaultData.report?.id || '',
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
        
        if (!formData.id) {
            toast.error('Thiếu mã khiếu nại.');
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

            const response = await updateCitizenComplaint(formData.id, payload);
            
            if (typeof onSubmit === 'function') {
                onSubmit(response);
            }
            
            toast.success('Cập nhật khiếu nại thành công.');
            onClose();
        } catch (error) {
            console.error('Lỗi cập nhật khiếu nại:', error);
            toast.error(error?.message || 'Không thể cập nhật khiếu nại. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-lg border border-gray-200">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Cập nhật khiếu nại</h3>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mã khiếu nại</label>
                        <input
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            placeholder="Mã khiếu nại"
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
                            {CATEGORY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
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
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
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
                            {isSubmitting ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateComplainModal;
