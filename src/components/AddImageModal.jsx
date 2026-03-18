import React, { useState } from 'react';
import { addImagesToCitizenReport } from '../service/api';
import { uploadImage } from '../service/uploadImage';

const AddImageModal = ({ isOpen, onClose, onSave, reportId }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsSaving(true);
            setError('');
            setImageUrl('');

            const uploadedUrl = await uploadImage(file);
            setPreviewUrl(uploadedUrl);
        } catch (err) {
            console.error('Upload ảnh thất bại:', err);
            setError('Tải ảnh lên thất bại. Vui lòng thử lại.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        const finalUrl = imageUrl.trim() || previewUrl;
        if (!finalUrl) {
            setError('Vui lòng chọn ảnh hoặc nhập URL ảnh.');
            return;
        }
        if (!reportId) {
            setError('Không tìm thấy mã báo cáo để bổ sung ảnh.');
            return;
        }

        try {
            setIsSaving(true);
            setError('');

            await addImagesToCitizenReport(reportId, [finalUrl]);
            onSave?.(finalUrl);

            setImageUrl('');
            setPreviewUrl('');
            onClose?.();
        } catch (err) {
            setError(err?.message || 'Bổ sung ảnh thất bại. Vui lòng thử lại.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setImageUrl('');
        setPreviewUrl('');
        setError('');
        onClose?.();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-xl border border-gray-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Thêm ảnh</h3>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chọn ảnh từ máy</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isSaving}
                            className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hoặc nhập URL ảnh</label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {(imageUrl || previewUrl) && (
                        <div className="rounded-lg overflow-hidden border border-gray-200">
                            <img
                                src={imageUrl || previewUrl}
                                alt="preview"
                                className="w-full h-56 object-cover"
                            />
                        </div>
                    )}

                    {isSaving && (
                        <p className="text-sm text-gray-500">Đang tải ảnh lên...</p>
                    )}

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}
                </div>

                <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Đang lưu...' : 'Lưu'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddImageModal;
