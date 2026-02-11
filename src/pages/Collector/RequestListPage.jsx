import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

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
    status: "Đang trên đường",
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
    status: "Đang trên đường",
    statusColor: "bg-amber-100 text-amber-700",
    coordinates: { lat: 10.782, lng: 106.6872 },
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
    status: "Đang trên đường",
    statusColor: "bg-amber-100 text-amber-700",
    coordinates: { lat: 10.7822, lng: 106.695 },
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
    status: "Đang trên đường",
    statusColor: "bg-amber-100 text-amber-700",
    coordinates: { lat: 10.7562, lng: 106.6774 },
  },
  {
    id: 5,
    code: "YC-2024-005",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
    wasteType: "Nhựa (PET)",
    wasteTypeColor: "bg-blue-100 text-blue-700",
    estimatedWeight: "~20 kg",
    address: "90 Lê Lợi, Quận 1, TP.HCM",
    assignedAt: "01/02/2025 - 09:00",
    status: "Đã gán",
    statusColor: "bg-green-100 text-green-700",
    coordinates: { lat: 10.7769, lng: 106.7009 },
  },
  {
    id: 6,
    code: "YC-2024-006",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    wasteType: "Giấy / Carton",
    wasteTypeColor: "bg-amber-100 text-amber-700",
    estimatedWeight: "~18 kg",
    address: "15 Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
    assignedAt: "01/02/2025 - 10:30",
    status: "Đã gán",
    statusColor: "bg-green-100 text-green-700",
    coordinates: { lat: 10.7822, lng: 106.6884 },
  },
];

const RequestListPage = () => {
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
    <div className="flex flex-col w-full h-full min-h-0 gap-6">
      {/* Page Header */}
      <header className="flex items-center justify-between w-full px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-black">Danh sách công việc</h1>
          <p className="text-sm text-gray-600">
            Công việc của tôi — Các yêu cầu thu gom đã được doanh nghiệp gán cho
            bạn
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo mã, loại rác hoặc địa chỉ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-4 pr-10 text-black placeholder-gray-400 bg-white border border-gray-300 rounded-lg min-w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <FaSearch className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
        </div>
      </header>

      {/* Danh sách yêu cầu */}
      <div className="flex flex-col flex-1 min-h-0 gap-6">
        <div className="flex-1 min-h-0">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {filteredRequests.map((request) => (
              <a
                key={request.id}
                href={`/collector/request-list/${request.id}`}
                className="flex items-stretch gap-4 p-4 text-left no-underline transition-all bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <div className="w-24 h-24 overflow-hidden bg-gray-100 rounded-lg shrink-0">
                  <img
                    src={request.image}
                    alt={request.wasteType}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {request.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${request.wasteTypeColor}`}
                    >
                      {request.wasteType}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${request.statusColor}`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="mb-1 text-sm text-gray-600 line-clamp-2">
                    {request.address}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>Khối lượng: {request.estimatedWeight}</span>
                    <span>{request.assignedAt}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm font-medium text-green-600">
                    Xem chi tiết
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="font-medium text-gray-600">
                Chưa có yêu cầu thu gom nào
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Các yêu cầu được doanh nghiệp gán sẽ hiển thị tại đây.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestListPage;
