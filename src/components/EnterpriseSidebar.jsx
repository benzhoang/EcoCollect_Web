import React, { useState, useEffect } from 'react';

const EnterpriseSidebar = ({ isOpen }) => {
    const [userData, setUserData] = useState({
        username: 'RecycleCorp Ltd.',
        plan: 'ENTERPRISE PLAN'
    });

    useEffect(() => {
        const userDataFromStorage = localStorage.getItem('user');
        if (userDataFromStorage) {
            try {
                const user = JSON.parse(userDataFromStorage);
                if (user.username) {
                    setUserData(prev => ({
                        ...prev,
                        username: user.username
                    }));
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const menuItems = [
        { id: 'requests', label: 'Quản lý yêu cầu', icon: 'document', path: '/enterprise', active: true },
        { id: 'dispatch', label: 'Điều phối & Theo dõi', icon: 'truck', path: '/enterprise/dispatch' },
        { id: 'rewards', label: 'Cấu hình điểm thưởng', icon: 'gift', path: '/enterprise/rewards' },
        { id: 'reports', label: 'Báo cáo thống kê', icon: 'chart', path: '/enterprise/reports' },
        { id: 'settings', label: 'Cài đặt doanh nghiệp', icon: 'building', path: '/enterprise/settings' }
    ];

    const getIcon = (iconType) => {
        switch (iconType) {
            case 'grid':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                );
            case 'document':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'truck':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'gift':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                );
            case 'chart':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                );
            case 'building':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-xl font-bold text-green-600">EcoCollect</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <a
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${item.active
                                    ? 'bg-green-50 text-green-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                                    }`}
                            >
                                <span className={item.active ? 'text-green-600' : 'text-gray-500'}>
                                    {getIcon(item.icon)}
                                </span>
                                <span className="text-sm">{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {userData.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{userData.username}</div>
                        <div className="text-xs text-gray-500">{userData.plan}</div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default EnterpriseSidebar;
