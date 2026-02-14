import React, { useState, useEffect } from 'react';

const Profile = () => {
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        username: '',
        joinDate: '',
        avatar: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        // Lấy thông tin user từ localStorage
        const userDataFromStorage = localStorage.getItem('user');
        if (userDataFromStorage) {
            try {
                const user = JSON.parse(userDataFromStorage);
                const joinDate = user.createdAt || new Date().toLocaleDateString('vi-VN');
                setUserData({
                    fullName: user.fullName || user.username || 'Chưa cập nhật',
                    email: user.email || 'Chưa cập nhật',
                    phone: user.phone || 'Chưa cập nhật',
                    address: user.address || 'Chưa cập nhật',
                    username: user.username || user.email?.split('@')[0] || 'User',
                    joinDate: joinDate,
                    avatar: user.avatar || null
                });
                setFormData({
                    fullName: user.fullName || user.username || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || ''
                });
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Lưu thông tin cập nhật vào localStorage
        const userDataFromStorage = localStorage.getItem('user');
        if (userDataFromStorage) {
            try {
                const user = JSON.parse(userDataFromStorage);
                const updatedUser = {
                    ...user,
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUserData(prev => ({
                    ...prev,
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address
                }));
                setIsEditing(false);
                alert('Cập nhật thông tin thành công!');
            } catch (error) {
                console.error('Error updating user data:', error);
                alert('Có lỗi xảy ra khi cập nhật thông tin!');
            }
        }
    };

    const handleCancel = () => {
        // Khôi phục dữ liệu ban đầu
        setFormData({
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            address: userData.address
        });
        setIsEditing(false);
    };

    const getInitials = (name) => {
        if (!name || name === 'Chưa cập nhật') return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    const stats = [
        {
            id: 1,
            label: 'Tổng điểm tích lũy',
            value: '2,450',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            ),
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            id: 2,
            label: 'Rác đã thu gom',
            value: '124 kg',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            id: 3,
            label: 'Giảm thiểu CO2',
            value: '38.5 kg',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            id: 4,
            label: 'Thứ hạng',
            value: '#12',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ),
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        }
    ];

    return (
        <div className="min-h-screen bg-green-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Hồ sơ cá nhân
                    </h1>
                    <p className="text-base text-gray-600">
                        Quản lý thông tin tài khoản và xem thống kê hoạt động của bạn
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                                    {userData.avatar ? (
                                        <img
                                            src={userData.avatar}
                                            alt="Avatar"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        getInitials(userData.fullName)
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">
                                    {userData.fullName}
                                </h2>
                                <p className="text-sm text-gray-600 mb-2">@{userData.username}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Tham gia: {userData.joinDate}
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {stats.map((stat) => (
                                    <div
                                        key={stat.id}
                                        className="bg-gray-50 rounded-lg p-4 text-center"
                                    >
                                        <div className={`${stat.bgColor} ${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                                            {stat.icon}
                                        </div>
                                        <div className="text-lg font-bold text-gray-900 mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-2">
                                <a
                                    href="/score"
                                    className="block w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 text-center text-sm"
                                >
                                    Xem điểm thưởng
                                </a>
                                <a
                                    href="/rank"
                                    className="block w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 text-center text-sm"
                                >
                                    Xem bảng xếp hạng
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information Card */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Thông tin cá nhân</h3>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Chỉnh sửa
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 text-sm"
                                        >
                                            Lưu
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Họ và tên
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        />
                                    ) : (
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                            {userData.fullName}
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        />
                                    ) : (
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                            {userData.email}
                                        </div>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Số điện thoại
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        />
                                    ) : (
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                            {userData.phone}
                                        </div>
                                    )}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Địa chỉ
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
                                        />
                                    ) : (
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                            {userData.address}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
