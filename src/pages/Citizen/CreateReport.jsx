import React, { useState, useRef } from 'react';

const CreateReport = () => {
    const [selectedWasteType, setSelectedWasteType] = useState(null);
    const [location, setLocation] = useState(null);
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const wasteTypes = [
        {
            id: 'recyclable',
            name: 'Rác tái chế',
            description: 'Nhựa, giấy, kim loại, thủy tinh',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            )
        },
        {
            id: 'organic',
            name: 'Rác hữu cơ',
            description: 'Thực phẩm, lá cây, rác sinh học',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            id: 'hazardous',
            name: 'Rác nguy hại',
            description: 'Pin, hóa chất, điện từ',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        },
        {
            id: 'general',
            name: 'Rác thông thường',
            description: 'Rác sinh hoạt không tái chế',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            )
        }
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('File quá lớn! Vui lòng chọn file nhỏ hơn 10MB.');
                return;
            }
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Có thể sử dụng API để reverse geocoding
                    // Tạm thời giữ nguyên địa chỉ mặc định
                    alert('Đã lấy vị trí hiện tại!');
                },
                (error) => {
                    alert('Không thể lấy vị trí. Vui lòng nhập thủ công.');
                }
            );
        } else {
            alert('Trình duyệt không hỗ trợ lấy vị trí.');
        }
    };

    const handleSubmit = () => {
        // Xử lý submit form
        console.log({
            wasteType: selectedWasteType,
            location,
            description,
            image: selectedImage
        });
        // Điều hướng về trang báo cáo sau khi submit
        window.location.href = '/report';
    };

    const handleCancel = () => {
        window.location.href = '/report';
    };

    // Tính toán tiến độ
    const progressSteps = [
        { key: 'image', completed: !!selectedImage, label: 'Hình ảnh' },
        { key: 'wasteType', completed: !!selectedWasteType, label: 'Loại rác' },
        { key: 'location', completed: !!location && location.trim() !== '', label: 'Vị trí' }
    ];
    const completedSteps = progressSteps.filter(step => step.completed).length;
    const progressPercentage = (completedSteps / progressSteps.length) * 100;

    return (
        <div className="min-h-screen w-full bg-gray-50">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Form Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Progress Indicator */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Tiến độ hoàn thành</span>
                                    <span className="text-sm font-semibold text-blue-600">
                                        {completedSteps}/3 bước
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                                <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                                    {progressSteps.map((step) => (
                                        <span key={step.key} className={step.completed ? 'text-blue-600 font-medium' : ''}>
                                            {step.completed ? '✓' : '○'} {step.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 md:p-8 space-y-6">
                                {/* Hình ảnh rác */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-semibold text-gray-900">
                                            Hình ảnh rác <span className="text-red-500">*</span>
                                        </label>
                                        {selectedImage && (
                                            <span className="text-xs text-blue-600 font-medium flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-full">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Đã tải lên
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative border-2 border-dashed rounded-lg p-6 md:p-8 text-center cursor-pointer transition-all duration-200 ${imagePreview
                                            ? 'border-blue-300 bg-blue-50'
                                            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                                            }`}
                                    >
                                        {imagePreview ? (
                                            <div className="space-y-4">
                                                <div className="relative inline-block">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="max-w-full max-h-80 mx-auto rounded-xl object-cover shadow-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedImage(null);
                                                            setImagePreview(null);
                                                        }}
                                                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Nhấn để thay đổi ảnh
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="flex justify-center">
                                                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                                        Tải lên hình ảnh rác thải
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Kéo thả hoặc nhấn để chọn file (PNG, JPG tối đa 10MB)
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                {/* Loại rác */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-900">
                                        Loại rác <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {wasteTypes.map((type) => {
                                            const isSelected = selectedWasteType === type.name;
                                            return (
                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => setSelectedWasteType(type.name)}
                                                    className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left group ${isSelected
                                                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                                                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isSelected
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                                                                }`}
                                                        >
                                                            {type.icon}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3
                                                                    className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-900'
                                                                        }`}
                                                                >
                                                                    {type.name}
                                                                </h3>
                                                                {isSelected && (
                                                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-600">
                                                                {type.description}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="absolute top-2 right-2">
                                                                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Vị trí */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-900">
                                        Vị trí <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                value={location || ''}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all bg-white"
                                                placeholder="Nhập địa chỉ cụ thể của rác thải..."
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleGetCurrentLocation}
                                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>Lấy vị trí hiện tại</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Mô tả */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-900">
                                        Mô tả thêm <span className="text-gray-500 font-normal">(tùy chọn)</span>
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        maxLength={500}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none transition-all bg-white"
                                        placeholder="Mô tả thêm về tình trạng, số lượng, hoặc bất kỳ thông tin nào khác về rác thải cần thu gom..."
                                    />
                                    <p className="text-xs text-gray-500 text-right">
                                        {description.length}/500 ký tự
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Thao tác</h3>
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-full px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={completedSteps < 3}
                                    className={`w-full px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${completedSteps >= 3
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    <span className="flex items-center gap-2 justify-center">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Gửi báo cáo
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateReport;
