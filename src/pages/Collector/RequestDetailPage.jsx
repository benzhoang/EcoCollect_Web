import React, { useState, useEffect, useCallback } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {
  getCollectorAssignmentReportDetail,
  getWasteCategories,
} from "../../service/api";

const getStatusColor = (status) => {
  if (!status) return "bg-gray-100 text-gray-700";
  const s = String(status).toLowerCase();
  if (s.includes("đã gán")) return "bg-green-100 text-green-700";
  if (s.includes("đang trên đường") || s.includes("đang thực hiện"))
    return "bg-amber-100 text-amber-700";
  if (s.includes("hoàn thành")) return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-700";
};

const getWasteTypeColor = (wasteType) => {
  if (!wasteType) return "bg-gray-100 text-gray-700";
  const t = String(wasteType).toLowerCase();
  if (t.includes("nhựa") || t.includes("pet"))
    return "bg-blue-100 text-blue-700";
  if (t.includes("điện tử")) return "bg-orange-100 text-orange-700";
  if (t.includes("giấy") || t.includes("carton"))
    return "bg-amber-100 text-amber-700";
  if (t.includes("kim loại")) return "bg-gray-100 text-gray-700";
  return "bg-gray-100 text-gray-700";
};

/** Map response API sang shape dùng trong UI */
const mapDetailToRequest = (raw, categoryMap = {}) => {
  if (!raw) return null;

  // Hỗ trợ cả 2 dạng: { success, code, data: {...} } hoặc trả thẳng object detail
  const data = raw?.data ?? raw;
  const report = data?.report || data;

  const lat = report?.latitude ?? data?.latitude ?? 10.7769;
  const lng = report?.longitude ?? data?.longitude ?? 106.7009;

  const imageUrlsFromMedia = Array.isArray(report?.media)
    ? report.media.map((m) => m?.url).filter(Boolean)
    : [];
  const imageUrls =
    imageUrlsFromMedia.length > 0
      ? imageUrlsFromMedia
      : (report?.imageUrls ?? report?.images ?? []);

  const firstImage =
    Array.isArray(imageUrls) && imageUrls.length > 0
      ? imageUrls[0]
      : (report?.image ?? "");

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
    code: report?.code ?? data?.code ?? report?.id ?? data?.id ?? "-",
    image: firstImage,
    images: Array.isArray(imageUrls)
      ? imageUrls
      : firstImage
        ? [firstImage]
        : [],
    wasteType,
    wasteTypeColor:
      report?.wasteTypeColor ??
      data?.wasteTypeColor ??
      getWasteTypeColor(wasteType),
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
    statusColor:
      data?.statusColor ?? report?.statusColor ?? getStatusColor(status),
    coordinates: { lat: Number(lat), lng: Number(lng) },
  };
};

const RequestDetailPage = () => {
  const pathname = window.location.pathname;
  const reportId =
    pathname.replace("/collector/request-list/", "").split("/")[0]?.trim() ||
    null;

  const [request, setRequest] = useState(null);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(!!reportId);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!reportId) {
      setRequest(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getCollectorAssignmentReportDetail(reportId);
      setRequest(mapDetailToRequest(data, categoryMap));
    } catch (err) {
      setError(err?.message ?? "Không thể tải chi tiết yêu cầu.");
      setRequest(null);
    } finally {
      setLoading(false);
    }
  }, [reportId, categoryMap]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getWasteCategories();
        const categories = response?.data ?? response ?? [];
        if (Array.isArray(categories)) {
          const nextMap = {};
          categories.forEach((cat) => {
            if (cat?.id) {
              nextMap[cat.id] = cat.name ?? cat.displayName ?? "-";
            }
          });
          setCategoryMap(nextMap);
        }
      } catch (err) {
        console.error("Không thể tải danh mục loại rác:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBack = () => {
    window.history.pushState({}, "", "/collector/request-list");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full h-full min-h-0">
        <header className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center shrink-0">
          <button
            type="button"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            onClick={handleBack}
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
        </header>
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-gray-500">Đang tải chi tiết yêu cầu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full h-full min-h-0">
        <header className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center shrink-0">
          <button
            type="button"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            onClick={handleBack}
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
        </header>
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col w-full h-full min-h-0">
        <header className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center shrink-0">
          <button
            type="button"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            onClick={handleBack}
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
        </header>
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-gray-500">Không tìm thấy yêu cầu.</p>
        </div>
      </div>
    );
  }

  const images = request.images || [request.image];
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${request.coordinates.lng - 0.01}%2C${request.coordinates.lat - 0.01}%2C${request.coordinates.lng + 0.01}%2C${request.coordinates.lat + 0.01}&layer=mapnik&marker=${request.coordinates.lat}%2C${request.coordinates.lng}`;
  const googleMapsUrl = `https://www.google.com/maps?q=${request.coordinates.lat},${request.coordinates.lng}`;

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      {/* Page Header */}
      <header className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
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

      <div className="flex flex-col flex-1 gap-6 p-6 min-h-0">
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
                className={`px-3 py-1 rounded-lg text-sm font-semibold ${request.statusColor}`}
              >
                {request.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Loại rác
                </p>
                <span
                  className={`inline-block px-3 py-1.5 rounded-lg text-sm font-semibold ${request.wasteTypeColor}`}
                >
                  {request.wasteType}
                </span>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Khối lượng ước tính
                </p>
                <p className="font-medium text-gray-900">
                  {request.estimatedWeight}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Mô tả
                </p>
                <p className="font-medium text-gray-900 break-words">
                  {request.description}
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
                  {request.address}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Vĩ độ
                  </p>
                  <p className="font-medium text-gray-900">
                    {request.latitude}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Kinh độ
                  </p>
                  <p className="font-medium text-gray-900">
                    {request.longitude}
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Ảnh hiện trường (từ người dân)
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {images.slice(0, 4).map((img, i) => (
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
                  {images.length > 4 && (
                    <div className="flex items-center justify-center h-40 text-sm text-gray-500 bg-gray-100 border border-gray-200 rounded-lg">
                      +{images.length - 4} ảnh
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
                title="Vị trí thu gom"
                src={mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute p-2 bg-white border border-gray-200 rounded-lg shadow bottom-3 right-3 hover:bg-gray-50"
                aria-label="Mở Google Maps"
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Card 3: Sẵn sàng bắt đầu? */}
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
            Sẵn sàng bắt đầu?
          </h2>
          <p className="mb-4 text-gray-600">
            Bắt đầu di chuyển tới điểm tập kết ngay bây giờ.
          </p>
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                window.history.pushState({}, "", "/collector/incident-report");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200"
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Báo cáo sự cố
            </button>
            {request.status === "Đang trên đường" ? (
              <button
                type="button"
                onClick={() => {
                  window.history.pushState(
                    {},
                    "",
                    "/collector/collection-confirm",
                  );
                  window.dispatchEvent(new PopStateEvent("popstate"));
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
            ) : (
              <button
                type="button"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailPage;
