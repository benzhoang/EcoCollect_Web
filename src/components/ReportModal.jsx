import React, { useState, useRef } from 'react';

const ReportModal = ({ isOpen, onClose }) => {
    const [selectedWasteType, setSelectedWasteType] = useState(null);
    const [location, setLocation] = useState(null);
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

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
        // Đóng modal sau khi submit
        onClose();
    };

    const handleClose = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setDescription('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Tạo báo cáo mới</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Đóng"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Hình ảnh rác */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Hình ảnh rác
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                        >
                            {imagePreview ? (
                                <div className="space-y-4">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-w-full max-h-64 mx-auto rounded-lg object-cover"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage(null);
                                            setImagePreview(null);
                                        }}
                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Xóa ảnh
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex justify-center">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Nhấn để tải ảnh hoặc chụp mới
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG tối đa 10MB
                                    </p>
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
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Loại rác
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {wasteTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedWasteType(type.name)}
                                    className={`p-4 rounded-lg border-2 transition-all text-left ${selectedWasteType === type.name
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${selectedWasteType === type.name
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {type.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className={`text-sm font-semibold ${selectedWasteType === type.name
                                                    ? 'text-green-700'
                                                    : 'text-gray-900'
                                                    }`}>
                                                    {type.name}
                                                </h3>
                                                {selectedWasteType === type.name && (
                                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                {type.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Vị trí */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Vị trí
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                placeholder="Nhập địa chỉ"
                            />
                        </div>
                        <button
                            onClick={handleGetCurrentLocation}
                            className="mt-2 px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Lấy vị trí hiện tại
                        </button>
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mô tả <span className="text-gray-500 font-normal">(tùy chọn)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none"
                            placeholder="Mô tả thêm về rác cần thu gom..."
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                        Gửi báo cáo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
