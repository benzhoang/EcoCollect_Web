import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { uploadCollectorAssignmentProof } from "../../service/api";
import { uploadImage } from "../../service/uploadImage";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

/** Format datetime-local value từ Date */
const toDatetimeLocal = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const isFileValid = (file) => {
  if (!file || !file.type) return false;
  if (file.size > MAX_FILE_SIZE_BYTES) return false;
  return ACCEPTED_TYPES.includes(file.type.toLowerCase());
};

/** Validate URL ảnh (http/https) giống CreateReport */
const validateProofUrl = (value) => {
  const raw = (value || "").trim();
  if (!raw) return { ok: false, message: "Vui lòng nhập URL ảnh." };
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return { ok: false, message: "URL ảnh phải bắt đầu bằng http:// hoặc https://." };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: "URL ảnh không hợp lệ." };
  }
};

/**
 * @param {boolean} show
 * @param {() => void} onClose
 * @param {string} [assignmentId] - ID phân công để gọi API tải bằng chứng
 * @param {() => void | Promise<void>} [onSuccess] - gọi sau khi tải bằng chứng thành công (vd. refetch)
 */
const UploadProofModal = ({ show, onClose, assignmentId, onSuccess }) => {
  const [proofMode, setProofMode] = useState("upload"); // 'upload' | 'url'
  /** Preview hiển thị (base64) khi chế độ upload */
  const [proofPreviewUrls, setProofPreviewUrls] = useState([]);
  /** URL Cloudinary gửi API (giống CreateReport sau uploadImage) */
  const [proofCloudinaryUrls, setProofCloudinaryUrls] = useState([]);
  const [proofUrlInput, setProofUrlInput] = useState(""); // link khi chế độ url
  const [takenAt, setTakenAt] = useState(toDatetimeLocal(new Date()));
  const [submitting, setSubmitting] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    setProofMode("upload");
    setProofPreviewUrls([]);
    setProofCloudinaryUrls([]);
    setProofUrlInput("");
    setTakenAt(toDatetimeLocal(new Date()));
    setPreviewIndex(null);
  }, [show]);

  /** Có ảnh hợp lệ (giống hasImage trong CreateReport) */
  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const hasValidProof =
    proofMode === "upload"
      ? proofCloudinaryUrls.length > 0
      : validateProofUrl(proofUrlInput).ok;
  /** Mảng URL cuối cùng gửi API: upload → Cloudinary URL, url → [link] */
  const getPayloadProofUrls = () => {
    if (proofMode === "url") {
      const url = proofUrlInput.trim();
      return url ? [url] : [];
    }
    return [...proofCloudinaryUrls];
  };
  /** Mảng URL để hiển thị thumbnail + lightbox (upload hoặc url) */
  const displayUrlsForPreview =
    proofMode === "upload"
      ? proofPreviewUrls
      : validateProofUrl(proofUrlInput).ok
        ? [proofUrlInput.trim()]
        : [];

  const processFiles = async (fileList) => {
    const raw = Array.from(fileList || []);
    const valid = raw.filter(isFileValid);
    const skipped = raw.length - valid.length;
    if (skipped > 0) {
      toast.error(
        `${skipped} file không hợp lệ hoặc vượt ${MAX_FILE_SIZE_MB}MB. Chỉ dùng PNG, JPG tối đa ${MAX_FILE_SIZE_MB}MB.`,
      );
    }
    if (!valid.length) return;
    setUploadingFiles(true);
    try {
      for (const file of valid) {
        try {
          const dataUrl = await readFileAsDataURL(file);
          const secureUrl = await uploadImage(file);
          if (!secureUrl) {
            toast.error(`Upload "${file.name}" không trả về URL. Vui lòng thử lại.`);
            continue;
          }
          setProofPreviewUrls((prev) => [...prev, dataUrl]);
          setProofCloudinaryUrls((prev) => [...prev, secureUrl]);
        } catch {
          toast.error(`Upload ảnh "${file.name}" thất bại. Vui lòng thử lại.`, {
            duration: 4000,
          });
        }
      }
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleImageChange = (e) => {
    processFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files?.length) processFiles(files);
  };

  const removeProofImage = (index) => {
    setProofPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setProofCloudinaryUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasValidProof) {
      toast.error(
        proofMode === "upload"
          ? "Vui lòng tải lên ít nhất một ảnh bằng chứng."
          : "Vui lòng nhập URL ảnh hợp lệ.",
      );
      return;
    }
    if (!assignmentId) {
      toast.error(
        "Thiếu thông tin phân công. Vui lòng vào trang từ chi tiết công việc.",
      );
      return;
    }
    const payloadProofUrls = getPayloadProofUrls();
    if (!payloadProofUrls.length) {
      toast.error("Vui lòng cung cấp ít nhất một ảnh bằng chứng.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        proofUrls: payloadProofUrls,
        takenAt: new Date(takenAt).toISOString(),
      };
      await uploadCollectorAssignmentProof(assignmentId, payload);
      toast.success("Tải bằng chứng thu gom thành công");
      onClose?.();
      await onSuccess?.();
    } catch (err) {
      const msg = err?.message ?? "";
      if (msg.toLowerCase().includes("conflict") || msg === "Conflict") {
        toast.error(
          "Công việc đã có bằng chứng hoặc trạng thái không cho phép tải bằng chứng. Vui lòng kiểm tra lại.",
        );
      } else {
        toast.error(msg || "Gửi bằng chứng thất bại. Vui lòng thử lại.");
      }
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
          {/* Ảnh bằng chứng (proofUrls) - logic giống imageUrls trong CreateReport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh bằng chứng <span className="text-red-500">*</span>
            </label>
            {/* Chế độ: Tải file | Nhập URL */}
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  setProofMode("upload");
                  setProofUrlInput("");
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  proofMode === "upload"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Tải file
              </button>
              <button
                type="button"
                onClick={() => {
                  setProofMode("url");
                  setProofPreviewUrls([]);
                  setProofCloudinaryUrls([]);
                  setPreviewIndex(null);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  proofMode === "url"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Nhập URL
              </button>
            </div>
            {proofMode === "url" && (
              <div className="mb-2">
                <input
                  type="url"
                  value={proofUrlInput}
                  onChange={(e) => setProofUrlInput(e.target.value)}
                  placeholder="https://example.com/anh.jpg"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Hỗ trợ URL ảnh http/https (PNG, JPG).
                </p>
              </div>
            )}
            {/* Vùng kéo thả (chỉ khi chế độ Tải file) - giữ nguyên UI như hình */}
            {proofMode === "upload" && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                if (!uploadingFiles) fileInputRef.current?.click();
              }}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !uploadingFiles &&
                fileInputRef.current?.click()
              }
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 ${
                uploadingFiles
                  ? "cursor-wait border-blue-300 bg-blue-50"
                  : proofPreviewUrls.length > 0
                    ? "cursor-pointer border-blue-300 bg-blue-50 hover:border-blue-400"
                    : isDragging
                      ? "cursor-copy border-blue-400 bg-blue-50"
                      : "cursor-pointer border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className={`w-6 h-6 text-blue-600 ${uploadingFiles ? "animate-pulse" : ""}`}
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
                    {uploadingFiles
                      ? "Đang tải ảnh..."
                      : "Tải lên hình ảnh rác thải"}
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
            )}
            {displayUrlsForPreview.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {displayUrlsForPreview.map((url, index) => (
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
                          if (proofMode === "url") setProofUrlInput("");
                          else removeProofImage(index);
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
              disabled={
                submitting || uploadingFiles || !hasValidProof
              }
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang gửi..." : "Hoàn tất"}
            </button>
          </div>
        </form>
      </div>

      {/* Lightbox xem ảnh */}
      {previewIndex !== null && displayUrlsForPreview[previewIndex] && (
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
            src={displayUrlsForPreview[previewIndex]}
            alt={`Bằng chứng ${previewIndex + 1}`}
            className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
            Ảnh {previewIndex + 1} / {displayUrlsForPreview.length} — Nhấn ra ngoài để đóng
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadProofModal;
