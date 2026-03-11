import React, { useEffect, useState } from 'react';
import { getEnterpriseVoucherById, updateEnterpriseVoucher } from '../../service/api';

const UpdateVoucherModal = ({
    show,
    formData,
    onClose,
    onSubmit,
    onInputChange,
    voucherId,
    setFormData,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const fetchVoucherDetail = async () => {
            try {
                const response = await getEnterpriseVoucherById(voucherId);
                const payload = response?.data ?? response;

                if (payload && isMounted && typeof setFormData === 'function') {
                    setFormData({
                        title: payload.title || '',
                        description: payload.description || '',
                        pointsCost: payload.pointsCost ?? 0,
                        stock: payload.stock ?? 0,
                        availableFrom: payload.availableFrom ? payload.availableFrom.slice(0, 16) : '',
                        availableTo: payload.availableTo ? payload.availableTo.slice(0, 16) : '',
                        isActive: payload.active ?? true,
                        imageUrl: payload.imageUrl || '',
                    });
                }
            } catch (error) {
                // Không chặn UI nếu lỗi lấy dữ liệu
            }
        };

        if (show && voucherId) {
            fetchVoucherDetail();
        }

        return () => {
            isMounted = false;
        };
    }, [show, voucherId, setFormData]);

    const handleUpdateVoucher = async (e) => {
        e.preventDefault();
        if (isSubmitting || !voucherId) return;

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const payload = {
                title: formData.title || '',
                description: formData.description || '',
                pointsCost: Number(formData.pointsCost) || 0,
                stock: Number(formData.stock) || 0,
                availableFrom: formData.availableFrom ? new Date(formData.availableFrom).toISOString() : null,
                availableTo: formData.availableTo ? new Date(formData.availableTo).toISOString() : null,
                isActive: !!formData.isActive,
                imageUrl: formData.imageUrl || '',
            };

            await updateEnterpriseVoucher(voucherId, payload);
            onSubmit(e);
            window.location.reload();
        } catch (error) {
            setSubmitError(error?.message || 'Cập nhật voucher thất bại. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        Chỉnh sửa voucher
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleUpdateVoucher} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiêu đề <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Nhập tiêu đề voucher"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Điểm cần đổi <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="pointsCost"
                                    value={formData.pointsCost}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Nhập số điểm cần đổi"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số lượng <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Nhập số lượng voucher"
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày bắt đầu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="availableFrom"
                                    value={formData.availableFrom}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày kết thúc <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="availableTo"
                                    value={formData.availableTo}
                                    onChange={onInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={onInputChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Nhập mô tả voucher"
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ảnh voucher
                                </label>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={onInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Nhập URL hình ảnh"
                                    />
                                    <div className="space-y-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="w-full block text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                        />
                                        <span className="text-xs text-gray-500">Chọn ảnh từ máy</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-3 text-center text-xs text-gray-500">
                                Ảnh xem trước sẽ hiển thị tại đây
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={onInputChange}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                                Kích hoạt voucher
                            </label>
                        </div>
                        {submitError ? (
                            <span className="text-sm text-red-600">{submitError}</span>
                        ) : null}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật voucher'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateVoucherModal;
