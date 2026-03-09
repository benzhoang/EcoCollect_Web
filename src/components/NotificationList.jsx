import React, { useEffect, useMemo, useState } from 'react';
import { getCitizenNotifications, markCitizenNotificationsAsRead } from '../service/api';

const formatRelativeTime = (isoDate) => {
    if (!isoDate) return 'Vừa xong';

    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return 'Vừa xong';

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString('vi-VN');
};

const NotificationList = ({ onUnreadCountChange }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await getCitizenNotifications();
                setNotifications(Array.isArray(response?.data) ? response.data : []);
            } catch (err) {
                setError(err?.message || 'Không thể tải thông báo.');
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const unreadCount = useMemo(
        () => notifications.filter((item) => item?.read === false).length,
        [notifications],
    );

    useEffect(() => {
        if (typeof onUnreadCountChange === 'function') {
            onUnreadCountChange(unreadCount);
        }
    }, [unreadCount, onUnreadCountChange]);

    const handleMarkAsRead = async (notificationUserId) => {
        if (!notificationUserId) return;

        try {
            await markCitizenNotificationsAsRead([notificationUserId]);
            setNotifications((prev) =>
                prev.map((item) =>
                    item?.id === notificationUserId
                        ? {
                            ...item,
                            read: true,
                            readAt: item?.readAt || new Date().toISOString(),
                        }
                        : item,
                ),
            );
        } catch (err) {
            console.error('Không thể cập nhật trạng thái đã đọc:', err);
        }
    };

    return (
        <div className="w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">Thông báo</h3>
                <span className="text-xs text-gray-500">Chưa đọc: {unreadCount}</span>
            </div>

            <div className="max-h-80 overflow-y-auto">
                {loading && <p className="px-4 py-3 text-sm text-gray-500">Đang tải thông báo...</p>}

                {!loading && error && <p className="px-4 py-3 text-sm text-red-500">{error}</p>}

                {!loading && !error && notifications.length === 0 && (
                    <p className="px-4 py-3 text-sm text-gray-500">Bạn chưa có thông báo nào.</p>
                )}

                {!loading && !error && notifications.map((item) => {
                    const nested = item?.notification || {};
                    const title = nested?.title || 'Thông báo mới';
                    const body = nested?.body || 'Bạn có một thông báo mới từ hệ thống.';
                    const createdAt = nested?.createdAt || item?.readAt;
                    const isUnread = item?.read === false;

                    return (
                        <button
                            key={item?.id || nested?.id}
                            type="button"
                            onClick={() => {
                                if (isUnread) {
                                    handleMarkAsRead(item?.id);
                                }
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100"
                        >
                            <div className="flex items-start gap-2">
                                {isUnread && <span className="mt-2 w-2 h-2 rounded-full bg-green-500" />}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-800">{title}</p>
                                    <p className="text-xs text-gray-600 mt-1">{body}</p>
                                    <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(createdAt)}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default NotificationList;
