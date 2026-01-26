import React, { useState, useEffect } from 'react';

const RankPage = () => {
    const [filter, setFilter] = useState('month'); // 'month', 'all'
    const [selectedArea, setSelectedArea] = useState('Phường Bến Nghé, Quận 1');
    const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
    const [userData, setUserData] = useState({
        rank: 12,
        totalPoints: 2450,
        level: 'Công dân Xanh',
        recycled: 42.5,
        badges: 18,
        pointsToTop10: 550,
        username: 'Lê Anh Tú',
        area: 'Phường Bến Nghé'
    });

    const areas = [
        'Phường Bến Nghé, Quận 1',
        'Phường Cầu Kho, Quận 1',
        'Phường Tân Định, Quận 1',
        'Phường Đa Kao, Quận 1'
    ];

    const leaderboardData = [
        { rank: 1, name: 'Nguyễn Văn A', area: 'Phường Bến Nghé', points: 8120, level: 'HUYỀN THOẠI XANH', isCurrentUser: false },
        { rank: 2, name: 'Trần Thị B', area: 'Phường Cầu Kho', points: 7450, level: '', isCurrentUser: false },
        { rank: 3, name: 'Phạm Minh C', area: 'Phường Tân Định', points: 6900, level: '', isCurrentUser: false },
        { rank: 4, name: 'Hoàng Văn D', area: 'Phường Bến Nghé', points: 5800, level: '', isCurrentUser: false },
        { rank: 5, name: 'Lê Thị E', area: 'Phường Đa Kao', points: 5200, level: '', isCurrentUser: false },
        { rank: 6, name: 'Nguyễn Văn F', area: 'Phường Bến Nghé', points: 4800, level: '', isCurrentUser: false },
        { rank: 7, name: 'Trần Văn G', area: 'Phường Cầu Kho', points: 4500, level: '', isCurrentUser: false },
        { rank: 8, name: 'Phạm Thị H', area: 'Phường Tân Định', points: 4200, level: '', isCurrentUser: false },
        { rank: 9, name: 'Hoàng Văn I', area: 'Phường Bến Nghé', points: 3800, level: '', isCurrentUser: false },
        { rank: 10, name: 'Lê Thị K', area: 'Phường Đa Kao', points: 3500, level: '', isCurrentUser: false },
        { rank: 11, name: 'Nguyễn Văn L', area: 'Phường Cầu Kho', points: 2800, level: '', isCurrentUser: false },
        { rank: 12, name: userData.username, area: userData.area, points: userData.totalPoints, level: userData.level, isCurrentUser: true },
        { rank: 13, name: 'Lê Văn D', area: 'Phường Đa Kao', points: 2380, level: '', isCurrentUser: false },
        { rank: 14, name: 'Trần Thị M', area: 'Phường Bến Nghé', points: 2200, level: '', isCurrentUser: false },
        { rank: 15, name: 'Phạm Văn N', area: 'Phường Tân Định', points: 2100, level: '', isCurrentUser: false }
    ];

    useEffect(() => {
        // Lấy thông tin user từ localStorage nếu có
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

    const getRankIcon = (rank) => {
        if (rank === 1) {
            return (
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
        } else if (rank === 2) {
            return (
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
        } else if (rank === 3) {
            return (
                <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
        }
        return null;
    };

    const getLevelColor = (level) => {
        if (level.includes('HUYỀN THOẠI')) return 'text-yellow-600 bg-yellow-50';
        if (level.includes('CÔNG DÂN XANH')) return 'text-green-600 bg-green-50';
        return 'text-gray-600 bg-gray-50';
    };

    const progressPercentage = ((userData.totalPoints / (userData.totalPoints + userData.pointsToTop10)) * 100).toFixed(0);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Bảng xếp hạng khu vực
                    </h1>
                    <p className="text-base text-gray-600">
                        Cùng với cộng đồng EcoCollect, tạo nên môi trường xanh, sạch, đẹp tại Quận 1, TP. Hồ Chí Minh
                    </p>
                </div>

                {/* Filter Section */}
                <div className="mb-6 flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setFilter('month')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${filter === 'month'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Tháng này
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${filter === 'all'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Tất cả
                    </button>
                    <div className="relative ml-auto">
                        <button
                            onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{selectedArea}</span>
                            <svg className={`w-4 h-4 transition-transform ${isAreaDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isAreaDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                {areas.map((area, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedArea(area);
                                            setIsAreaDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedArea === area ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                                            } ${index === 0 ? 'rounded-t-lg' : ''} ${index === areas.length - 1 ? 'rounded-b-lg' : ''}`}
                                    >
                                        {area}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - User Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Main User Card */}
                        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-lg font-semibold">Thứ hạng của bạn</span>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <div className="text-4xl font-bold mb-2">#{userData.rank}</div>
                            </div>

                            <div className="mb-6">
                                <div className="text-sm font-medium opacity-90 mb-1">TỔNG ĐIỂM THƯỞNG</div>
                                <div className="text-3xl font-bold">{userData.totalPoints.toLocaleString('vi-VN')} XP</div>
                            </div>

                            <div className="mb-6">
                                <div className="text-sm font-medium opacity-90 mb-1">CẤP ĐỘ</div>
                                <div className="text-xl font-bold">{userData.level}</div>
                            </div>

                            <div className="mb-4">
                                <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mb-2">
                                    <div
                                        className="bg-white rounded-full h-3 transition-all duration-500"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm opacity-90">
                                    Kiếm thêm {userData.pointsToTop10.toLocaleString('vi-VN')} XP để đạt hạng Top 10 trong tuần này!
                                </p>
                            </div>
                        </div>

                        {/* Recycled Card */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">ĐÃ TÁI CHẾ</div>
                                    <div className="text-2xl font-bold text-gray-900">{userData.recycled} kg</div>
                                </div>
                            </div>
                        </div>

                        {/* Badges Card */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">HUY HIỆU</div>
                                    <div className="text-2xl font-bold text-gray-900">{userData.badges}</div>
                                </div>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Muốn thăng hạng nhanh hơn?</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Tham gia chiến dịch "Chủ nhật Xanh" tại khu vực của bạn để nhận thêm x2 điểm thưởng tái chế.
                            </p>
                            <button className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200">
                                Tham gia ngay
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Leaderboard Table */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">THỨ HẠNG</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">THÀNH VIÊN</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">KHU VỰC</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">ĐIỂM (XP)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {leaderboardData.map((member) => (
                                            <tr
                                                key={member.rank}
                                                className={`hover:bg-gray-50 transition-colors ${member.isCurrentUser ? 'bg-green-50 border-l-4 border-green-600' : ''
                                                    }`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {getRankIcon(member.rank) || (
                                                            <span className="text-sm font-semibold text-gray-700">{member.rank}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${member.isCurrentUser ? 'bg-green-600' : 'bg-gray-200'
                                                            }`}>
                                                            {member.isCurrentUser ? (
                                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                            ) : (
                                                                <span className="text-sm font-semibold text-gray-700">
                                                                    {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className={`text-sm font-semibold ${member.isCurrentUser ? 'text-green-700' : 'text-gray-900'
                                                                }`}>
                                                                {member.isCurrentUser ? `Bạn (${member.name})` : member.name}
                                                            </div>
                                                            {member.level && (
                                                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${getLevelColor(member.level)}`}>
                                                                    {member.level}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {member.area}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className={`text-sm font-semibold ${member.isCurrentUser ? 'text-green-700' : 'text-gray-900'
                                                        }`}>
                                                        {member.points.toLocaleString('vi-VN')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-2 transition-colors">
                                    Xem thêm thành viên
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RankPage;
