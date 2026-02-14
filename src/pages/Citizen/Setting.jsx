import React, { useState, useEffect } from 'react';

const Setting = () => {
    const [userData, setUserData] = useState({
        email: '',
        username: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        weeklyReport: true,
        pointsUpdate: true,
        rankChange: true
    });
    const [language, setLanguage] = useState('vi');
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Lấy thông tin user từ localStorage
        const userDataFromStorage = localStorage.getItem('user');
        if (userDataFromStorage) {
            try {
                const user = JSON.parse(userDataFromStorage);
                setUserData({
                    email: user.email || '',
                    username: user.username || user.email?.split('@')[0] || 'User'
                });
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }
        // TODO: Gọi API để đổi mật khẩu
        alert('Đổi mật khẩu thành công!');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSaveNotifications = () => {
        // TODO: Lưu cài đặt thông báo vào localStorage hoặc API
        localStorage.setItem('notificationSettings', JSON.stringify(notifications));
        alert('Đã lưu cài đặt thông báo!');
    };

    return (
        <div className="min-h-screen bg-green-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Cài đặt
                    </h1>
                    <p className="text-base text-gray-600">
                        Quản lý cài đặt tài khoản và tùy chọn của bạn
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Change Password Section */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Đổi mật khẩu</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mật khẩu hiện tại
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                    required
                                    minLength={6}
                                />
                                <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Xác nhận mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full md:w-auto px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200"
                            >
                                Đổi mật khẩu
                            </button>
                        </form>
                    </div>

                    {/* Notification Settings Section */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Cài đặt thông báo</h2>
                            <button
                                onClick={handleSaveNotifications}
                                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 text-sm"
                            >
                                Lưu
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Chọn loại thông báo bạn muốn nhận từ EcoCollect
                        </p>
                        <div className="space-y-4">
                            {/* Email Notifications */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Thông báo qua Email</h3>
                                    <p className="text-sm text-gray-600">Nhận thông báo qua email ({userData.email})</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.emailNotifications}
                                        onChange={() => handleNotificationChange('emailNotifications')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>

                            {/* Push Notifications */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Thông báo đẩy</h3>
                                    <p className="text-sm text-gray-600">Nhận thông báo trên trình duyệt</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.pushNotifications}
                                        onChange={() => handleNotificationChange('pushNotifications')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>

                            {/* SMS Notifications */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Thông báo qua SMS</h3>
                                    <p className="text-sm text-gray-600">Nhận thông báo qua tin nhắn</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.smsNotifications}
                                        onChange={() => handleNotificationChange('smsNotifications')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>

                            <hr className="my-4 border-gray-200" />

                            {/* Weekly Report */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Báo cáo hàng tuần</h3>
                                    <p className="text-sm text-gray-600">Nhận báo cáo hoạt động hàng tuần</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.weeklyReport}
                                        onChange={() => handleNotificationChange('weeklyReport')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>

                            {/* Points Update */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Cập nhật điểm</h3>
                                    <p className="text-sm text-gray-600">Thông báo khi bạn nhận được điểm thưởng</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.pointsUpdate}
                                        onChange={() => handleNotificationChange('pointsUpdate')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>

                            {/* Rank Change */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Thay đổi thứ hạng</h3>
                                    <p className="text-sm text-gray-600">Thông báo khi thứ hạng của bạn thay đổi</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.rankChange}
                                        onChange={() => handleNotificationChange('rankChange')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Language & Theme Settings */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Tùy chọn hiển thị</h2>
                        <div className="space-y-4">
                            {/* Language Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ngôn ngữ
                                </label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                >
                                    <option value="vi">Tiếng Việt</option>
                                    <option value="en">English</option>
                                </select>
                            </div>

                            {/* Theme Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Giao diện
                                </label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setTheme('light')}
                                        className={`flex-1 px-4 py-3 border-2 rounded-lg font-semibold transition-all ${theme === 'light'
                                            ? 'border-green-600 bg-green-50 text-green-700'
                                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            Sáng
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={`flex-1 px-4 py-3 border-2 rounded-lg font-semibold transition-all ${theme === 'dark'
                                            ? 'border-green-600 bg-green-50 text-green-700'
                                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            </svg>
                                            Tối
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Privacy & Security */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Quyền riêng tư & Bảo mật</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Hiển thị hồ sơ công khai</h3>
                                    <p className="text-sm text-gray-600">Cho phép người khác xem hồ sơ của bạn trên bảng xếp hạng</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Xác thực hai yếu tố</h3>
                                    <p className="text-sm text-gray-600">Bảo vệ tài khoản bằng xác thực hai yếu tố</p>
                                </div>
                                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm">
                                    Bật
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-xl shadow-md border border-red-200 p-6">
                        <h2 className="text-xl font-bold text-red-600 mb-4">Vùng nguy hiểm</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                <h3 className="font-semibold text-red-900 mb-2">Xóa tài khoản</h3>
                                <p className="text-sm text-red-700 mb-4">
                                    Xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn. Hành động này không thể hoàn tác.
                                </p>
                                <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 text-sm">
                                    Xóa tài khoản
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setting;
