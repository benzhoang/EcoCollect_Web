import React from 'react';
import logoImage from '../assets/Screenshot_2026-01-17_220348-removebg-preview.png';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-20">
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* About Section */}
                    <div>
                        <div className="mb-6">
                            <img
                                src={logoImage}
                                alt="EcoCollect Logo"
                                className="h-10 w-auto object-contain"
                            />
                        </div>
                        <p className="text-gray-300 text-base leading-relaxed">
                            Nền tảng bảo vệ môi trường và quản lý rác thải thông minh.
                            Cùng chung tay xây dựng một tương lai xanh cho Trái Đất.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-white">Liên kết nhanh</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-base">
                                    Trang chủ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-base">
                                    Báo cáo
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-base">
                                    Điểm thưởng
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-base">
                                    Bảng xếp hạng
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-white">Liên hệ</h3>
                        <ul className="space-y-3 text-gray-300 text-base">
                            <li className="flex items-start">
                                <span className="mr-2">📧</span>
                                <span>contact@ecocollect.com</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">📞</span>
                                <span>0123 456 789</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">📍</span>
                                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-12 pt-8 text-center">
                    <p className="text-gray-400 text-base">&copy; 2026 EcoCollect. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;