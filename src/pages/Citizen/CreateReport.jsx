import React, { useState, useRef } from 'react';

const CreateReport = () => {
    const [selectedWasteType, setSelectedWasteType] = useState(null);
    const [location, setLocation] = useState(null);
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
    const [imageUrl, setImageUrl] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [estimatedWeightKg, setEstimatedWeightKg] = useState('');
    const fileInputRef = useRef(null);

    const wasteTypes = [
        {
            id: 'paper',
            name: 'Rác giấy',
            description: 'Giấy in, báo, bìa carton, túi giấy',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 4h8l4 4v12H8a2 2 0 01-2-2V6a2 2 0 012-2z"
                    />
                </svg>
            )
        },
        {
            id: 'plastic',
            name: 'Rác nhựa',
            description: 'Chai nhựa, túi nilon, hộp nhựa',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 2h4l1 4v12a2 2 0 01-2 2h-2a2 2 0 01-2-2V6l1-4z"
                    />
                </svg>
            )
        },
        {
            id: 'organic',
            name: 'Rác hữu cơ',
            description: 'Thực phẩm thừa, lá cây, rác sinh học',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            )
        },
        {
            id: 'hazardous',
            name: 'Rác nguy hại',
            description: 'Pin, hóa chất, rác điện tử, y tế',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            )
        }
    ];

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            // reset file input so re-selecting the same file triggers onChange
            fileInputRef.current.value = '';
        }
    };

    const validateImageUrl = (value) => {
        const raw = (value || '').trim();
        if (!raw) return { ok: false, message: 'Vui lòng nhập URL ảnh.' };
        try {
            const u = new URL(raw);
            if (u.protocol !== 'http:' && u.protocol !== 'https:') {
                return { ok: false, message: 'URL ảnh phải bắt đầu bằng http:// hoặc https://.' };
            }
            return { ok: true };
        } catch {
            return { ok: false, message: 'URL ảnh không hợp lệ.' };
        }
    };

    const isValidLatitude = (value) => {
        const v = String(value ?? '').trim();
        if (!v) return false;
        const n = Number(v);
        return Number.isFinite(n) && n >= -90 && n <= 90;
    };

    const isValidLongitude = (value) => {
        const v = String(value ?? '').trim();
        if (!v) return false;
        const n = Number(v);
        return Number.isFinite(n) && n >= -180 && n <= 180;
    };

    const isValidEstimatedWeightKg = (value) => {
        const v = String(value ?? '').trim();
        if (!v) return false;
        const n = Number(v);
        return Number.isFinite(n) && n > 0;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('File quá lớn! Vui lòng chọn file nhỏ hơn 10MB.');
                return;
            }
            setImageMode('upload');
            setImageUrl('');
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
                    const { latitude: lat, longitude: lng } = position.coords || {};
                    if (typeof lat === 'number') setLatitude(String(lat));
                    if (typeof lng === 'number') setLongitude(String(lng));
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
        const hasImage = imageMode === 'upload' ? !!selectedImage : validateImageUrl(imageUrl).ok;
        if (!hasImage) {
            alert(imageMode === 'upload' ? 'Vui lòng tải lên hình ảnh rác.' : 'Vui lòng nhập URL ảnh hợp lệ.');
            return;
        }
        if (!selectedWasteType) {
            alert('Vui lòng chọn loại rác.');
            return;
        }
        if (!location || location.trim() === '') {
            alert('Vui lòng nhập vị trí.');
            return;
        }
        if (!isValidLatitude(latitude)) {
            alert('Vui lòng nhập vĩ độ hợp lệ (-90 đến 90).');
            return;
        }
        if (!isValidLongitude(longitude)) {
            alert('Vui lòng nhập kinh độ hợp lệ (-180 đến 180).');
            return;
        }
        if (!isValidEstimatedWeightKg(estimatedWeightKg)) {
            alert('Vui lòng nhập khối lượng ước tính (kg) hợp lệ (> 0).');
            return;
        }

        console.log({
            wasteType: selectedWasteType,
            location,
            description,
            imageMode,
            imageFile: selectedImage,
            imageUrl: imageMode === 'url' ? imageUrl.trim() : null,
            latitude: Number(latitude),
            longitude: Number(longitude),
            estimatedWeightKg: Number(estimatedWeightKg)
        });
        // Điều hướng về trang báo cáo sau khi submit
        window.location.href = '/report';
    };

    const handleCancel = () => {
        window.location.href = '/report';
    };

    // Tính toán tiến độ
    const hasValidImage = imageMode === 'upload' ? !!selectedImage : validateImageUrl(imageUrl).ok;
    const progressSteps = [
        { key: 'image', completed: hasValidImage, label: 'Hình ảnh' },
        { key: 'wasteType', completed: !!selectedWasteType, label: 'Loại rác' },
        { key: 'location', completed: !!location && location.trim() !== '', label: 'Vị trí' },
        { key: 'coordinates', completed: isValidLatitude(latitude) && isValidLongitude(longitude), label: 'Tọa độ' },
        { key: 'weight', completed: isValidEstimatedWeightKg(estimatedWeightKg), label: 'Khối lượng' }
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
                                        {completedSteps}/{progressSteps.length} bước
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
                                        {hasValidImage && (
                                            <span className="text-xs text-blue-600 font-medium flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-full">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Đã chọn
                                            </span>
                                        )}
                                    </div>

                                    {/* Image mode toggle */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageMode('upload');
                                                setImageUrl('');
                                                clearImage();
                                            }}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${imageMode === 'upload'
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            Tải file
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageMode('url');
                                                clearImage();
                                            }}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${imageMode === 'url'
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            Nhập URL
                                        </button>
                                    </div>

                                    {imageMode === 'url' && (
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <input
                                                    type="url"
                                                    value={imageUrl}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setImageUrl(v);
                                                        const r = validateImageUrl(v);
                                                        if (r.ok) setImagePreview(v.trim());
                                                        else setImagePreview(null);
                                                    }}
                                                    placeholder="https://example.com/anh.jpg"
                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all bg-white"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Hỗ trợ URL ảnh dạng http/https. (Ví dụ: https://.../image.jpg)
                                            </p>
                                        </div>
                                    )}

                                    <div
                                        onClick={() => {
                                            if (imageMode === 'upload') fileInputRef.current?.click();
                                        }}
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
                                                            if (imageMode === 'url') setImageUrl('');
                                                            clearImage();
                                                        }}
                                                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600 font-medium">
                                                    {imageMode === 'upload' ? 'Nhấn để thay đổi ảnh' : 'Xem trước ảnh từ URL'}
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
                                                        {imageMode === 'upload' ? 'Tải lên hình ảnh rác thải' : 'Nhập URL để xem trước hình ảnh'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {imageMode === 'upload'
                                                            ? 'Kéo thả hoặc nhấn để chọn file (PNG, JPG tối đa 10MB)'
                                                            : 'Dán URL ảnh vào ô bên trên'
                                                        }
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
                                            disabled={imageMode !== 'upload'}
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

                                {/* Tọa độ + Khối lượng */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-900">
                                        Tọa độ <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="block text-xs font-medium text-gray-700">
                                                Vĩ độ (Latitude)
                                            </label>
                                            <input
                                                type="number"
                                                inputMode="decimal"
                                                value={latitude}
                                                onChange={(e) => setLatitude(e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all bg-white"
                                                placeholder="Ví dụ: 10.8231"
                                            />
                                            <p className="text-xs text-gray-500">Giới hạn: -90 đến 90</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-xs font-medium text-gray-700">
                                                Kinh độ (Longitude)
                                            </label>
                                            <input
                                                type="number"
                                                inputMode="decimal"
                                                value={longitude}
                                                onChange={(e) => setLongitude(e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all bg-white"
                                                placeholder="Ví dụ: 106.6297"
                                            />
                                            <p className="text-xs text-gray-500">Giới hạn: -180 đến 180</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-900">
                                        Khối lượng ước tính (kg) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        min="0"
                                        step="0.1"
                                        value={estimatedWeightKg}
                                        onChange={(e) => setEstimatedWeightKg(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all bg-white"
                                        placeholder="Ví dụ: 2.5"
                                    />
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
                                    disabled={completedSteps < progressSteps.length}
                                    className={`w-full px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${completedSteps >= progressSteps.length
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
