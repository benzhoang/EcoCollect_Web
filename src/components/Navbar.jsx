import React, { useState, useEffect, useRef } from 'react';
import logoImage from '../assets/Screenshot_2026-01-17_220348-removebg-preview.png';
import NotificationList from './NotificationList';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const userMenuRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.isLoggedIn) {
                    setIsLoggedIn(true);
                    const displayName = user.fullName || user.email || user.username || 'User';
                    setUsername(displayName);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }

            if (isNotificationOpen && notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };

        if (isUserMenuOpen || isNotificationOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen, isNotificationOpen]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUsername('');
        setIsUserMenuOpen(false);
        setIsNotificationOpen(false);
        window.location.href = '/';
    };

    return (
        <nav className="bg-white w-full border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200">
                            <img
                                src={logoImage}
                                alt="EcoCollect Logo"
                                className="h-10 w-auto object-contain"
                            />
                        </a>
                    </div>

                    <div className="hidden md:flex items-center gap-1">
                        <a href="/" className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200 text-sm relative group">Trang chủ<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span></a>
                        <a href="/report" className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200 text-sm relative group">Báo cáo<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span></a>
                        <a href="/score" className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200 text-sm relative group">Điểm thưởng<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span></a>
                        <a href="/rank" className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200 text-sm relative group">Bảng xếp hạng<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span></a>
                        <a href="/contact" className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200 text-sm relative group">Liên hệ<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span></a>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {isLoggedIn ? (
                            <>
                                <div className="relative" ref={notificationRef}>
                                    <button
                                        onClick={() => setIsNotificationOpen((prev) => !prev)}
                                        className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
                                        aria-label="Thông báo"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        {unreadNotificationCount > 0 && (
                                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                                                {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                                            </span>
                                        )}
                                    </button>
                                    {isNotificationOpen && (
                                        <div className="absolute right-0 mt-2">
                                            <NotificationList onUnreadCountChange={setUnreadNotificationCount} />
                                        </div>
                                    )}
                                </div>

                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 text-sm"
                                    >
                                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                            {username && username.length > 0 ? username.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <span>{username}</span>
                                        <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsUserMenuOpen(false)}>Hồ sơ</a>
                                            <a href="/complaint" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsUserMenuOpen(false)}>Khiếu nại</a>
                                            <a href="/setting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsUserMenuOpen(false)}>Cài đặt</a>
                                            <hr className="my-2 border-gray-200" />
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Đăng xuất</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <a href="/signin" className="px-5 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 text-sm">Đăng nhập</a>
                                <a href="/signup" className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 text-sm shadow-sm hover:shadow">Đăng ký</a>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
                        <a href="/" className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200" onClick={() => setIsMenuOpen(false)}>Trang chủ</a>
                        <a href="/report" className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200" onClick={() => setIsMenuOpen(false)}>Báo cáo</a>
                        <a href="/score" className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200" onClick={() => setIsMenuOpen(false)}>Điểm thưởng</a>
                        <a href="/rank" className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200" onClick={() => setIsMenuOpen(false)}>Bảng xếp hạng</a>
                        <a href="/contact" className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200" onClick={() => setIsMenuOpen(false)}>Liên hệ</a>
                        {isLoggedIn ? (
                            <div className="pt-4 space-y-2 border-t border-gray-200">
                                <div className="flex items-center gap-3 px-4 py-2">
                                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {username && username.length > 0 ? username.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="text-gray-700 font-semibold">{username}</span>
                                </div>
                                <a href="/profile" className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200" onClick={() => setIsMenuOpen(false)}>Hồ sơ</a>
                                <a href="/complaint" className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200" onClick={() => setIsMenuOpen(false)}>Khiếu nại</a>
                                <a href="/setting" className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200" onClick={() => setIsMenuOpen(false)}>Cài đặt</a>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full px-4 py-2 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all duration-200 text-sm text-center"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div className="pt-4 space-y-2 border-t border-gray-200">
                                <a href="/signin" className="block w-full px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 text-sm text-center" onClick={() => setIsMenuOpen(false)}>Đăng nhập</a>
                                <a href="/signup" className="block w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 text-sm shadow-sm text-center" onClick={() => setIsMenuOpen(false)}>Đăng ký</a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
