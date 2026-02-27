import React, { useState, useEffect } from 'react';
import { getLeaderboardByArea, getAreaTree } from '../../service/api';

const RankPage = () => {
    const [filter, setFilter] = useState('month'); // 'month', 'all'
    const [selectedAreaId, setSelectedAreaId] = useState(null);
    const [selectedAreaName, setSelectedAreaName] = useState('Chọn khu vực');
    const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
    const [showAreaInput, setShowAreaInput] = useState(false);
    const [areaIdInput, setAreaIdInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [areaOptions, setAreaOptions] = useState([]);
    const [userData, setUserData] = useState({
        rank: null,
        totalPoints: 0,
        level: '',
        recycled: 0,
        badges: 0,
        pointsToTop10: 0,
        username: ''
    });
    const [currentUserId, setCurrentUserId] = useState(null);

    // Lấy thông tin user từ localStorage
    useEffect(() => {
        const userDataFromStorage = localStorage.getItem('user');
        if (userDataFromStorage) {
            try {
                const user = JSON.parse(userDataFromStorage);
                const userId = user.userId || user.id || null;
                setCurrentUserId(userId);
                setUserData(prev => ({
                    ...prev,
                    username: user.username || user.fullName || ''
                }));

                // Nếu có areaId, đặt làm khu vực mặc định
                if (user.areaId) {
                    setSelectedAreaId(user.areaId);
                    setSelectedAreaName(user.areaName || user.area || 'Khu vực của bạn');
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    // Lấy cây khu vực cho dropdown
    useEffect(() => {
        const fetchAreaTree = async () => {
            try {
                const response = await getAreaTree();

                // API có thể trả về { success, data } hoặc trả thẳng mảng data
                let rawData = null;
                if (response && typeof response === 'object') {
                    rawData = response.data ?? response;
                }

                if (!rawData) {
                    console.warn('Area tree response is empty or invalid:', response);
                    return;
                }

                const rootNodes = Array.isArray(rawData) ? rawData : [rawData];
                const options = buildAreaOptions(rootNodes);
                setAreaOptions(options);

                // Nếu chưa có areaId từ user thì chọn option đầu tiên
                if (!selectedAreaId && options.length > 0) {
                    setSelectedAreaId(options[0].id);
                    setSelectedAreaName(options[0].name);
                }
            } catch (err) {
                console.error('Error fetching area tree:', err);
                // Không phá UX, chỉ log lỗi; bảng xếp hạng vẫn dùng được nếu người dùng nhập Area ID tay
            }
        };

        fetchAreaTree();
    }, []); // chỉ gọi 1 lần khi mount

    // Gọi API lấy bảng xếp hạng
    useEffect(() => {
        if (!selectedAreaId) return;

        const fetchLeaderboard = async () => {
            setLoading(true);
            setError(null);

            try {
                // Tính days dựa trên filter
                const days = filter === 'month' ? 30 : null; // null sẽ không gửi days parameter (lấy tất cả)

                const response = await getLeaderboardByArea(selectedAreaId, days, 50);

                if (response.success && response.data) {
                    const items = response.data.items || [];

                    // Chuyển đổi dữ liệu từ API sang format của component
                    const formattedData = items.map((item, index) => ({
                        rank: item.rank || index + 1,
                        name: item.fullName || '',
                        userId: item.userId || '',
                        points: item.totalPoints || 0,
                        level: '', // API không trả về level, có thể tính toán sau
                        isCurrentUser: currentUserId && item.userId === currentUserId
                    }));

                    setLeaderboardData(formattedData);

                    // Tìm thông tin của user hiện tại trong bảng xếp hạng
                    const currentUserItem = formattedData.find(item => item.isCurrentUser);
                    if (currentUserItem) {
                        setUserData(prev => ({
                            ...prev,
                            rank: currentUserItem.rank,
                            totalPoints: currentUserItem.points
                        }));

                        // Tính pointsToTop10 (điểm cần để vào top 10)
                        if (currentUserItem.rank > 10 && formattedData.length >= 10) {
                            const top10Points = formattedData[9].points;
                            setUserData(prev => ({
                                ...prev,
                                pointsToTop10: Math.max(0, top10Points - currentUserItem.points + 1)
                            }));
                        } else {
                            setUserData(prev => ({
                                ...prev,
                                pointsToTop10: 0
                            }));
                        }
                    }
                } else {
                    setError('Không thể lấy dữ liệu bảng xếp hạng');
                }
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
                setError(err.message || 'Đã xảy ra lỗi khi lấy bảng xếp hạng');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [selectedAreaId, filter, currentUserId]);

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
        if (!level) return 'text-gray-600 bg-gray-50';
        if (level.includes('HUYỀN THOẠI')) return 'text-yellow-600 bg-yellow-50';
        if (level.includes('CÔNG DÂN XANH')) return 'text-green-600 bg-green-50';
        return 'text-gray-600 bg-gray-50';
    };

    // Chuyển cây khu vực -> danh sách option phẳng cho dropdown
    const buildAreaOptions = (nodes, parentName = '') => {
        if (!nodes) return [];

        const result = [];

        nodes.forEach((node) => {
            if (!node) return;

            const currentName = parentName ? `${parentName} - ${node.name}` : node.name;

            if (Array.isArray(node.children) && node.children.length > 0 && typeof node.children[0] === 'object') {
                // Có cấp con, đệ quy tiếp
                result.push(...buildAreaOptions(node.children, currentName));
            } else {
                // Leaf node (phường / khu vực cụ thể)
                result.push({
                    id: node.id,
                    name: currentName
                });
            }
        });

        return result;
    };

    const progressPercentage = userData.totalPoints > 0 && userData.pointsToTop10 > 0
        ? ((userData.totalPoints / (userData.totalPoints + userData.pointsToTop10)) * 100).toFixed(0)
        : 0;

    const handleAreaSelect = (areaId, areaName) => {
        setSelectedAreaId(areaId);
        setSelectedAreaName(areaName);
        setIsAreaDropdownOpen(false);
        setShowAreaInput(false);
    };

    const handleAreaIdSubmit = (e) => {
        e.preventDefault();
        if (areaIdInput.trim()) {
            setSelectedAreaId(areaIdInput.trim());
            setSelectedAreaName(`Khu vực: ${areaIdInput.trim().substring(0, 8)}...`);
            setShowAreaInput(false);
            setAreaIdInput('');
        }
    };

    return (
        <div className="min-h-screen bg-green-50">
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
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${filter === 'month'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Tháng này
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${filter === 'all'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Tất cả
                    </button>
                    <div className="relative ml-auto flex items-center gap-2">
                        {!showAreaInput ? (
                            <>
                                <button
                                    onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{selectedAreaName}</span>
                                    <svg className={`w-4 h-4 transition-transform ${isAreaDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setShowAreaInput(true)}
                                    disabled={loading}
                                    className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Nhập Area ID"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                {isAreaDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                        <div className="p-3 border-b border-gray-200">
                                            <p className="text-xs text-gray-500">Chọn khu vực từ danh sách hoặc nhập Area ID</p>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {areaOptions.length === 0 ? (
                                                <p className="px-4 py-3 text-sm text-gray-500">Đang tải danh sách khu vực...</p>
                                            ) : (
                                                areaOptions.map((area, index) => (
                                                    <button
                                                        key={area.id || index}
                                                        onClick={() => handleAreaSelect(area.id, area.name)}
                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedAreaId === area.id ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                                                            }`}
                                                    >
                                                        {area.name}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowAreaInput(true);
                                                setIsAreaDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors text-green-600 font-medium border-t border-gray-200"
                                        >
                                            + Nhập Area ID
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <form onSubmit={handleAreaIdSubmit} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={areaIdInput}
                                    onChange={(e) => setAreaIdInput(e.target.value)}
                                    placeholder="Nhập Area ID (UUID)"
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !areaIdInput.trim()}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Áp dụng
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAreaInput(false);
                                        setAreaIdInput('');
                                    }}
                                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all duration-200"
                                >
                                    Hủy
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <p className="font-medium">Lỗi: {error}</p>
                    </div>
                )}

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
                                <div className="text-4xl font-bold mb-2">
                                    {userData.rank ? `#${userData.rank}` : '--'}
                                </div>
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
                                    {userData.pointsToTop10 > 0
                                        ? `Kiếm thêm ${userData.pointsToTop10.toLocaleString('vi-VN')} XP để đạt hạng Top 10!`
                                        : userData.rank && userData.rank <= 10
                                            ? 'Bạn đã nằm trong Top 10!'
                                            : 'Hãy tiếp tục phấn đấu để nâng cao thứ hạng!'
                                    }
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
                            {loading ? (
                                <div className="p-12 text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
                                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                                </div>
                            ) : !selectedAreaId ? (
                                <div className="p-12 text-center">
                                    <p className="text-gray-600">Vui lòng chọn khu vực để xem bảng xếp hạng</p>
                                </div>
                            ) : leaderboardData.length === 0 ? (
                                <div className="p-12 text-center">
                                    <p className="text-gray-600">Chưa có dữ liệu bảng xếp hạng</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">THỨ HẠNG</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">THÀNH VIÊN</th>
                                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">ĐIỂM (XP)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {leaderboardData.map((member) => (
                                                    <tr
                                                        key={member.userId || member.rank}
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
                                                                            {member.name ? member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '--'}
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
                                    {leaderboardData.length >= 50 && (
                                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                            <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-2 transition-colors">
                                                Xem thêm thành viên
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RankPage;
