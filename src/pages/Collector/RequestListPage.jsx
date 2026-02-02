import React, { useState } from "react";

// Dữ liệu mẫu danh sách yêu cầu thu gom đã được doanh nghiệp gán cho Collector
const MOCK_REQUESTS = [
  {
    id: 1,
    code: "YC-2024-001",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
    wasteType: "Nhựa (PET)",
    wasteTypeColor: "bg-blue-100 text-blue-700",
    estimatedWeight: "~15 kg",
    address: "234 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    assignedAt: "31/01/2025 - 08:00",
    status: "Chờ thu gom",
    statusColor: "bg-amber-100 text-amber-700",
    coordinates: { lat: 10.8031, lng: 106.7147 },
  },
  {
    id: 2,
    code: "YC-2024-002",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    wasteType: "Rác điện tử",
    wasteTypeColor: "bg-orange-100 text-orange-700",
    estimatedWeight: "~8 kg",
    address: "56 Võ Văn Tần, Quận 3, TP.HCM",
    assignedAt: "31/01/2025 - 07:30",
    status: "Chờ thu gom",
    statusColor: "bg-amber-100 text-amber-700",
    coordinates: { lat: 10.7820, lng: 106.6872 },
  },
  {
    id: 3,
    code: "YC-2024-003",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
    wasteType: "Giấy / Carton",
    wasteTypeColor: "bg-amber-100 text-amber-700",
    estimatedWeight: "~25 kg",
    address: "12 Pasteur, Quận 3, TP.HCM",
    assignedAt: "30/01/2025 - 16:00",
    status: "Chờ thu gom",
    statusColor: "bg-amber-100 text-amber-700",
    coordinates: { lat: 10.7822, lng: 106.6950 },
  },
  {
    id: 4,
    code: "YC-2024-004",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
    wasteType: "Kim loại",
    wasteTypeColor: "bg-gray-100 text-gray-700",
    estimatedWeight: "~12 kg",
    address: "78 Trần Hưng Đạo, Quận 5, TP.HCM",
    assignedAt: "30/01/2025 - 14:20",
    status: "Chờ thu gom",
    statusColor: "bg-amber-100 text-amber-700",
    coordinates: { lat: 10.7562, lng: 106.6774 },
  },
];

// Modal chi tiết yêu cầu: ảnh rác, loại rác, khối lượng, vị trí trên bản đồ
const RequestDetailModal = ({ request, onClose }) => {
  if (!request) return null;

  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${request.coordinates.lng - 0.01}%2C${request.coordinates.lat - 0.01}%2C${request.coordinates.lng + 0.01}%2C${request.coordinates.lat + 0.01}&layer=mapnik&marker=${request.coordinates.lat}%2C${request.coordinates.lng}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header modal */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-xl">
          <h2 className="text-lg font-bold text-gray-900">
            Chi tiết yêu cầu thu gom — {request.code}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            aria-label="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Hình ảnh rác do Citizen gửi */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Hình ảnh rác (Citizen gửi)</h3>
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100 aspect-video">
              <img
                src={request.image}
                alt={request.wasteType}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Loại rác tái chế */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Loại rác tái chế</h3>
            <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-semibold ${request.wasteTypeColor}`}>
              {request.wasteType}
            </span>
          </div>

          {/* Khối lượng ước lượng */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Khối lượng ước lượng</h3>
            <p className="text-gray-900 font-medium">{request.estimatedWeight}</p>
          </div>

          {/* Địa chỉ thu gom */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Địa điểm thu gom</h3>
            <p className="text-gray-700 flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {request.address}
            </p>
          </div>

          {/* Vị trí thu gom trên bản đồ */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Vị trí thu gom trên bản đồ</h3>
            <div className="rounded-lg overflow-hidden border border-gray-200 h-56">
              <iframe
                title="Vị trí thu gom"
                src={mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={`https://www.google.com/maps?q=${request.coordinates.lat},${request.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Mở trong Google Maps
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RequestListPage = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRequests = MOCK_REQUESTS.filter((req) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      req.code.toLowerCase().includes(q) ||
      req.wasteType.toLowerCase().includes(q) ||
      req.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh sách công việc</h1>
          <p className="text-sm text-gray-600 mt-1">My Jobs — Các yêu cầu thu gom đã được doanh nghiệp gán cho bạn</p>
        </div>

        {/* Tìm kiếm */}
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm theo mã, loại rác hoặc địa chỉ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Danh sách yêu cầu */}
        <div className="flex-1 min-h-0">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {filteredRequests.map((request) => (
              <button
                key={request.id}
                type="button"
                onClick={() => setSelectedRequest(request)}
                className="flex items-stretch gap-4 p-4 text-left bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-green-200 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={request.image}
                    alt={request.wasteType}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{request.code}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${request.wasteTypeColor}`}>
                      {request.wasteType}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${request.statusColor}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1 line-clamp-2">{request.address}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>Khối lượng: {request.estimatedWeight}</span>
                    <span>{request.assignedAt}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-green-600 text-sm font-medium">
                    Xem chi tiết
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Chưa có yêu cầu thu gom nào</p>
              <p className="text-sm text-gray-500 mt-1">Các yêu cầu được doanh nghiệp gán sẽ hiển thị tại đây.</p>
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default RequestListPage;
