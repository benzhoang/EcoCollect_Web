import React, { useState } from 'react';
import logoImage from '../assets/Screenshot_2026-01-17_220348-removebg-preview.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white w-full border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section - Left */}
                    <div className="flex items-center">
                        <a href="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200">
                            <img
                                src={logoImage}
                                alt="EcoCollect Logo"
                                className="h-10 w-auto object-contain"
                            />
                        </a>
                    </div>

                    {/* Navigation Links - Center (Desktop) */}
                    <div className="hidden md:flex items-center gap-1">
                        <a
                            href="/"
                            className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200 text-sm relative group"
                        >
                            Trang chủ
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                        </a>
                        <a
                            href="#"
                            className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200 text-sm relative group"
                        >
                            Báo cáo
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                        </a>
                        <a
                            href="#"
                            className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200 text-sm relative group"
                        >
                            Điểm thưởng
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                        </a>
                        <a
                            href="#"
                            className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200 text-sm relative group"
                        >
                            Bảng xếp hạng
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                        </a>
                    </div>

                    {/* Auth Buttons - Right (Desktop) */}
                    <div className="hidden md:flex items-center gap-3">
                        <button className="px-5 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 text-sm">
                            Đăng nhập
                        </button>
                        <button className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                            Đăng ký
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
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

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
                        <a
                            href="/"
                            className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Trang chủ
                        </a>
                        <a
                            href="#"
                            className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Báo cáo
                        </a>
                        <a
                            href="#"
                            className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Điểm thưởng
                        </a>
                        <a
                            href="#"
                            className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Bảng xếp hạng
                        </a>
                        <div className="pt-4 space-y-2 border-t border-gray-200">
                            <button className="w-full px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 text-sm">
                                Đăng nhập
                            </button>
                            <button className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm shadow-md">
                                Đăng ký
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;