import React, { useState, useEffect } from 'react';

const HomePage = () => {
    // Carousel slides data
    const carouselSlides = [
        {
            id: 1,
            title: 'Bảo vệ môi trường xanh',
            description: 'Mỗi hành động nhỏ của bạn góp phần tạo nên sự thay đổi lớn cho Trái Đất',
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            iconBg: 'bg-green-600',
            dotColor: 'bg-green-600'
        },
        {
            id: 2,
            title: 'Tiết kiệm tài nguyên',
            description: 'Sử dụng nước và năng lượng một cách tiết kiệm, hiệu quả',
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            iconBg: 'bg-blue-600',
            dotColor: 'bg-blue-600'
        },
        {
            id: 3,
            title: 'Phân loại rác đúng cách',
            description: 'Học cách phân loại rác để tái chế hiệu quả và giảm thiểu ô nhiễm',
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            iconBg: 'bg-purple-600',
            dotColor: 'bg-purple-600'
        },
        {
            id: 4,
            title: 'Tái chế và tái sử dụng',
            description: 'Biến rác thải thành tài nguyên, góp phần xây dựng tương lai bền vững',
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            iconBg: 'bg-orange-600',
            dotColor: 'bg-orange-600'
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
        { id: 1, name: 'Trần Thị B', initials: 'TB', points: 5420, rank: 1, isCurrentUser: false },
        { id: 2, name: 'Lê Văn C', initials: 'LC', points: 4850, rank: 2, isCurrentUser: false },
        { id: 3, name: 'Phạm Minh D', initials: 'PD', points: 3920, rank: 3, isCurrentUser: false },
        { id: 4, name: 'Nguyễn Văn A', initials: 'NA', points: 2450, rank: 4, isCurrentUser: true },
        { id: 5, name: 'Hoàng Thị E', initials: 'HE', points: 2100, rank: 5, isCurrentUser: false }
    ];

    const environmentalStats = [
        {
            id: 1,
            value: '75%',
            label: 'Giảm lượng rác chôn lấp',
            description: 'Khi phân loại đúng cách',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            id: 2,
            value: '50%',
            label: 'Tăng tỷ lệ tái chế',
            description: 'Nhờ phân loại tại nguồn',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            id: 3,
            value: '30%',
            label: 'Tiết kiệm năng lượng',
            description: 'So với sản xuất mới',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        },
        {
            id: 4,
            value: '60%',
            label: 'Giảm khí thải CO2',
            description: 'Góp phần chống biến đổi khí hậu',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        }
    ];

    const helpfulTips = [
        {
            id: 1,
            title: 'Rửa sạch trước khi phân loại',
            description: 'Rửa sạch các vật dụng như chai nhựa, hộp thực phẩm trước khi bỏ vào thùng rác tái chế để tránh mùi hôi và thuận tiện cho việc xử lý.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )
        },
        {
            id: 2,
            title: 'Gỡ nhãn và nắp chai',
            description: 'Tháo nhãn và nắp chai nhựa trước khi bỏ vào thùng tái chế. Nhãn thường làm bằng vật liệu khác và có thể gây khó khăn trong quá trình tái chế.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            )
        },
        {
            id: 3,
            title: 'Phơi khô rác hữu cơ',
            description: 'Để ráo nước hoặc phơi khô rác hữu cơ trước khi bỏ vào thùng để giảm mùi hôi và tránh tạo môi trường cho vi khuẩn phát triển.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            id: 4,
            title: 'Bọc kỹ rác nguy hại',
            description: 'Bọc kỹ các vật dụng nguy hại như pin, bóng đèn trong túi riêng và ghi chú rõ ràng để người thu gom xử lý an toàn.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-green-50">
            {/* Hero Banner Section */}
            <div className="relative bg-green-100 border-b border-gray-200 py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    {/* Carousel Card */}
                    <div
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 md:p-12"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="flex flex-col md:flex-row items-start gap-8">
                            {/* Icon Section - Left */}
                            <div className="flex-shrink-0">
                                <div className={`w-16 h-16 ${carouselSlides[currentSlide].iconBg} rounded-lg flex items-center justify-center text-white transition-colors duration-300`}>
                                    {carouselSlides[currentSlide].icon}
                                </div>
                            </div>

                            {/* Text Content - Center */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 leading-tight">
                                    {carouselSlides[currentSlide].title}
                                </h2>
                                <p className="text-base text-gray-600 leading-relaxed">
                                    {carouselSlides[currentSlide].description}
                                </p>
                            </div>

                            {/* Navigation Arrows - Right */}
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={prevSlide}
                                    className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    aria-label="Slide trước"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    aria-label="Slide sau"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Carousel Dots - Bottom Center */}
                        <div className="flex justify-center gap-2 mt-10">
                            {carouselSlides.map((slide, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`transition-all duration-300 ${index === currentSlide
                                        ? `w-8 h-2 rounded-full ${slide.dotColor}`
                                        : 'w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Chuyển đến slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-16 max-w-7xl">
                {/* Environmental Statistics Section */}
                <div className="mb-16">
                    <div className="mb-8">
                        <div className="flex items-start gap-4 mb-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight mb-2">
                                    Tác động tích cực
                                </h2>
                                <p className="text-base text-gray-600 leading-relaxed">
                                    Những con số chứng minh hiệu quả của việc phân loại rác đúng cách
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {environmentalStats.map((stat) => (
                            <div
                                key={stat.id}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                            >
                                <div className={`${stat.bgColor} w-14 h-14 rounded-lg flex items-center justify-center ${stat.color} mb-4`}>
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-semibold text-gray-900 mb-1">
                                    {stat.label}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {stat.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Waste Classification Section */}
                <div className="mb-16">
                    <div className="mb-10">
                        <div className="flex items-start gap-4 mb-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight mb-2">
                                    Hướng dẫn phân loại rác
                                </h2>
                                <p className="text-base text-gray-600 leading-relaxed">
                                    Phân loại rác đúng cách giúp bảo vệ môi trường và tăng hiệu quả tái chế
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Waste Category Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wasteCategories.map((category) => (
                            <div
                                key={category.id}
                                className={`${category.bgColor} border ${category.borderColor} rounded-lg shadow-sm hover:shadow transition-shadow duration-200`}
                            >
                                <div className="flex items-start gap-4 p-6">
                                    {/* Icon Section - Left */}
                                    <div className="flex-shrink-0">
                                        <div className={`${category.iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                                            {category.icon}
                                        </div>
                                    </div>

                                    {/* Content Section - Right */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`text-base font-semibold ${category.textColor} mb-2 leading-tight`}>
                                            {category.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                            {category.description}
                                        </p>
                                        <ul className="space-y-1.5">
                                            {category.examples.map((example, index) => (
                                                <li key={index} className="text-sm text-gray-700 flex items-start leading-relaxed">
                                                    <span className={`${category.bulletColor} mr-2 mt-0.5 font-medium`}>•</span>
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

                {/* Helpful Tips Section */}
                <div className="mb-16">
                    <div className="mb-10">
                        <div className="flex items-start gap-4 mb-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight mb-2">
                                    Mẹo phân loại rác hiệu quả
                                </h2>
                                <p className="text-base text-gray-600 leading-relaxed">
                                    Những bí quyết nhỏ giúp bạn phân loại rác đúng cách và hiệu quả hơn
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {helpfulTips.map((tip) => (
                            <div
                                key={tip.id}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                        {tip.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {tip.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {tip.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Reports Panel */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Báo cáo gần đây</h3>
                            </div>
                            <a href="#" className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors flex items-center gap-1">
                                Xem tất cả
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 mb-6 text-base">
                                Vui lòng đăng nhập để xem báo cáo
                            </p>
                            <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
                                Đăng nhập
                            </button>
                        </div>
                    </div>

                    {/* Leaderboard Panel */}
                    <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    <h3 className="text-xl font-bold text-gray-900">Bảng xếp hạng</h3>
                                </div>
                                <a href="#" className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors">
                                    Xem thêm &gt;
                                </a>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {leaderboardUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${user.isCurrentUser
                                        ? 'bg-green-50 border border-green-200'
                                        : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    {/* Rank Icon/Number */}
                                    <div className="flex-shrink-0">
                                        {user.rank === 1 ? (
                                            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ) : user.rank === 2 ? (
                                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ) : user.rank === 3 ? (
                                            <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ) : (
                                            <span className="text-gray-600 font-semibold text-sm w-6 text-center">
                                                {user.rank}
                                            </span>
                                        )}
                                    </div>

                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${user.isCurrentUser
                                        ? 'bg-green-700'
                                        : 'bg-green-100'
                                        }`}>
                                        <span className={`font-semibold text-sm ${user.isCurrentUser
                                            ? 'text-white'
                                            : 'text-gray-900'
                                            }`}>
                                            {user.initials}
                                        </span>
                                    </div>

                                    {/* Name and Points */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-semibold text-sm truncate ${user.isCurrentUser
                                            ? 'text-green-700'
                                            : 'text-gray-900'
                                            }`}>
                                            {user.name}{user.isCurrentUser && ' (Bạn)'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {user.points.toLocaleString('vi-VN')} điểm
                                        </p>
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