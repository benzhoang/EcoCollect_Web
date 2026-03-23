import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {
  getCollectorAssignmentReportDetail,
  getWasteCategories,
} from "../../service/api";
import UpdateStatusModal from "../../components/CollectorComponent/UpdateStatusModal";
import UploadProofModal from "../../components/CollectorComponent/UploadProofModal";
import CancelRequestModal from "../../components/CollectorComponent/CancelRequestModal";
import toast from "react-hot-toast";

/** Trạng thái cho Collector: ASSIGNED, ON_THE_WAY, COLLECTED (hiển thị Đã thu gom) - đồng bộ với RequestList */
const mapStatusToLabel = (status) => {
  const s = status ? String(status).toUpperCase() : "";
  switch (s) {
    case "ASSIGNED":
      return "Đã phân công";
    case "ON_THE_WAY":
      return "Đang trên đường";
    case "COLLECTED":
      return "Đã thu gom";
    default:
      return status || "Không rõ";
  }
};

const mapStatusToBadgeClass = (status) => {
  const s = status ? String(status).toUpperCase() : "";
  switch (s) {
    case "ASSIGNED":
      return "bg-blue-100 text-blue-800";
    case "ON_THE_WAY":
      return "bg-orange-100 text-orange-800";
    case "COLLECTED":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/** Map response API sang shape dùng trong UI */
const mapDetailToRequest = (raw, categoryMap = {}) => {
  if (!raw) return null;

  // Hỗ trợ cả 2 dạng: { success, code, data: {...} } hoặc trả thẳng object detail
  const data = raw?.data ?? raw;
  const report = data?.report || data;

  const lat = report?.latitude ?? data?.latitude ?? 10.7769;
  const lng = report?.longitude ?? data?.longitude ?? 106.7009;

  const mediaList = Array.isArray(report?.media) ? report.media : [];
  const imageUrlsFromMedia = mediaList.map((m) => m?.url).filter(Boolean);
  const imageUrls =
    imageUrlsFromMedia.length > 0
      ? imageUrlsFromMedia
      : (report?.imageUrls ?? report?.images ?? []);

  const firstImage =
    Array.isArray(imageUrls) && imageUrls.length > 0
      ? imageUrls[0]
      : (report?.image ?? "");

  const isCollectedProof = (m) =>
    String(m?.mediaType ?? "").toUpperCase() === "COLLECTED_PROOF";
  const fieldImages = mediaList.length
    ? mediaList
        .filter((m) => !isCollectedProof(m))
        .map((m) => m?.url)
        .filter(Boolean)
    : Array.isArray(imageUrls)
      ? imageUrls
      : firstImage
        ? [firstImage]
        : [];
  const proofImages = mediaList.length
    ? mediaList
        .filter(isCollectedProof)
        .map((m) => m?.url)
        .filter(Boolean)
    : [];

  const status =
    report?.currentStatus ??
    data?.currentStatus ??
    data?.status ??
    report?.status ??
    "-";
  const wasteCategoryId = report?.wasteCategoryId ?? data?.wasteCategoryId;
  const wasteType =
    categoryMap[wasteCategoryId] ??
    report?.wasteCategoryName ??
    report?.wasteType ??
    data?.wasteType ??
    "-";

  return {
    id: report?.id ?? data?.reportId ?? data?.id,
    /** UUID phân công (dùng cho hủy / cập nhật trạng thái) */
    assignmentId:
      data?.assignmentId ??
      data?.assignment?.id ??
      report?.assignmentId ??
      null,
    code: report?.code ?? data?.code ?? report?.id ?? data?.id ?? "-",
    image: firstImage,
    images: Array.isArray(imageUrls)
      ? imageUrls
      : firstImage
        ? [firstImage]
        : [],
    wasteType,
    wasteTypeColor: "bg-blue-100 text-blue-700",
    estimatedWeight:
      report?.estimatedWeightKg != null
        ? `~${report.estimatedWeightKg} kg`
        : (report?.estimatedWeight ?? data?.estimatedWeight ?? "-"),
    description: report?.description ?? data?.description ?? "-",
    latitude: lat,
    longitude: lng,
    address: report?.addressText ?? report?.address ?? data?.address ?? "-",
    assignedAt:
      data?.assignedAt ?? report?.assignedAt ?? data?.createdAt ?? "-",
    status,
    statusColor: mapStatusToBadgeClass(status),
    coordinates: { lat: Number(lat), lng: Number(lng) },
    fieldImages: Array.isArray(fieldImages) ? fieldImages : [],
    proofImages: Array.isArray(proofImages) ? proofImages : [],
  };
};

const RequestDetailPage = () => {
  const pathname = window.location.pathname;
  const reportId =
    pathname.replace("/collector/request-list/", "").split("/")[0]?.trim() ||
    null;
  const searchParams = new URLSearchParams(window.location.search || "");
  const assignmentId =
    searchParams.get("assignmentId") ||
    window.history.state?.assignmentId ||
    null;

  const [request, setRequest] = useState(null);
  const categoryMapRef = useRef({});
  const [loading, setLoading] = useState(!!reportId);
  const [error, setError] = useState(null);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showUploadProofModal, setShowUploadProofModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [updateStatusInitial, setUpdateStatusInitial] = useState("ASSIGNED");

  const fetchDetail = useCallback(async () => {
    if (!reportId) {
      setRequest(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const loadCategoriesIfNeeded = async () => {
        if (Object.keys(categoryMapRef.current).length > 0) {
          return categoryMapRef.current;
        }
        try {
          const response = await getWasteCategories();
          const categories = response?.data ?? response ?? [];
          const nextMap = {};
          if (Array.isArray(categories)) {
            categories.forEach((cat) => {
              if (cat?.id) {
                nextMap[cat.id] = cat.name ?? cat.displayName ?? "-";
              }
            });
          }
          categoryMapRef.current = nextMap;
          return nextMap;
        } catch {
          toast.error("Không thể tải danh mục loại rác");
          return categoryMapRef.current;
        }
      };

      const [data, map] = await Promise.all([
        getCollectorAssignmentReportDetail(reportId),
        loadCategoriesIfNeeded(),
      ]);
      setRequest(mapDetailToRequest(data, map));
    } catch {
      setError("Không thể tải chi tiết yêu cầu");
      setRequest(null);
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = () => {
    window.history.go(-1);
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full h-full min-h-0">
        <header className="flex items-center w-full px-6 py-4 bg-white border-b border-gray-200 shrink-0">
          <button
            type="button"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            onClick={handleBack}
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
        </header>
        <div className="flex items-center justify-center flex-1 p-6">
          <p className="text-gray-500">Đang tải chi tiết yêu cầu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full h-full min-h-0">
        <header className="flex items-center w-full px-6 py-4 bg-white border-b border-gray-200 shrink-0">
          <button
            type="button"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            onClick={handleBack}
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
        </header>
        <div className="flex items-center justify-center flex-1 p-6">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col w-full h-full min-h-0">
        <header className="flex items-center w-full px-6 py-4 bg-white border-b border-gray-200 shrink-0">
          <button
            type="button"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            onClick={handleBack}
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
        </header>
        <div className="flex items-center justify-center flex-1 p-6">
          <p className="text-gray-500">Không tìm thấy yêu cầu.</p>
        </div>
      </div>
    );
  }

  const addressQuery = (request?.address ?? "").toString().trim();
  const query =
    addressQuery && addressQuery !== "-" ? addressQuery : "Việt Nam";

  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}`;

  const statusUpper = String(request.status || "").toUpperCase();
  const canCancelAssignment =
    statusUpper === "ASSIGNED" || statusUpper === "ON_THE_WAY";

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
              Chi tiết yêu cầu thu gom
            </h1>
            <p className="text-sm text-gray-600">Mã yêu cầu: {request.code}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col flex-1 min-h-0 gap-6 p-6">
        {/* Two cards: Thông tin yêu cầu + Bản đồ */}
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
          {/* Card 1: Thông tin yêu cầu */}
          <div className="p-5 bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Thông tin yêu cầu
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${request.statusColor}`}
              >
                {mapStatusToLabel(request.status)}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Loại rác
                </p>
                <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                  {request.wasteType || "Không có"}
                </span>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Khối lượng ước tính
                </p>
                <p className="font-medium text-gray-900">
                  {request.estimatedWeight || "Không có"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Mô tả
                </p>
                <p className="font-medium text-gray-900 break-words">
                  {request.description || "Không có"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Địa chỉ thu gom
                </p>
                <p className="flex items-start gap-2 text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {request.address || "Không có"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Ảnh hiện trường (từ người dân)
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {request.fieldImages?.length > 0 ? (
                    <>
                      {request.fieldImages.slice(0, 4).map((img, i) => (
                        <div
                          key={i}
                          className="h-40 overflow-hidden bg-gray-100 border border-gray-200 rounded-lg"
                        >
                          <img
                            src={img}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                      {request.fieldImages.length > 4 && (
                        <div className="flex items-center justify-center h-40 text-sm text-gray-500 bg-gray-100 border border-gray-200 rounded-lg">
                          +{request.fieldImages.length - 4} ảnh
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-40 text-sm text-gray-500 bg-gray-100 border border-gray-200 rounded-lg">
                      Không có ảnh
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Ảnh bằng chứng (từ người thu gom)
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {request.proofImages?.length > 0 ? (
                    <>
                      {request.proofImages.slice(0, 4).map((img, i) => (
                        <div
                          key={i}
                          className="h-40 overflow-hidden bg-gray-100 border border-gray-200 rounded-lg"
                        >
                          <img
                            src={img}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                      {request.proofImages.length > 4 && (
                        <div className="flex items-center justify-center h-40 text-sm text-gray-500 bg-gray-100 border border-gray-200 rounded-lg">
                          +{request.proofImages.length - 4} ảnh
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 gap-2 text-sm text-gray-500 bg-gray-100 border border-gray-200 rounded-lg">
                      <span>Không có ảnh</span>
                      {String(request.status).toUpperCase() === "COLLECTED" && (
                        <button
                          type="button"
                          onClick={() => setShowUploadProofModal(true)}
                          className="font-medium text-blue-600 cursor-pointer hover:underline"
                        >
                          Thêm ảnh
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Bản đồ vị trí */}
          <div className="p-5 bg-white border border-gray-200 rounded-xl">
            <h2 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 0V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v0m0 0v0m0 0v0m0 0h4"
                />
              </svg>
              Bản đồ vị trí
            </h2>
            <div className="relative h-64 overflow-hidden border border-gray-200 rounded-lg">
              <iframe
                title="Bản đồ vị trí"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg shadow top-3 left-3 hover:bg-gray-50"
                aria-label="Mở trong Google Maps"
              >
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Mở trong Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Card 3: Sẵn sàng bắt đầu? / Đang trên đường — ẩn khi đã thu gom */}
        {String(request.status).toUpperCase() !== "COLLECTED" && (
          <div className="p-5 bg-white border border-gray-200 rounded-xl">
            <h2 className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-900">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              {String(request.status).toUpperCase() === "ON_THE_WAY"
                ? "Đang trên đường"
                : "Sẵn sàng bắt đầu?"}
            </h2>
            <p className="mb-4 text-gray-600">
              {String(request.status).toUpperCase() === "ON_THE_WAY"
                ? "Khi hoàn thành hãy xác nhận thu gom."
                : "Bắt đầu di chuyển tới điểm tập kết ngay bây giờ."}
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              {String(request.status).toUpperCase() === "ON_THE_WAY" ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setUpdateStatusInitial(request?.status || "ON_THE_WAY");
                      setShowUpdateStatusModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                  >
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Xác nhận thu gom
                  </button>
                  {canCancelAssignment && (
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5  text-white bg-red-600 font-medium rounded-lg hover:bg-red-700"
                    >
                      Hủy yêu cầu
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setUpdateStatusInitial(request?.status || "ASSIGNED");
                      setShowUpdateStatusModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                  >
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
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Bắt đầu di chuyển
                  </button>
                  {canCancelAssignment && (
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5  text-white bg-red-600 font-medium rounded-lg hover:bg-red-700"
                    >
                      Hủy yêu cầu
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <UpdateStatusModal
          key={
            showUpdateStatusModal
              ? `status-${updateStatusInitial}`
              : "status-closed"
          }
          show={showUpdateStatusModal}
          onClose={() => setShowUpdateStatusModal(false)}
          statusId={assignmentId}
          onSuccess={fetchDetail}
          onCollected={() => setShowUploadProofModal(true)}
          latitude={request?.latitude}
          longitude={request?.longitude}
          initialStatus={
            updateStatusInitial === "COMPLETED"
              ? "COLLECTED"
              : updateStatusInitial
          }
        />
        <UploadProofModal
          show={showUploadProofModal}
          onClose={() => {
            setShowUploadProofModal(false);
          }}
          assignmentId={assignmentId}
        />

        <CancelRequestModal
          show={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          assignmentId={assignmentId || request?.assignmentId}
        />
      </div>
    </div>
  );
};

export default RequestDetailPage;
