import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

// Dữ liệu mẫu: các yêu cầu đã hoàn thành (lịch sử công việc)
const MOCK_HISTORY = [
  {
    id: 1,
    code: "YC-2024-101",
    collectedAt: "30/01/2025 - 14:35",
    wasteType: "Nhựa (PET)",
    wasteTypeColor: "bg-blue-100 text-blue-700",
    weight: "14 kg",
    status: "Đã hoàn thành",
    statusColor: "bg-green-100 text-green-700",
    address: "234 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
  },
  {
    id: 2,
    code: "YC-2024-098",
    collectedAt: "30/01/2025 - 11:20",
    wasteType: "Giấy / Carton",
    wasteTypeColor: "bg-amber-100 text-amber-700",
    weight: "22 kg",
    status: "Đã hoàn thành",
    statusColor: "bg-green-100 text-green-700",
    address: "12 Pasteur, Quận 3, TP.HCM",
  },
  {
    id: 3,
    code: "YC-2024-095",
    collectedAt: "29/01/2025 - 16:00",
    wasteType: "Rác điện tử",
    wasteTypeColor: "bg-orange-100 text-orange-700",
    weight: "7 kg",
    status: "Đã xác nhận",
    statusColor: "bg-emerald-100 text-emerald-700",
    address: "56 Võ Văn Tần, Quận 3, TP.HCM",
  },
  {
    id: 4,
    code: "YC-2024-089",
    collectedAt: "29/01/2025 - 09:15",
    wasteType: "Kim loại",
    wasteTypeColor: "bg-gray-100 text-gray-700",
    weight: "11 kg",
    status: "Đã hoàn thành",
    statusColor: "bg-green-100 text-green-700",
    address: "78 Trần Hưng Đạo, Quận 5, TP.HCM",
  },
  {
    id: 5,
    code: "YC-2024-082",
    collectedAt: "28/01/2025 - 15:40",
    wasteType: "Nhựa (PET)",
    wasteTypeColor: "bg-blue-100 text-blue-700",
    weight: "18 kg",
    status: "Đã hoàn thành",
    statusColor: "bg-green-100 text-green-700",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  },
];

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  const statusOptions = ["Tất cả", "Đã hoàn thành", "Đã xác nhận"];

  const filteredHistory = MOCK_HISTORY.filter((item) => {
    const matchSearch =
      !searchQuery.trim() ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wasteType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      statusFilter === "Tất cả" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col w-full h-full min-h-0 gap-6">
      {/* Page Header */}
      <header className="flex flex-wrap items-center justify-between w-full gap-4 px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-black">Lịch sử công việc</h1>
          <p className="text-sm text-gray-600">
            Danh sách các yêu cầu thu gom đã hoàn thành
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

      {/* Bộ lọc trạng thái */}
      <div className="flex flex-wrap gap-2 px-6">
        {statusOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setStatusFilter(option)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === option
                ? "bg-green-100 text-green-700"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Table: Thời gian thu gom, Loại rác, Khối lượng, Trạng thái xử lý */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Mã yêu cầu
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Thời gian thu gom
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Loại rác
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Khối lượng
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Trạng thái xử lý
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Địa điểm
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-gray-50/80"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">
                        {item.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.collectedAt}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${item.wasteTypeColor}`}
                      >
                        {item.wasteType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.weight}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${item.statusColor}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 truncate">
                      {item.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-gray-200 rounded-xl">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="font-medium text-gray-600">
              Chưa có lịch sử công việc
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Các yêu cầu đã hoàn thành sẽ hiển thị tại đây.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
