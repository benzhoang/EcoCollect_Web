import React, { useState, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";

// Dữ liệu mẫu (có thể lấy từ route/context sau)
const REQUEST_CODE = "YC-2024-001";
const ASSIGNED_AT = "30/01/2025 - 08:00";
const EXPECTED_WEIGHT = "~15 kg";
const WASTE_TYPE = "Nhựa PET";

const CollectionConfirmationPage = () => {
  const [weight, setWeight] = useState("0.0");
  const [notes, setNotes] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleComplete = () => {
    // TODO: gửi API xác nhận hoàn tất
    window.history.back();
  };

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      {/* Page Header */}
      <header className="flex items-center justify-between w-full px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-2 text-gray-700 transition-colors hover:text-gray-900"
            onClick={handleBack}
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
          <div className="ml-5">
            <h1 className="text-2xl font-bold text-black">
              Xác nhận hoàn tất thu gom
            </h1>
            <p className="text-sm text-gray-600">
              Yêu cầu mã:{" "}
              <span className="font-medium text-cyan-600">{REQUEST_CODE}</span>
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-col flex-1 w-full min-h-0 gap-6 p-6 overflow-auto">
        {/* Progress steps */}
        <div className="w-full">
          <div className="flex items-start w-full">
            {/* Step 1 - Đã gán việc */}
            <div className="flex flex-col items-center shrink-0">
              <div className="flex items-center justify-center w-10 h-10 text-white bg-green-600 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="mt-2 text-xs font-medium text-center text-gray-700">
                Đã gán việc
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                {ASSIGNED_AT}
              </span>
            </div>
            <div className="flex-1 min-w-[60px] pt-5 px-1">
              <div className="h-0.5 bg-gray-300" />
            </div>
            {/* Step 2 - Đang thu gom */}
            <div className="flex flex-col items-center shrink-0">
              <div className="flex items-center justify-center w-10 h-10 bg-white border-2 border-green-600 rounded-full">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full bg-green-500 rounded-full opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 bg-green-600 rounded-full" />
                </span>
              </div>
              <span className="mt-2 text-xs font-medium text-center text-gray-700">
                Đang thu gom
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                Đang cập nhật...
              </span>
            </div>
            <div className="flex-1 min-w-[60px] pt-5 px-1">
              <div className="h-0.5 bg-gray-200" />
            </div>
            {/* Step 3 - Hoàn tất */}
            <div className="flex flex-col items-center shrink-0">
              <div className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-300 rounded-full" />
              <span className="mt-2 text-xs font-medium text-center text-gray-700">
                Hoàn tất
              </span>
              <span className="text-xs text-gray-500 mt-0.5">Chờ xác nhận</span>
            </div>
          </div>
        </div>

        {/* Ảnh xác nhận */}
        <div className="w-full">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Ảnh xác nhận
          </h3>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full max-w-[200px] h-[140px] border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-10 h-10 mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 13v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7"
                />
              </svg>
              <span className="text-sm text-gray-600">Tải lên ảnh</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </button>
            <div className="flex-1 max-w-[200px] h-[140px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Ảnh xác nhận"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-sm text-gray-400">
                  (Ảnh mẫu hoặc chưa tải)
                </div>
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Vui lòng chụp ảnh rác thực tế sau khi đã thu gom.
          </p>
        </div>

        {/* Khối lượng thực tế */}
        <div className="w-full">
          <h3 className="mb-2 text-sm font-semibold text-gray-900">
            Khối lượng thực tế
          </h3>
          <div className="flex items-center w-full max-w-md gap-2">
            <input
              type="number"
              step="0.1"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <span className="text-sm text-gray-600 shrink-0">kg</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Dự kiến: {EXPECTED_WEIGHT} ({WASTE_TYPE})
          </p>
        </div>

        {/* Ghi chú */}
        <div className="w-full">
          <h3 className="mb-2 text-sm font-semibold text-gray-900">Ghi chú</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú nếu có (ví dụ: rác chưa được phân loại kỹ, địa chỉ khó tìm...)"
            rows={4}
            className="w-full px-3 py-2 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleComplete}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Hoàn tất thu gom
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>

        {/* Lưu ý cho Collector */}
        <div className="flex w-full gap-3 p-4 border rounded-xl bg-cyan-50 border-cyan-100">
          <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full bg-cyan-200 text-cyan-700 shrink-0">
            i
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold text-cyan-900">
              Lưu ý cho Collector
            </p>
            <p className="text-sm text-cyan-800">
              Sau khi bấm hoàn tất, hệ thống sẽ gửi thông báo cho chủ nguồn thải
              xác nhận. Điểm EcoPoints sẽ được cộng vào tài khoản của bạn ngay
              khi giao dịch được xác nhận thành công.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionConfirmationPage;
