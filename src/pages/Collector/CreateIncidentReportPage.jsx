import React, { useState, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";

const REQUEST_CODE = "YC-2024-001";
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

const INCIDENT_REASONS = [
  { value: "", label: "Chọn lý do sự cố..." },
  { value: "address_not_found", label: "Địa chỉ không tìm thấy" },
  { value: "owner_absent", label: "Chủ nguồn thải vắng mặt" },
  { value: "waste_mismatch", label: "Rác không đúng mô tả" },
  { value: "access_denied", label: "Không được phép vào thu gom" },
  { value: "road_blocked", label: "Đường đi bị cản trở" },
  { value: "other", label: "Khác" },
];

const CreateIncidentReportPage = () => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Chỉ chấp nhận JPG, PNG.";
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `Kích thước tối đa ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFileError("");
    const valid = [];
    for (const file of selected) {
      const err = validateFile(file);
      if (err) {
        setFileError(err);
        break;
      }
      valid.push(file);
    }
    if (valid.length > 0 && !fileError) setFiles((prev) => [...prev, ...valid]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange({ target: { files: e.dataTransfer.files } });
  };

  const handleDragOver = (e) => e.preventDefault();

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    if (!description.trim()) return;
    // TODO: gửi API báo cáo sự cố
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
            <h1 className="text-2xl font-bold text-black">Báo cáo sự cố</h1>
            <p className="text-sm text-gray-600">
              Yêu cầu thu gom:{" "}
              <span className="font-medium text-cyan-600">{REQUEST_CODE}</span>
            </p>
          </div>
        </div>
      </header>

      {/* Form panel */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-6 mt-10 bg-white border border-gray-200 shadow-sm rounded-xl"
      >
        {/* Lý do sự cố */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-gray-900">
            Lý do sự cố <span className="text-red-500">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem",
            }}
          >
            {INCIDENT_REASONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mô tả chi tiết */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-gray-900">
            Mô tả chi tiết <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Vui lòng mô tả chi tiết tình hình tại hiện trường..."
            rows={5}
            className="w-full px-3 py-2 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Hình ảnh minh chứng */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-gray-900">
            Hình ảnh minh chứng{" "}
            <span className="text-gray-500">(Tùy chọn)</span>
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center px-4 py-6 transition-colors border-2 border-gray-300 border-dashed cursor-pointer min-h-40 rounded-xl bg-gray-50 hover:bg-gray-100"
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
            <p className="text-sm text-center text-gray-600">
              Nhấn để tải lên hoặc kéo thả ảnh vào đây
            </p>
            <p className="mt-1 text-xs text-gray-500">
              JPG, PNG (TỐI ĐA {MAX_FILE_SIZE_MB}MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {fileError && (
            <p className="mt-1 text-sm text-red-600">{fileError}</p>
          )}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {files.map((file, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded"
                >
                  {file.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="text-gray-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Warning box */}
        <div className="flex gap-3 p-4 mb-6 border rounded-xl bg-amber-50 border-amber-200">
          <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-amber-400 shrink-0">
            •
          </span>
          <p className="text-sm text-amber-800">
            Báo cáo này sẽ được gửi đến bộ phận quản lý để xác minh. Việc báo
            cáo không trung thực có thể ảnh hưởng đến điểm uy tín của bạn.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
            Gửi báo cáo
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateIncidentReportPage;
