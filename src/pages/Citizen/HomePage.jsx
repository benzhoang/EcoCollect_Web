import React, { useState, useEffect } from 'react';

const HomePage = () => {
    // Carousel slides data
    const carouselSlides = [
        {
            id: 1,
            title: 'Bảo vệ môi trường xanh',
            description: 'Mỗi hành động nhỏ của bạn góp phần tạo nên sự thay đổi lớn cho Trái Đất',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            iconBg: 'from-green-400 to-teal-600'
        },
        {
            id: 2,
            title: 'Tiết kiệm tài nguyên',
            description: 'Sử dụng nước và năng lượng một cách tiết kiệm, hiệu quả',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            iconBg: 'from-blue-400 to-cyan-600'
        },
        {
            id: 3,
            title: 'Phân loại rác đúng cách',
            description: 'Học cách phân loại rác để tái chế hiệu quả và giảm thiểu ô nhiễm',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            iconBg: 'from-emerald-400 to-green-600'
        },
        {
            id: 4,
            title: 'Tái chế và tái sử dụng',
            description: 'Biến rác thải thành tài nguyên, góp phần xây dựng tương lai bền vững',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            iconBg: 'from-purple-400 to-indigo-600'
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Auto-play carousel
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 5000); // Chuyển slide sau mỗi 5 giây

        return () => clearInterval(interval);
    }, [currentSlide, isPaused, carouselSlides.length]);
    const wasteCategories = [
        {
            id: 1,
            title: 'Rác tái chế',
            description: 'Giấy, nhựa, kim loại, thủy tinh',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
            iconBg: 'bg-blue-600',
            borderColor: 'border-blue-200',
            bulletColor: 'text-blue-600',
            examples: [
                'Chai nhựa, lon nước',
                'Giấy, bìa carton',
                'Chai thủy tinh',
                'Đồ kim loại sạch'
            ]
        },
        {
            id: 2,
            title: 'Rác hữu cơ',
            description: 'Thực phẩm, lá cây, rác vườn',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            iconBg: 'bg-green-600',
            borderColor: 'border-green-200',
            bulletColor: 'text-green-600',
            examples: [
                'Vỏ trái cây, rau củ',
                'Thức ăn thừa',
                'Lá cây, cỏ',
                'Bã cà phê, trà'
            ]
        },
        {
            id: 3,
            title: 'Rác thông thường',
            description: 'Rác không thể tái chế',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            bgColor: 'bg-gray-50',
            textColor: 'text-gray-700',
            iconBg: 'bg-gray-600',
            borderColor: 'border-gray-200',
            bulletColor: 'text-gray-600',
            examples: [
                'Túi nilon bẩn',
                'Giấy ăn đã dùng',
                'Xốp, mút xốp',
                'Đồ nhựa hỗn hợp'
            ]
        },
        {
            id: 4,
            title: 'Rác nguy hại',
            description: 'Cần xử lý đặc biệt',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            iconBg: 'bg-red-600',
            borderColor: 'border-red-200',
            bulletColor: 'text-red-600',
            examples: [
                'Pin, ắc quy',
                'Thuốc hết hạn',
                'Hóa chất, sơn',
                'Bóng đèn huỳnh quang'
            ]
        },
        {
            id: 5,
            title: 'Rác điện tử',
            description: 'Thiết bị điện tử cũ',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-700',
            iconBg: 'bg-orange-600',
            borderColor: 'border-orange-200',
            bulletColor: 'text-orange-600',
            examples: [
                'Điện thoại cũ',
                'Máy tính, laptop',
                'Dây cáp, sạc',
                'Thiết bị điện gia dụng'
            ]
        },
        {
            id: 6,
            title: 'Rác y tế',
            description: 'Vật dụng y tế đã qua sử dụng',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700',
            iconBg: 'bg-purple-600',
            borderColor: 'border-purple-200',
            bulletColor: 'text-purple-600',
            examples: [
                'Kim tiêm, ống chích',
                'Băng gạc đã dùng',
                'Khẩu trang y tế',
                'Găng tay y tế'
            ]
        }
    ];

    const leaderboardUsers = [
        { id: 1, name: 'Nguyễn Văn A', points: 1250, rank: 1 },
        { id: 2, name: 'Trần Thị B', points: 980, rank: 2 },
        { id: 3, name: 'Lê Văn C', points: 850, rank: 3 },
        { id: 4, name: 'Phạm Thị D', points: 720, rank: 4 },
        { id: 5, name: 'Hoàng Văn E', points: 650, rank: 5 }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Banner Section */}
            <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16 px-6 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
                </div>

                <div className="relative container mx-auto max-w-5xl">
                    {/* Carousel Card */}
                    <div
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-10 border border-white/50"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                            {/* Icon Section - Left */}
                            <div className="flex-shrink-0">
                                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${carouselSlides[currentSlide].iconBg} flex items-center justify-center shadow-lg transition-all duration-500`}>
                                    <div className="transition-transform duration-500">
                                        {carouselSlides[currentSlide].icon}
                                    </div>
                                </div>
                            </div>

                            {/* Text Content - Center */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight transition-all duration-500">
                                    {carouselSlides[currentSlide].title}
                                </h2>
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed transition-all duration-500">
                                    {carouselSlides[currentSlide].description}
                                </p>
                            </div>

                            {/* Navigation Arrows - Right */}
                            <div className="flex flex-col gap-3 flex-shrink-0">
                                <button
                                    onClick={prevSlide}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Carousel Dots - Bottom Center */}
                        <div className="flex justify-center gap-2 mt-8">
                            {carouselSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`transition-all duration-300 ${index === currentSlide
                                        ? 'w-8 h-3 rounded-full bg-teal-500'
                                        : 'w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-20 max-w-7xl">
                {/* Waste Classification Section */}
                <div className="mb-20">
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-md">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                    Hướng dẫn phân loại rác
                                </h2>
                            </div>
                        </div>
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed ml-[72px]">
                            Phân loại rác đúng cách giúp bảo vệ môi trường và tăng hiệu quả tái chế
                        </p>
                    </div>

                    {/* Waste Category Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {wasteCategories.map((category) => (
                            <div
                                key={category.id}
                                className={`group ${category.bgColor} border ${category.borderColor} rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:border-opacity-60`}
                            >
                                <div className="flex items-start gap-4 p-6">
                                    {/* Icon Section - Left */}
                                    <div className="flex-shrink-0">
                                        <div className={`${category.iconBg} w-14 h-14 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300`}>
                                            {category.icon}
                                        </div>
                                    </div>

                                    {/* Content Section - Right */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`text-lg font-bold ${category.textColor} mb-2 leading-tight`}>
                                            {category.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 font-medium mb-3.5 leading-relaxed">
                                            {category.description}
                                        </p>
                                        <ul className="space-y-2">
                                            {category.examples.map((example, index) => (
                                                <li key={index} className="text-sm text-gray-700 flex items-start leading-relaxed">
                                                    <span className={`${category.bulletColor} mr-2.5 mt-1 font-semibold text-lg leading-none`}>•</span>
                                                    <span className="flex-1">{example}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Recent Reports Panel */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Báo cáo gần đây</h3>
                            </div>
                            <a href="#" className="text-green-600 hover:text-green-700 font-semibold text-sm transition-colors flex items-center gap-1">
                                Xem tất cả
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                        <div className="text-center py-16">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 mb-8 text-lg font-medium">
                                Vui lòng đăng nhập để xem báo cáo
                            </p>
                            <button className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Đăng nhập
                            </button>
                        </div>
                    </div>

                    {/* Leaderboard Panel */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Bảng xếp hạng</h3>
                            </div>
                            <a href="#" className="text-green-600 hover:text-green-700 font-semibold text-sm transition-colors flex items-center gap-1">
                                Xem tất cả
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                        <div className="space-y-2.5">
                            {leaderboardUsers.map((user, index) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200 hover:shadow-sm group"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="relative">
                                            <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${index === 0 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                                                index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                                                    index === 2 ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                                                        'bg-gradient-to-br from-blue-500 to-blue-600'
                                                } shadow-sm`}>
                                                <span className="text-white font-bold text-sm">
                                                    {user.rank}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-900 font-semibold text-base group-hover:text-green-700 transition-colors">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {user.points.toLocaleString()} điểm
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-base font-bold ${index === 0 ? 'text-yellow-600' :
                                            index === 1 ? 'text-gray-500' :
                                                index === 2 ? 'text-orange-600' :
                                                    'text-gray-400'
                                            }`}>
                                            #{user.rank}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;