import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { uploadCollectorAssignmentProof } from "../../service/api";

const MAX_FILE_SIZE_MB = 10;

/** Format datetime-local value từ Date */
const toDatetimeLocal = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const UploadProofModal = ({ show, onClose, onSubmit, assignmentId }) => {
  const [proofUrls, setProofUrls] = useState([]);
  const [takenAt, setTakenAt] = useState(toDatetimeLocal(new Date()));
  const [submitting, setSubmitting] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);
  const fileInputRef = useRef(null);

  const processFiles = (fileList) => {
    const files = Array.from(fileList || []).filter((file) => {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return false;
      return /^image\/(png|jpeg|jpg)$/i.test(file.type);
    });
    if (!files.length) return;
    let done = 0;
    const newUrls = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newUrls.push(reader.result);
        done += 1;
        if (done === files.length) {
          setProofUrls((prev) => [...prev, ...newUrls]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e) => {
    processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    processFiles(e.dataTransfer?.files);
  };

  const removeProofImage = (index) => {
    setProofUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofUrls.length) {
      toast.error("Vui lòng tải lên ít nhất một ảnh bằng chứng.");
      return;
    }
    if (!assignmentId && !onSubmit) {
      toast.error(
        "Thiếu thông tin phân công. Vui lòng vào trang từ chi tiết công việc.",
      );
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        proofUrls,
        takenAt: new Date(takenAt).toISOString(),
      };
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        await uploadCollectorAssignmentProof(assignmentId, payload);
        window.history.pushState({}, "", "/collector/request-list");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
      onClose();
    } catch (err) {
      toast.error(
        err?.message ?? "Gửi bằng chứng thất bại. Vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            Tải bằng chứng thu gom
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0"
        >
          {/* Ảnh bằng chứng (proofUrls) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh bằng chứng <span className="text-red-500">*</span>
            </label>
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) =>
                e.key === "Enter" && fileInputRef.current?.click()
              }
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200 ${
                proofUrls.length > 0
                  ? "border-blue-300 bg-blue-50 hover:border-blue-400"
                  : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Tải lên hình ảnh rác thải
                  </p>
                  <p className="text-xs text-gray-500">
                    Kéo thả hoặc nhấn để chọn file (PNG, JPG tối đa 10MB)
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            {proofUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {proofUrls.map((url, index) => (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    onClick={() => setPreviewIndex(index)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setPreviewIndex(index)
                    }
                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={url}
                      alt={`Bằng chứng ${index + 1}`}
                      className="object-cover w-full h-full pointer-events-none"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProofImage(index);
                        if (previewIndex === index) setPreviewIndex(null);
                        else if (
                          previewIndex !== null &&
                          previewIndex > index
                        )
                          setPreviewIndex(previewIndex - 1);
                      }}
                      className="absolute top-0.5 right-0.5 w-6 h-6 flex items-center justify-center text-white text-xs bg-red-500 rounded-full hover:bg-red-600 transition-colors z-10"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thời điểm chụp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời điểm chụp
            </label>
            <input
              type="datetime-local"
              value={takenAt}
              onChange={(e) => setTakenAt(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Thời điểm ghi nhận khi chụp ảnh bằng chứng (ISO 8601).
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting || !proofUrls.length}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang gửi..." : "Hoàn tất"}
            </button>
          </div>
        </form>
      </div>

      {/* Lightbox xem ảnh */}
      {previewIndex !== null && proofUrls[previewIndex] && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh bằng chứng"
        >
          <button
            type="button"
            onClick={() => setPreviewIndex(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Đóng"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={proofUrls[previewIndex]}
            alt={`Bằng chứng ${previewIndex + 1}`}
            className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
            Ảnh {previewIndex + 1} / {proofUrls.length} — Nhấn ra ngoài để đóng
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadProofModal;
