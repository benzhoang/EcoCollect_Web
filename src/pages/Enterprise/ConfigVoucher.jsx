import React, { useEffect, useState } from 'react';
import EnterpriseSidebar from '../../components/EnterpriseSidebar';
import VoucherModal from '../../components/Modal/VoucherModal';
import UpdateVoucherModal from '../../components/Modal/UpdateVoucherModal';
import { getEnterpriseVouchers } from '../../service/api';

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
        let isMounted = true;

        const fetchVouchers = async () => {
            try {
                const response = await getEnterpriseVouchers({ page: 0, size: 20 });
                const payload = response?.data ?? response;
                const items = Array.isArray(payload?.content)
                    ? payload.content
                    : Array.isArray(payload)
                        ? payload
                        : [];

                const mapped = items.map((item) => ({
                    id: item.id,
                    name: item.title || item.code || 'Voucher',
                    code: item.code || 'N/A',
                    type: item.type || 'discount_amount',
                    value: item.value ?? 0,
                    pointsRequired: item.pointsCost ?? 0,
                    quantity: item.stock ?? 0,
                    remaining: item.stock ?? 0,
                    expiryDate: item.availableTo ? item.availableTo.split('T')[0] : 'N/A',
                    description: item.description || '',
                    imageUrl: item.imageUrl || '',
                    isActive: item.active ?? true,
                    createdAt: item.createdAt ? item.createdAt.split('T')[0] : 'N/A',
                }));

                if (isMounted) {
                    setVouchers(mapped);
                }
            } catch (error) {
                if (isMounted) {
                    setVouchers([]);
                }
            }
        };

        fetchVouchers();

        return () => {
            isMounted = false;
        };
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

    const totalVouchers = vouchers.length;
    const activeVouchers = vouchers.filter((voucher) => voucher.isActive).length;
    const inactiveVouchers = totalVouchers - activeVouchers;
    const totalRemaining = vouchers.reduce((sum, voucher) => sum + (voucher.remaining || 0), 0);

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
                            <p className="text-sm text-gray-600 mb-1">Tổng voucher</p>
                            <p className="text-2xl font-bold text-gray-900">{totalVouchers}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
                            <p className="text-2xl font-bold text-green-600">{activeVouchers}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <p className="text-sm text-gray-600 mb-1">Tạm dừng</p>
                            <p className="text-2xl font-bold text-orange-600">{inactiveVouchers}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <p className="text-sm text-gray-600 mb-1">Còn lại</p>
                            <p className="text-2xl font-bold text-gray-900">{totalRemaining}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {vouchers.map((voucher) => (
                            <div key={voucher.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                                    <div className="flex flex-col lg:flex-row gap-4">
                                        <div className="w-24 h-24">
                                            {voucher.imageUrl ? (
                                                <img
                                                    src={voucher.imageUrl}
                                                    alt={voucher.name}
                                                    className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400">
                                                    Chưa có ảnh
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{voucher.name}</h3>
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getVoucherTypeColor(voucher.type)}`}>
                                                    {getVoucherTypeLabel(voucher.type)}
                                                </span>
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${voucher.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {voucher.isActive ? 'Hoạt động' : 'Tạm dừng'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">Mã: <span className="font-medium text-gray-800">{voucher.code}</span></p>
                                            <p className="text-sm text-gray-600 line-clamp-2">Mô tả: {voucher.description || 'Chưa có mô tả'}</p>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                                                <span>Điểm đổi: <span className="font-medium text-gray-800">{voucher.pointsRequired}</span></span>
                                                <span>Hết hạn: <span className="font-medium text-gray-800">{voucher.expiryDate}</span></span>
                                                <span>Số lượng: <span className="font-medium text-gray-800">{voucher.remaining}/{voucher.quantity}</span></span>
                                                <span>Ngày tạo: <span className="font-medium text-gray-800">{voucher.createdAt}</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 justify-end">
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
                                        <a
                                            href={`/enterprise/voucher/${voucher.id}`}
                                            className="p-2 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                                            title="Xem chi tiết"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <VoucherModal
                show={showVoucherModal && !editingVoucher}
                formData={voucherFormData}
                onClose={handleCloseVoucherModal}
                onSubmit={handleVoucherSubmit}
                onInputChange={handleVoucherInputChange}
            />
            <UpdateVoucherModal
                show={showVoucherModal && !!editingVoucher}
                formData={voucherFormData}
                onClose={handleCloseVoucherModal}
                onSubmit={handleVoucherSubmit}
                onInputChange={handleVoucherInputChange}
            />
        </div>
    );
};

export default ConfigVoucher;
