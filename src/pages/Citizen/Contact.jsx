import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'feedback', // 'feedback' hoặc 'complaint'
        priority: 'normal', // 'low', 'normal', 'high', 'urgent'
        location: '',
        subject: '',
        message: '',
        attachments: null
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0] || null
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        setTimeout(() => {
            const messageType = formData.type === 'feedback' ? 'phản hồi' : 'khiếu nại';
            alert(`Cảm ơn bạn đã gửi ${messageType}! Chúng tôi đã tiếp nhận và sẽ xử lý trong thời gian sớm nhất. Mã số: #${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
            setFormData({
                name: '',
                email: '',
                phone: '',
                type: 'feedback',
                priority: 'normal',
                location: '',
                subject: '',
                message: '',
                attachments: null
            });
            setIsSubmitting(false);
        }, 1000);
    };

    const contactInfo = [
        {
            id: 1,
            title: 'Email',
            value: 'support@ecocollect.vn',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            id: 2,
            title: 'Điện thoại',
            value: '012 345 6789',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            id: 3,
            title: 'Địa chỉ',
            value: '123 Đường ABC, Quận XYZ, TP.HCM',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            id: 4,
            title: 'Giờ làm việc',
            value: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        }
    ];

    return (
        <div className="min-h-screen bg-green-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Phản hồi và Khiếu nại
                        </h1>
                        <p className="text-lg text-green-50 leading-relaxed">
                            Chúng tôi cam kết lắng nghe và xử lý mọi phản hồi, khiếu nại của bạn một cách nhanh chóng và hiệu quả. Mọi ý kiến đóng góp đều được chúng tôi trân trọng.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-16 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Information - Left */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                                Thông tin liên hệ
                            </h2>
                            <div className="space-y-6">
                                {contactInfo.map((info) => (
                                    <div key={info.id} className="flex items-start gap-4">
                                        <div className={`${info.bgColor} ${info.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                            {info.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {info.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {info.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quy trình xử lý */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                                Quy trình xử lý
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Tiếp nhận</h3>
                                        <p className="text-sm text-gray-600">Chúng tôi tiếp nhận và xác nhận phản hồi/khiếu nại của bạn</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Xử lý</h3>
                                        <p className="text-sm text-gray-600">Đội ngũ chuyên trách sẽ xem xét và xử lý vấn đề</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Phản hồi</h3>
                                        <p className="text-sm text-gray-600">Chúng tôi sẽ thông báo kết quả xử lý qua email hoặc điện thoại</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thời gian xử lý */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg shadow-sm p-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Thời gian xử lý
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Khẩn cấp:</span>
                                    <span className="font-semibold text-gray-900">24 giờ</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Cao:</span>
                                    <span className="font-semibold text-gray-900">2-3 ngày</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Bình thường:</span>
                                    <span className="font-semibold text-gray-900">3-5 ngày</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Thấp:</span>
                                    <span className="font-semibold text-gray-900">5-7 ngày</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form - Right */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                                Biểu mẫu phản hồi và khiếu nại
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Loại phản hồi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loại <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.type === 'feedback' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input
                                                type="radio"
                                                name="type"
                                                value="feedback"
                                                checked={formData.type === 'feedback'}
                                                onChange={handleChange}
                                                className="mr-3 w-4 h-4 text-green-600 focus:ring-green-500"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-900">Phản hồi</div>
                                                <div className="text-sm text-gray-600">Góp ý, đề xuất cải thiện</div>
                                            </div>
                                        </label>
                                        <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.type === 'complaint' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input
                                                type="radio"
                                                name="type"
                                                value="complaint"
                                                checked={formData.type === 'complaint'}
                                                onChange={handleChange}
                                                className="mr-3 w-4 h-4 text-red-600 focus:ring-red-500"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-900">Khiếu nại</div>
                                                <div className="text-sm text-gray-600">Vấn đề cần xử lý</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Thông tin cá nhân */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                            placeholder="Nhập họ và tên của bạn"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Số điện thoại <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                            placeholder="0123 456 789"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                            Mức độ ưu tiên <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="priority"
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                        >
                                            <option value="low">Thấp</option>
                                            <option value="normal">Bình thường</option>
                                            <option value="high">Cao</option>
                                            <option value="urgent">Khẩn cấp</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                        Địa điểm xảy ra sự việc {formData.type === 'complaint' && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required={formData.type === 'complaint'}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Ví dụ: 123 Đường ABC, Quận XYZ, TP.HCM"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                        placeholder={formData.type === 'complaint' ? 'Tóm tắt vấn đề khiếu nại' : 'Tóm tắt nội dung phản hồi'}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nội dung chi tiết <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none resize-none"
                                        placeholder={formData.type === 'complaint' ? 'Mô tả chi tiết vấn đề, thời gian, địa điểm và các thông tin liên quan...' : 'Mô tả chi tiết ý kiến phản hồi của bạn...'}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-2">
                                        Đính kèm tài liệu/hình ảnh (nếu có)
                                    </label>
                                    <input
                                        type="file"
                                        id="attachments"
                                        name="attachments"
                                        onChange={handleChange}
                                        accept="image/*,.pdf,.doc,.docx"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    />
                                    {formData.attachments && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            Đã chọn: {formData.attachments.name}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Lưu ý:</strong> Chúng tôi cam kết xử lý mọi phản hồi và khiếu nại trong vòng 3-5 ngày làm việc.
                                        Với các trường hợp khẩn cấp, chúng tôi sẽ ưu tiên xử lý trong vòng 24 giờ.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full md:w-auto px-8 py-3 text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed ${formData.type === 'complaint'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                >
                                    {isSubmitting ? 'Đang gửi...' : formData.type === 'complaint' ? 'Gửi khiếu nại' : 'Gửi phản hồi'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

