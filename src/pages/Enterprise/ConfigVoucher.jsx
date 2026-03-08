import React, { useEffect, useState } from 'react';
import EnterpriseSidebar from '../../components/EnterpriseSidebar';
import VoucherModal from '../../components/Modal/VoucherModal';

const ConfigVoucher = () => {
    const [isSidebarOpen] = useState(true);
    const [vouchers, setVouchers] = useState([]);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [voucherFormData, setVoucherFormData] = useState({
        name: '',
        code: '',
        type: 'discount_percent',
        value: 0,
        pointsRequired: 0,
        quantity: 0,
        expiryDate: '',
        description: '',
        isActive: true,
    });

    useEffect(() => {
        const sampleVouchers = [
            {
                id: 1,
                name: 'Voucher giảm 10%',
                code: 'DISCOUNT10',
                type: 'discount_percent',
                value: 10,
                pointsRequired: 100,
                quantity: 50,
                remaining: 35,
                expiryDate: '2024-12-31',
                description: 'Giảm 10% cho đơn hàng từ 100.000đ',
                isActive: true,
                createdAt: '2024-01-15',
            },
            {
                id: 2,
                name: 'Voucher giảm 50.000đ',
                code: 'SAVE50K',
                type: 'discount_amount',
                value: 50000,
                pointsRequired: 200,
                quantity: 30,
                remaining: 12,
                expiryDate: '2024-11-30',
                description: 'Giảm 50.000đ cho đơn hàng từ 200.000đ',
                isActive: true,
                createdAt: '2024-01-16',
            },
            {
                id: 3,
                name: 'Miễn phí vận chuyển',
                code: 'FREESHIP',
                type: 'free_shipping',
                value: 0,
                pointsRequired: 50,
                quantity: 100,
                remaining: 78,
                expiryDate: '2024-12-31',
                description: 'Miễn phí vận chuyển cho mọi đơn hàng',
                isActive: true,
                createdAt: '2024-01-17',
            },
        ];

        setVouchers(sampleVouchers);
    }, []);

    const handleOpenVoucherModal = (voucher = null) => {
        if (voucher) {
            setEditingVoucher(voucher);
            setVoucherFormData({
                name: voucher.name,
                code: voucher.code,
                type: voucher.type,
                value: voucher.value,
                pointsRequired: voucher.pointsRequired,
                quantity: voucher.quantity,
                expiryDate: voucher.expiryDate,
                description: voucher.description || '',
                isActive: voucher.isActive,
            });
        } else {
            setEditingVoucher(null);
            setVoucherFormData({
                name: '',
                code: '',
                type: 'discount_percent',
                value: 0,
                pointsRequired: 0,
                quantity: 0,
                expiryDate: '',
                description: '',
                isActive: true,
            });
        }
        setShowVoucherModal(true);
    };

    const handleCloseVoucherModal = () => {
        setShowVoucherModal(false);
        setEditingVoucher(null);
        setVoucherFormData({
            name: '',
            code: '',
            type: 'discount_percent',
            value: 0,
            pointsRequired: 0,
            quantity: 0,
            expiryDate: '',
            description: '',
            isActive: true,
        });
    };

    const handleVoucherInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setVoucherFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleVoucherSubmit = (e) => {
        e.preventDefault();
        if (editingVoucher) {
            setVouchers((prev) =>
                prev.map((voucher) =>
                    voucher.id === editingVoucher.id
                        ? { ...editingVoucher, ...voucherFormData, remaining: editingVoucher.remaining }
                        : voucher,
                ),
            );
        } else {
            const newVoucher = {
                id: Date.now(),
                ...voucherFormData,
                remaining: voucherFormData.quantity,
                createdAt: new Date().toISOString().split('T')[0],
            };
            setVouchers((prev) => [...prev, newVoucher]);
        }
        handleCloseVoucherModal();
    };

    const handleDeleteVoucher = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
            setVouchers((prev) => prev.filter((voucher) => voucher.id !== id));
        }
    };

    const handleToggleVoucherActive = (id) => {
        setVouchers((prev) =>
            prev.map((voucher) =>
                voucher.id === id ? { ...voucher, isActive: !voucher.isActive } : voucher,
            ),
        );
    };

    const getVoucherTypeLabel = (type) => {
        switch (type) {
            case 'discount_percent':
                return 'Giảm giá %';
            case 'discount_amount':
                return 'Giảm giá số tiền';
            case 'free_shipping':
                return 'Miễn phí vận chuyển';
            case 'gift':
                return 'Quà tặng';
            default:
                return type;
        }
    };

    const getVoucherTypeColor = (type) => {
        switch (type) {
            case 'discount_percent':
                return 'bg-blue-100 text-blue-700';
            case 'discount_amount':
                return 'bg-green-100 text-green-700';
            case 'free_shipping':
                return 'bg-purple-100 text-purple-700';
            case 'gift':
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
            <EnterpriseSidebar isOpen={isSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Cấu hình Quà tặng/Voucher</h1>
                            <p className="text-sm text-gray-600">Tạo và quản lý voucher cho Citizen</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenVoucherModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Tạo voucher mới</span>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tổng voucher</p>
                                    <p className="text-2xl font-bold text-gray-900">{vouchers.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
                                    <p className="text-2xl font-bold text-green-600">{vouchers.filter((v) => v.isActive).length}</p>
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
                                    <p className="text-sm text-gray-600 mb-1">Đã tạm dừng</p>
                                    <p className="text-2xl font-bold text-gray-600">{vouchers.filter((v) => !v.isActive).length}</p>
                                </div>
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tổng đã đổi</p>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {vouchers.reduce((sum, v) => sum + (v.quantity - v.remaining), 0)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Danh sách voucher</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {vouchers.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                    </svg>
                                    <p className="text-gray-600 mb-2">Chưa có voucher nào</p>
                                    <button
                                        onClick={() => handleOpenVoucherModal()}
                                        className="text-green-600 hover:text-green-700 font-medium"
                                    >
                                        Tạo voucher đầu tiên
                                    </button>
                                </div>
                            ) : (
                                vouchers.map((voucher) => (
                                    <div key={voucher.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">{voucher.name}</h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getVoucherTypeColor(voucher.type)}`}>
                                                        {getVoucherTypeLabel(voucher.type)}
                                                    </span>
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                                        {voucher.code}
                                                    </span>
                                                    {voucher.isActive ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                            Đang hoạt động
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                                            Đã tạm dừng
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mb-2 space-y-1">
                                                    <div className="text-sm text-gray-600">
                                                        Giá trị:{' '}
                                                        <span className="font-medium text-gray-900">
                                                            {voucher.type === 'discount_percent'
                                                                ? `${voucher.value}%`
                                                                : voucher.type === 'discount_amount'
                                                                    ? `${voucher.value.toLocaleString('vi-VN')} VNĐ`
                                                                    : voucher.type === 'free_shipping'
                                                                        ? 'Miễn phí vận chuyển'
                                                                        : voucher.value}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Điểm đổi: <span className="font-medium text-gray-900">{voucher.pointsRequired} điểm</span>
                                                    </div>
                                                    {voucher.description && (
                                                        <div className="text-sm text-gray-600">
                                                            Mô tả: <span className="text-gray-700">{voucher.description}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                        Số lượng: <span className="font-semibold text-gray-900">{voucher.remaining}/{voucher.quantity}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Hết hạn: {voucher.expiryDate}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Tạo ngày: {voucher.createdAt}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => handleToggleVoucherActive(voucher.id)}
                                                    className={`p-2 rounded-lg transition-colors ${voucher.isActive ? 'text-gray-600 hover:bg-gray-100' : 'text-green-600 hover:bg-green-50'}`}
                                                    title={voucher.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                                                >
                                                    {voucher.isActive ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleOpenVoucherModal(voucher)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteVoucher(voucher.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <VoucherModal
                show={showVoucherModal}
                editingVoucher={editingVoucher}
                formData={voucherFormData}
                onClose={handleCloseVoucherModal}
                onSubmit={handleVoucherSubmit}
                onInputChange={handleVoucherInputChange}
            />
        </div>
    );
};

export default ConfigVoucher;
