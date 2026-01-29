import React, { useState, useEffect } from 'react';
import EnterpriseSidebar from '../../components/EnterpriseSidebar';
import ConfigPointModal from '../../components/Modal/ConfigPointModal';
import VoucherModal from '../../components/Modal/VoucherModal';

const ConfigPoint = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('rules'); // 'rules' or 'vouchers'
    const [rules, setRules] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'waste_type', // waste_type, report_quality, processing_time
        conditions: {},
        points: 0,
        isActive: true
    });
    const [voucherFormData, setVoucherFormData] = useState({
        name: '',
        code: '',
        type: 'discount_percent',
        value: 0,
        pointsRequired: 0,
        quantity: 0,
        expiryDate: '',
        description: '',
        isActive: true
    });

    // Dữ liệu mẫu
    useEffect(() => {
        const sampleRules = [
            {
                id: 1,
                name: 'Điểm thưởng cho rác nhựa PET',
                type: 'waste_type',
                conditions: { wasteType: 'PET', minWeight: 10 },
                points: 50,
                isActive: true,
                createdAt: '2024-01-15'
            },
            {
                id: 2,
                name: 'Điểm thưởng cho báo cáo chất lượng cao',
                type: 'report_quality',
                conditions: { qualityScore: 8, hasImages: true },
                points: 30,
                isActive: true,
                createdAt: '2024-01-16'
            },
            {
                id: 3,
                name: 'Điểm thưởng xử lý nhanh',
                type: 'processing_time',
                conditions: { maxHours: 24 },
                points: 20,
                isActive: true,
                createdAt: '2024-01-17'
            }
        ];
        setRules(sampleRules);

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
                createdAt: '2024-01-15'
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
                createdAt: '2024-01-16'
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
                createdAt: '2024-01-17'
            }
        ];
        setVouchers(sampleVouchers);
    }, []);

    const wasteTypes = [
        { value: 'PET', label: 'Nhựa PET', color: 'bg-blue-100 text-blue-700' },
        { value: 'HDPE', label: 'Nhựa HDPE', color: 'bg-indigo-100 text-indigo-700' },
        { value: 'ORGANIC', label: 'Rác hữu cơ', color: 'bg-green-100 text-green-700' },
        { value: 'PAPER', label: 'Giấy vụn', color: 'bg-orange-100 text-orange-700' },
        { value: 'METAL', label: 'Kim loại', color: 'bg-gray-100 text-gray-700' },
        { value: 'GLASS', label: 'Thủy tinh', color: 'bg-cyan-100 text-cyan-700' },
        { value: 'ELECTRONIC', label: 'Điện tử', color: 'bg-purple-100 text-purple-700' }
    ];

    const handleOpenModal = (rule = null) => {
        if (rule) {
            setEditingRule(rule);
            setFormData({
                name: rule.name,
                type: rule.type,
                conditions: rule.conditions,
                points: rule.points,
                isActive: rule.isActive
            });
        } else {
            setEditingRule(null);
            setFormData({
                name: '',
                type: 'waste_type',
                conditions: {},
                points: 0,
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingRule(null);
        setFormData({
            name: '',
            type: 'waste_type',
            conditions: {},
            points: 0,
            isActive: true
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleConditionChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            conditions: {
                ...prev.conditions,
                [key]: value
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingRule) {
            // Cập nhật quy tắc
            setRules(prev => prev.map(rule =>
                rule.id === editingRule.id
                    ? { ...editingRule, ...formData }
                    : rule
            ));
        } else {
            // Tạo quy tắc mới
            const newRule = {
                id: Date.now(),
                ...formData,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setRules(prev => [...prev, newRule]);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa quy tắc này?')) {
            setRules(prev => prev.filter(rule => rule.id !== id));
        }
    };

    const handleToggleActive = (id) => {
        setRules(prev => prev.map(rule =>
            rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
        ));
    };

    // Voucher handlers
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
                isActive: voucher.isActive
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
                isActive: true
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
            isActive: true
        });
    };

    const handleVoucherInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setVoucherFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
        }));
    };

    const handleVoucherSubmit = (e) => {
        e.preventDefault();
        if (editingVoucher) {
            setVouchers(prev => prev.map(voucher =>
                voucher.id === editingVoucher.id
                    ? { ...editingVoucher, ...voucherFormData, remaining: editingVoucher.remaining }
                    : voucher
            ));
        } else {
            const newVoucher = {
                id: Date.now(),
                ...voucherFormData,
                remaining: voucherFormData.quantity,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setVouchers(prev => [...prev, newVoucher]);
        }
        handleCloseVoucherModal();
    };

    const handleDeleteVoucher = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
            setVouchers(prev => prev.filter(voucher => voucher.id !== id));
        }
    };

    const handleToggleVoucherActive = (id) => {
        setVouchers(prev => prev.map(voucher =>
            voucher.id === id ? { ...voucher, isActive: !voucher.isActive } : voucher
        ));
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

    const getTypeLabel = (type) => {
        switch (type) {
            case 'waste_type':
                return 'Loại rác thải';
            case 'report_quality':
                return 'Chất lượng báo cáo';
            case 'processing_time':
                return 'Thời gian xử lý';
            default:
                return type;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'waste_type':
                return 'bg-blue-100 text-blue-700';
            case 'report_quality':
                return 'bg-green-100 text-green-700';
            case 'processing_time':
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const renderConditionDisplay = (rule) => {
        switch (rule.type) {
            case 'waste_type':
                const wasteType = wasteTypes.find(t => t.value === rule.conditions.wasteType);
                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Loại rác:</span>
                            {wasteType && (
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${wasteType.color}`}>
                                    {wasteType.label}
                                </span>
                            )}
                        </div>
                        {rule.conditions.minWeight && (
                            <div className="text-sm text-gray-600">
                                Khối lượng tối thiểu: <span className="font-medium">{rule.conditions.minWeight} kg</span>
                            </div>
                        )}
                    </div>
                );
            case 'report_quality':
                return (
                    <div className="space-y-1">
                        {rule.conditions.qualityScore && (
                            <div className="text-sm text-gray-600">
                                Điểm chất lượng tối thiểu: <span className="font-medium">{rule.conditions.qualityScore}/10</span>
                            </div>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            {rule.conditions.hasImages && (
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Có hình ảnh
                                </span>
                            )}
                            {rule.conditions.hasDescription && (
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Có mô tả
                                </span>
                            )}
                        </div>
                    </div>
                );
            case 'processing_time':
                return (
                    <div className="space-y-1">
                        {rule.conditions.maxHours && (
                            <div className="text-sm text-gray-600">
                                Xử lý trong vòng: <span className="font-medium">{rule.conditions.maxHours} giờ</span>
                            </div>
                        )}
                        {rule.conditions.minHours && (
                            <div className="text-sm text-gray-600">
                                Tối thiểu: <span className="font-medium">{rule.conditions.minHours} giờ</span>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
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
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Cấu hình điểm thưởng & Quà tặng</h1>
                            <p className="text-sm text-gray-600">Tạo và quản lý quy tắc tính điểm thưởng và voucher cho Citizen</p>
                        </div>
                    </div>
                    <button
                        onClick={() => activeTab === 'rules' ? handleOpenModal() : handleOpenVoucherModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>{activeTab === 'rules' ? 'Tạo quy tắc mới' : 'Tạo voucher mới'}</span>
                    </button>
                </header>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 border-b border-gray-200 mb-6">
                        <button
                            onClick={() => setActiveTab('rules')}
                            className={`px-4 py-2 font-medium text-sm relative ${activeTab === 'rules'
                                ? 'text-green-600 border-b-2 border-green-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Quy tắc điểm thưởng
                        </button>
                        <button
                            onClick={() => setActiveTab('vouchers')}
                            className={`px-4 py-2 font-medium text-sm relative ${activeTab === 'vouchers'
                                ? 'text-green-600 border-b-2 border-green-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Quà tặng/Voucher
                        </button>
                    </div>

                    {/* Statistics Cards */}
                    {activeTab === 'rules' ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Tổng quy tắc</p>
                                        <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
                                        <p className="text-2xl font-bold text-green-600">{rules.filter(r => r.isActive).length}</p>
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
                                        <p className="text-2xl font-bold text-gray-600">{rules.filter(r => !r.isActive).length}</p>
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
                                        <p className="text-sm text-gray-600 mb-1">Tổng điểm tối đa</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            {rules.reduce((sum, rule) => sum + (rule.isActive ? rule.points : 0), 0)}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
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
                                        <p className="text-2xl font-bold text-green-600">{vouchers.filter(v => v.isActive).length}</p>
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
                                        <p className="text-2xl font-bold text-gray-600">{vouchers.filter(v => !v.isActive).length}</p>
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
                    )}

                    {/* Rules List */}
                    {activeTab === 'rules' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Danh sách quy tắc</h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {rules.length === 0 ? (
                                    <div className="px-6 py-12 text-center">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-gray-600 mb-2">Chưa có quy tắc nào</p>
                                        <button
                                            onClick={() => handleOpenModal()}
                                            className="text-green-600 hover:text-green-700 font-medium"
                                        >
                                            Tạo quy tắc đầu tiên
                                        </button>
                                    </div>
                                ) : (
                                    rules.map((rule) => (
                                        <div key={rule.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(rule.type)}`}>
                                                            {getTypeLabel(rule.type)}
                                                        </span>
                                                        {rule.isActive ? (
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                                Đang hoạt động
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                                                Đã tạm dừng
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mb-2">
                                                        {renderConditionDisplay(rule)}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="font-semibold text-gray-900">{rule.points} điểm</span>
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            Tạo ngày: {rule.createdAt}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <button
                                                        onClick={() => handleToggleActive(rule.id)}
                                                        className={`p-2 rounded-lg transition-colors ${rule.isActive
                                                            ? 'text-gray-600 hover:bg-gray-100'
                                                            : 'text-green-600 hover:bg-green-50'
                                                            }`}
                                                        title={rule.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                                                    >
                                                        {rule.isActive ? (
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
                                                        onClick={() => handleOpenModal(rule)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(rule.id)}
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
                    )}

                    {/* Vouchers List */}
                    {activeTab === 'vouchers' && (
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
                                                            Giá trị: <span className="font-medium text-gray-900">
                                                                {voucher.type === 'discount_percent' ? `${voucher.value}%` :
                                                                    voucher.type === 'discount_amount' ? `${voucher.value.toLocaleString('vi-VN')} VNĐ` :
                                                                        voucher.type === 'free_shipping' ? 'Miễn phí vận chuyển' : voucher.value}
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
                                                        className={`p-2 rounded-lg transition-colors ${voucher.isActive
                                                            ? 'text-gray-600 hover:bg-gray-100'
                                                            : 'text-green-600 hover:bg-green-50'
                                                            }`}
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
                    )}
                </div>
            </div>

            <ConfigPointModal
                show={showModal}
                editingRule={editingRule}
                formData={formData}
                wasteTypes={wasteTypes}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                onInputChange={handleInputChange}
                onConditionChange={handleConditionChange}
            />

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

export default ConfigPoint;
