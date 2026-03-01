import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { createCitizenReport, getAreaTree } from '../../service/api';

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
    const [areaId, setAreaId] = useState(null);
    const [areaTree, setAreaTree] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const wasteTypes = [
        {
            // code: PAPER
            id: 'paper',
            // Sử dụng UUID thật trong bảng waste_categories cho PAPER
            categoryId: '44444444-4444-4444-4444-444444444444',
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
            // code: PLASTIC
            id: 'plastic',
            // Sử dụng UUID thật trong bảng waste_categories cho PLASTIC
            categoryId: '55555555-5555-5555-5555-555555555555',
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
            // code: ORGANIC
            id: 'organic',
            // Sử dụng UUID thật trong bảng waste_categories cho ORGANIC
            categoryId: '66666666-6666-6666-6666-666666666666',
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
            // code: HAZARDOUS
            id: 'hazardous',
            // Sử dụng UUID thật trong bảng waste_categories cho HAZARDOUS
            categoryId: '77777777-7777-7777-7777-777777777777',
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

    useEffect(() => {
        const loadAreaTree = async () => {
            try {
                const response = await getAreaTree();
                if (response && response.data) {
                    setAreaTree(response.data);
                }
            } catch (error) {
                console.error('Không thể tải danh sách khu vực:', error);
            }
        };
        loadAreaTree();
    }, []);

    const findAreaIdByAddress = (addressText) => {
        if (!addressText || !areaTree) return null;

        const addressLower = addressText.toLowerCase().trim();

        const searchArea = (areas, bestMatch = null) => {
            if (!areas || !Array.isArray(areas)) return bestMatch;

            for (const area of areas) {
                if (area.name) {
                    const areaNameLower = area.name.toLowerCase();
                    if (addressLower.includes(areaNameLower) || areaNameLower.includes(addressLower)) {
                        if (area.children && area.children.length > 0) {
                            const childMatch = searchArea(area.children, area.id);
                            if (childMatch) return childMatch;
                        }
                        if (area.id) {
                            bestMatch = area.id;
                        }
                    }
                }
                if (area.children && area.children.length > 0) {
                    const childMatch = searchArea(area.children, bestMatch);
                    if (childMatch) bestMatch = childMatch;
                }
            }
            return bestMatch;
        };

        const result = searchArea(Array.isArray(areaTree) ? areaTree : [areaTree]);
        return result;
    };

    useEffect(() => {
        if (location && location.trim() !== '') {
            const matchedAreaId = findAreaIdByAddress(location);
            setAreaId(matchedAreaId);
        } else {
            setAreaId(null);
        }
    }, [location, areaTree]);

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
                toast.error('File quá lớn! Vui lòng chọn file nhỏ hơn 10MB.', {
                    duration: 4000,
                });
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
                    toast.success('Đã lấy vị trí hiện tại!', {
                        duration: 2000,
                    });
                },
                (error) => {
                    console.error('Lỗi lấy vị trí hiện tại:', error);
                    toast.error('Không thể lấy vị trí. Vui lòng nhập thủ công.', {
                        duration: 4000,
                    });
                }
            );
        } else {
            toast.error('Trình duyệt không hỗ trợ lấy vị trí.', {
                duration: 4000,
            });
        }
    };

    // 将文件转换为 base64 数据 URL
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async () => {
        // Xử lý submit form
        const hasImage = imageMode === 'upload' ? !!selectedImage : validateImageUrl(imageUrl).ok;
        if (!hasImage) {
            toast.error(imageMode === 'upload' ? 'Vui lòng tải lên hình ảnh rác.' : 'Vui lòng nhập URL ảnh hợp lệ.', {
                duration: 4000,
            });
            return;
        }
        if (!selectedWasteType) {
            toast.error('Vui lòng chọn loại rác.', {
                duration: 4000,
            });
            return;
        }
        if (!location || location.trim() === '') {
            toast.error('Vui lòng nhập vị trí.', {
                duration: 4000,
            });
            return;
        }
        if (!areaId) {
            toast.error('Không thể xác định khu vực từ địa chỉ. Vui lòng kiểm tra lại địa chỉ.', {
                duration: 4000,
            });
            return;
        }
        if (!isValidLatitude(latitude)) {
            toast.error('Vui lòng nhập vĩ độ hợp lệ (-90 đến 90).', {
                duration: 4000,
            });
            return;
        }
        if (!isValidLongitude(longitude)) {
            toast.error('Vui lòng nhập kinh độ hợp lệ (-180 đến 180).', {
                duration: 4000,
            });
            return;
        }
        if (!isValidEstimatedWeightKg(estimatedWeightKg)) {
            toast.error('Vui lòng nhập khối lượng ước tính (kg) hợp lệ (> 0).', {
                duration: 4000,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // 获取选中的 waste type 的 categoryId
            const selectedType = wasteTypes.find(type => type.name === selectedWasteType);
            if (!selectedType || !selectedType.categoryId) {
                throw new Error('Không tìm thấy loại rác được chọn.');
            }

            // 处理图片 URLs
            let imageUrls = [];
            if (imageMode === 'url') {
                const url = imageUrl.trim();
                if (url) {
                    imageUrls = [url];
                }
            } else if (selectedImage) {
                // 如果是上传的文件，转换为 base64 数据 URL
                const base64Url = await fileToBase64(selectedImage);
                imageUrls = [base64Url];
            }

            if (imageUrls.length === 0) {
                throw new Error('Vui lòng cung cấp ít nhất một hình ảnh.');
            }

            // 准备 API 请求数据
            const reportData = {
                areaId: areaId,
                wasteCategoryId: selectedType.categoryId,
                description: description.trim() || '',
                estimatedWeightKg: Number(estimatedWeightKg),
                latitude: Number(latitude),
                longitude: Number(longitude),
                addressText: location.trim(),
                imageUrls: imageUrls
            };

            // 调用 API 创建报告
            const response = await createCitizenReport(reportData);

            if (response && response.success) {
                toast.success('Tạo báo cáo thành công!', {
                    duration: 2000,
                });
                // Điều hướng về trang báo cáo sau khi submit (chờ 0.8s để user thấy toast)
                setTimeout(() => {
                    window.location.href = '/report';
                }, 800);
            } else {
                throw new Error(response?.message || 'Không thể tạo báo cáo.');
            }
        } catch (error) {
            console.error('Lỗi khi tạo báo cáo:', error);
            toast.error(error.message || 'Đã xảy ra lỗi khi tạo báo cáo. Vui lòng thử lại.', {
                duration: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
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
                                    disabled={completedSteps < progressSteps.length || isSubmitting || !areaId}
                                    className={`w-full px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${completedSteps >= progressSteps.length && areaId && !isSubmitting
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    <span className="flex items-center gap-2 justify-center">
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Gửi báo cáo
                                            </>
                                        )}
                                    </span>
                                </button>
                                {!areaId && location && location.trim() !== '' && (
                                    <p className="text-xs text-amber-600 mt-2">
                                        ⚠️ Không thể xác định khu vực từ địa chỉ. Vui lòng kiểm tra lại địa chỉ hoặc nhập địa chỉ cụ thể hơn.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateReport;
