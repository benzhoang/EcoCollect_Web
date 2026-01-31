import React, { useState, useEffect } from 'react';
import EnterpriseSidebar from '../../components/EnterpriseSidebar';

const EnterpriseSetting = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('capacity'); // 'capacity', 'areas', 'profile'

    // Thông tin doanh nghiệp
    const [enterpriseInfo, setEnterpriseInfo] = useState({
        name: 'RecycleCorp Ltd.',
        email: 'contact@recyclecorp.com',
        phone: '0123456789',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        taxCode: '1234567890',
        description: 'Doanh nghiệp chuyên xử lý và tái chế rác thải'
    });

    // Năng lực xử lý rác
    const [wasteCapacities, setWasteCapacities] = useState([]);
    const [showCapacityModal, setShowCapacityModal] = useState(false);
    const [editingCapacity, setEditingCapacity] = useState(null);
    const [capacityFormData, setCapacityFormData] = useState({
        wasteType: '',
        dailyCapacity: 0,
        monthlyCapacity: 0,
        unit: 'kg',
        isActive: true
    });

    // Khu vực phục vụ
    const [serviceAreas, setServiceAreas] = useState([]);
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const [areaFormData, setAreaFormData] = useState({
        district: '',
        wards: [],
        isActive: true
    });

    const wasteTypes = [
        { value: 'PET', label: 'Nhựa PET', color: 'bg-blue-100 text-blue-700', icon: '♻️' },
        { value: 'HDPE', label: 'Nhựa HDPE', color: 'bg-indigo-100 text-indigo-700', icon: '♻️' },
        { value: 'ORGANIC', label: 'Rác hữu cơ', color: 'bg-green-100 text-green-700', icon: '🌱' },
        { value: 'PAPER', label: 'Giấy vụn', color: 'bg-orange-100 text-orange-700', icon: '📄' },
        { value: 'METAL', label: 'Kim loại', color: 'bg-gray-100 text-gray-700', icon: '🔩' },
        { value: 'GLASS', label: 'Thủy tinh', color: 'bg-cyan-100 text-cyan-700', icon: '🍶' },
        { value: 'ELECTRONIC', label: 'Điện tử', color: 'bg-purple-100 text-purple-700', icon: '💻' }
    ];

    const districts = [
        { value: 'q1', label: 'Quận 1' },
        { value: 'q2', label: 'Quận 2' },
        { value: 'q3', label: 'Quận 3' },
        { value: 'q4', label: 'Quận 4' },
        { value: 'q5', label: 'Quận 5' },
        { value: 'q6', label: 'Quận 6' },
        { value: 'q7', label: 'Quận 7' },
        { value: 'q8', label: 'Quận 8' },
        { value: 'q9', label: 'Quận 9' },
        { value: 'q10', label: 'Quận 10' },
        { value: 'q11', label: 'Quận 11' },
        { value: 'q12', label: 'Quận 12' },
        { value: 'btl', label: 'Bắc Thăng Long' }
    ];

    const wards = {
        q1: ['Phường Bến Nghé', 'Phường Đa Kao', 'Phường Cô Giang', 'Phường Cầu Kho'],
        q2: ['Phường An Phú', 'Phường Thảo Điền', 'Phường Bình An', 'Phường Bình Trưng Đông'],
        q3: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4'],
        q7: ['Phường Tân Phú', 'Phường Tân Phong', 'Phường Phú Mỹ', 'Phường Bình Thuận'],
        q9: ['Phường Hiệp Phú', 'Phường Long Bình', 'Phường Long Thạnh Mỹ', 'Phường Tân Phú'],
        btl: ['Phường Cổ Nhuế', 'Phường Đông Ngạc', 'Phường Liên Mạc', 'Phường Thụy Phương']
    };

    // Load dữ liệu mẫu
    useEffect(() => {
        const sampleCapacities = [
            {
                id: 1,
                wasteType: 'PET',
                dailyCapacity: 5000,
                monthlyCapacity: 150000,
                unit: 'kg',
                isActive: true,
                createdAt: '2024-01-15'
            },
            {
                id: 2,
                wasteType: 'ORGANIC',
                dailyCapacity: 8000,
                monthlyCapacity: 240000,
                unit: 'kg',
                isActive: true,
                createdAt: '2024-01-15'
            },
            {
                id: 3,
                wasteType: 'PAPER',
                dailyCapacity: 3000,
                monthlyCapacity: 90000,
                unit: 'kg',
                isActive: true,
                createdAt: '2024-01-16'
            }
        ];
        setWasteCapacities(sampleCapacities);

        const sampleAreas = [
            {
                id: 1,
                district: 'q1',
                wards: ['Phường Bến Nghé', 'Phường Đa Kao'],
                isActive: true,
                createdAt: '2024-01-15'
            },
            {
                id: 2,
                district: 'q7',
                wards: ['Phường Tân Phú', 'Phường Tân Phong'],
                isActive: true,
                createdAt: '2024-01-15'
            },
            {
                id: 3,
                district: 'q9',
                wards: ['Phường Hiệp Phú', 'Phường Long Bình'],
                isActive: true,
                createdAt: '2024-01-16'
            }
        ];
        setServiceAreas(sampleAreas);
    }, []);

    // Handlers cho Capacity
    const handleOpenCapacityModal = (capacity = null) => {
        if (capacity) {
            setEditingCapacity(capacity);
            setCapacityFormData({
                wasteType: capacity.wasteType,
                dailyCapacity: capacity.dailyCapacity,
                monthlyCapacity: capacity.monthlyCapacity,
                unit: capacity.unit,
                isActive: capacity.isActive
            });
        } else {
            setEditingCapacity(null);
            setCapacityFormData({
                wasteType: '',
                dailyCapacity: 0,
                monthlyCapacity: 0,
                unit: 'kg',
                isActive: true
            });
        }
        setShowCapacityModal(true);
    };

    const handleCloseCapacityModal = () => {
        setShowCapacityModal(false);
        setEditingCapacity(null);
        setCapacityFormData({
            wasteType: '',
            dailyCapacity: 0,
            monthlyCapacity: 0,
            unit: 'kg',
            isActive: true
        });
    };

    const handleCapacityInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCapacityFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
        }));
    };

    const handleCapacitySubmit = (e) => {
        e.preventDefault();
        if (editingCapacity) {
            setWasteCapacities(prev => prev.map(cap =>
                cap.id === editingCapacity.id ? { ...editingCapacity, ...capacityFormData } : cap
            ));
        } else {
            const newCapacity = {
                id: Date.now(),
                ...capacityFormData,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setWasteCapacities(prev => [...prev, newCapacity]);
        }
        handleCloseCapacityModal();
    };

    const handleDeleteCapacity = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa năng lực xử lý này?')) {
            setWasteCapacities(prev => prev.filter(cap => cap.id !== id));
        }
    };

    const handleToggleCapacityActive = (id) => {
        setWasteCapacities(prev => prev.map(cap =>
            cap.id === id ? { ...cap, isActive: !cap.isActive } : cap
        ));
    };

    // Handlers cho Service Areas
    const handleOpenAreaModal = (area = null) => {
        if (area) {
            setEditingArea(area);
            setAreaFormData({
                district: area.district,
                wards: area.wards,
                isActive: area.isActive
            });
        } else {
            setEditingArea(null);
            setAreaFormData({
                district: '',
                wards: [],
                isActive: true
            });
        }
        setShowAreaModal(true);
    };

    const handleCloseAreaModal = () => {
        setShowAreaModal(false);
        setEditingArea(null);
        setAreaFormData({
            district: '',
            wards: [],
            isActive: true
        });
    };

    const handleAreaInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'district') {
            setAreaFormData(prev => ({
                ...prev,
                district: value,
                wards: [] // Reset wards when district changes
            }));
        } else {
            setAreaFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleWardToggle = (ward) => {
        setAreaFormData(prev => ({
            ...prev,
            wards: prev.wards.includes(ward)
                ? prev.wards.filter(w => w !== ward)
                : [...prev.wards, ward]
        }));
    };

    const handleAreaSubmit = (e) => {
        e.preventDefault();
        if (editingArea) {
            setServiceAreas(prev => prev.map(area =>
                area.id === editingArea.id ? { ...editingArea, ...areaFormData } : area
            ));
        } else {
            const newArea = {
                id: Date.now(),
                ...areaFormData,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setServiceAreas(prev => [...prev, newArea]);
        }
        handleCloseAreaModal();
    };

    const handleDeleteArea = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa khu vực phục vụ này?')) {
            setServiceAreas(prev => prev.filter(area => area.id !== id));
        }
    };

    const handleToggleAreaActive = (id) => {
        setServiceAreas(prev => prev.map(area =>
            area.id === id ? { ...area, isActive: !area.isActive } : area
        ));
    };

    // Handlers cho Enterprise Info
    const handleEnterpriseInfoChange = (e) => {
        const { name, value } = e.target;
        setEnterpriseInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveEnterpriseInfo = () => {
        // Save enterprise info
        alert('Đã lưu thông tin doanh nghiệp thành công!');
    };

    const getWasteTypeLabel = (type) => {
        const found = wasteTypes.find(t => t.value === type);
        return found ? found.label : type;
    };

    const getWasteTypeColor = (type) => {
        const found = wasteTypes.find(t => t.value === type);
        return found ? found.color : 'bg-gray-100 text-gray-700';
    };

    const getDistrictName = (district) => {
        const found = districts.find(d => d.value === district);
        return found ? found.label : district;
    };

    const getAvailableWards = () => {
        if (!areaFormData.district) return [];
        return wards[areaFormData.district] || [];
    };

    const formatNumber = (num) => {
        return num.toLocaleString('vi-VN');
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
                            <h1 className="text-2xl font-bold text-gray-900">Cài đặt doanh nghiệp</h1>
                            <p className="text-sm text-gray-600">Quản lý thông tin và năng lực xử lý rác của doanh nghiệp</p>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 border-b border-gray-200 mb-6">
                        <button
                            onClick={() => setActiveTab('capacity')}
                            className={`px-4 py-2 font-medium text-sm relative ${activeTab === 'capacity'
                                ? 'text-green-600 border-b-2 border-green-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Năng lực xử lý rác
                        </button>
                        <button
                            onClick={() => setActiveTab('areas')}
                            className={`px-4 py-2 font-medium text-sm relative ${activeTab === 'areas'
                                ? 'text-green-600 border-b-2 border-green-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Khu vực phục vụ
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-2 font-medium text-sm relative ${activeTab === 'profile'
                                ? 'text-green-600 border-b-2 border-green-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Thông tin doanh nghiệp
                        </button>
                    </div>

                    {/* Tab Content: Capacity */}
                    {activeTab === 'capacity' && (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Tổng loại rác</p>
                                            <p className="text-2xl font-bold text-gray-900">{wasteCapacities.length}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Tổng công suất/ngày</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                {formatNumber(wasteCapacities.reduce((sum, cap) => sum + (cap.isActive ? cap.dailyCapacity : 0), 0))} kg
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Tổng công suất/tháng</p>
                                            <p className="text-2xl font-bold text-orange-600">
                                                {formatNumber(wasteCapacities.reduce((sum, cap) => sum + (cap.isActive ? cap.monthlyCapacity : 0), 0))} kg
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
                                            <p className="text-2xl font-bold text-purple-600">
                                                {wasteCapacities.filter(cap => cap.isActive).length}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Add Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => handleOpenCapacityModal()}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Thêm năng lực xử lý</span>
                                </button>
                            </div>

                            {/* Capacity List */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Danh sách năng lực xử lý</h2>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {wasteCapacities.length === 0 ? (
                                        <div className="px-6 py-12 text-center">
                                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <p className="text-gray-600 mb-2">Chưa có năng lực xử lý nào</p>
                                            <button
                                                onClick={() => handleOpenCapacityModal()}
                                                className="text-green-600 hover:text-green-700 font-medium"
                                            >
                                                Thêm năng lực đầu tiên
                                            </button>
                                        </div>
                                    ) : (
                                        wasteCapacities.map((capacity) => (
                                            <div key={capacity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getWasteTypeColor(capacity.wasteType)}`}>
                                                                {getWasteTypeLabel(capacity.wasteType)}
                                                            </span>
                                                            {capacity.isActive ? (
                                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                                    Đang hoạt động
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                                                    Đã tạm dừng
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 mb-2">
                                                            <div>
                                                                <span className="text-sm text-gray-600">Công suất/ngày: </span>
                                                                <span className="text-sm font-semibold text-gray-900">
                                                                    {formatNumber(capacity.dailyCapacity)} {capacity.unit}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-600">Công suất/tháng: </span>
                                                                <span className="text-sm font-semibold text-gray-900">
                                                                    {formatNumber(capacity.monthlyCapacity)} {capacity.unit}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Tạo ngày: {capacity.createdAt}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <button
                                                            onClick={() => handleToggleCapacityActive(capacity.id)}
                                                            className={`p-2 rounded-lg transition-colors ${capacity.isActive
                                                                ? 'text-gray-600 hover:bg-gray-100'
                                                                : 'text-green-600 hover:bg-green-50'
                                                                }`}
                                                            title={capacity.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                                                        >
                                                            {capacity.isActive ? (
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
                                                            onClick={() => handleOpenCapacityModal(capacity)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCapacity(capacity.id)}
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
                    )}

                    {/* Tab Content: Service Areas */}
                    {activeTab === 'areas' && (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Tổng khu vực</p>
                                            <p className="text-2xl font-bold text-gray-900">{serviceAreas.length}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Tổng phường/xã</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                {serviceAreas.reduce((sum, area) => sum + area.wards.length, 0)}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
                                            <p className="text-2xl font-bold text-purple-600">
                                                {serviceAreas.filter(area => area.isActive).length}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Add Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => handleOpenAreaModal()}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Thêm khu vực phục vụ</span>
                                </button>
                            </div>

                            {/* Areas List */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Danh sách khu vực phục vụ</h2>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {serviceAreas.length === 0 ? (
                                        <div className="px-6 py-12 text-center">
                                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p className="text-gray-600 mb-2">Chưa có khu vực phục vụ nào</p>
                                            <button
                                                onClick={() => handleOpenAreaModal()}
                                                className="text-green-600 hover:text-green-700 font-medium"
                                            >
                                                Thêm khu vực đầu tiên
                                            </button>
                                        </div>
                                    ) : (
                                        serviceAreas.map((area) => (
                                            <div key={area.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-900">{getDistrictName(area.district)}</h3>
                                                            {area.isActive ? (
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
                                                            <span className="text-sm text-gray-600">Phường/Xã phục vụ: </span>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {area.wards.map((ward, index) => (
                                                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                                        {ward}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Tạo ngày: {area.createdAt}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <button
                                                            onClick={() => handleToggleAreaActive(area.id)}
                                                            className={`p-2 rounded-lg transition-colors ${area.isActive
                                                                ? 'text-gray-600 hover:bg-gray-100'
                                                                : 'text-green-600 hover:bg-green-50'
                                                                }`}
                                                            title={area.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                                                        >
                                                            {area.isActive ? (
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
                                                            onClick={() => handleOpenAreaModal(area)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteArea(area.id)}
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
                    )}

                    {/* Tab Content: Enterprise Profile */}
                    {activeTab === 'profile' && (
                        <div className="max-w-3xl">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin doanh nghiệp</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên doanh nghiệp *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={enterpriseInfo.name}
                                            onChange={handleEnterpriseInfoChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={enterpriseInfo.email}
                                                onChange={handleEnterpriseInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={enterpriseInfo.phone}
                                                onChange={handleEnterpriseInfoChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ *</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={enterpriseInfo.address}
                                            onChange={handleEnterpriseInfoChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mã số thuế *</label>
                                        <input
                                            type="text"
                                            name="taxCode"
                                            value={enterpriseInfo.taxCode}
                                            onChange={handleEnterpriseInfoChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                                        <textarea
                                            name="description"
                                            value={enterpriseInfo.description}
                                            onChange={handleEnterpriseInfoChange}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={handleSaveEnterpriseInfo}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Lưu thông tin
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Capacity Modal */}
            {showCapacityModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingCapacity ? 'Chỉnh sửa năng lực xử lý' : 'Thêm năng lực xử lý'}
                            </h3>
                            <button
                                onClick={handleCloseCapacityModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleCapacitySubmit} className="px-6 py-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại rác *</label>
                                    <select
                                        name="wasteType"
                                        value={capacityFormData.wasteType}
                                        onChange={handleCapacityInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    >
                                        <option value="">Chọn loại rác</option>
                                        {wasteTypes.filter(t => t.value !== 'all').map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Công suất/ngày (kg) *</label>
                                        <input
                                            type="number"
                                            name="dailyCapacity"
                                            value={capacityFormData.dailyCapacity}
                                            onChange={handleCapacityInputChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Công suất/tháng (kg) *</label>
                                        <input
                                            type="number"
                                            name="monthlyCapacity"
                                            value={capacityFormData.monthlyCapacity}
                                            onChange={handleCapacityInputChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị</label>
                                    <select
                                        name="unit"
                                        value={capacityFormData.unit}
                                        onChange={handleCapacityInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="kg">Kilogram (kg)</option>
                                        <option value="ton">Tấn (tấn)</option>
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={capacityFormData.isActive}
                                        onChange={handleCapacityInputChange}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">Kích hoạt ngay</label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseCapacityModal}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    {editingCapacity ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Area Modal */}
            {showAreaModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingArea ? 'Chỉnh sửa khu vực phục vụ' : 'Thêm khu vực phục vụ'}
                            </h3>
                            <button
                                onClick={handleCloseAreaModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAreaSubmit} className="px-6 py-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện *</label>
                                    <select
                                        name="district"
                                        value={areaFormData.district}
                                        onChange={handleAreaInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    >
                                        <option value="">Chọn quận/huyện</option>
                                        {districts.filter(d => d.value !== 'all').map(district => (
                                            <option key={district.value} value={district.value}>{district.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {areaFormData.district && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phường/Xã phục vụ *</label>
                                        <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                                            {getAvailableWards().length === 0 ? (
                                                <p className="text-sm text-gray-500">Chưa có dữ liệu phường/xã cho quận này</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {getAvailableWards().map((ward) => (
                                                        <label key={ward} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={areaFormData.wards.includes(ward)}
                                                                onChange={() => handleWardToggle(ward)}
                                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">{ward}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {areaFormData.wards.length === 0 && (
                                            <p className="text-xs text-red-600 mt-1">Vui lòng chọn ít nhất một phường/xã</p>
                                        )}
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={areaFormData.isActive}
                                        onChange={handleAreaInputChange}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">Kích hoạt ngay</label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseAreaModal}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={!areaFormData.district || areaFormData.wards.length === 0}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editingArea ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnterpriseSetting;