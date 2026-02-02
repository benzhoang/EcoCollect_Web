import React, { useState } from "react";

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
    <div className="flex flex-col w-full h-full min-h-0">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch sử công việc</h1>
          <p className="text-sm text-gray-600 mt-1">
            Danh sách các yêu cầu thu gom đã hoàn thành
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
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
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatusFilter(option)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === option
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Table: Thời gian thu gom, Loại rác, Khối lượng, Trạng thái xử lý */}
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Mã yêu cầu
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thời gian thu gom
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Loại rác
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Khối lượng
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng thái xử lý
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Địa điểm
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/80 transition-colors"
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
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
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
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
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
              <p className="text-gray-600 font-medium">Chưa có lịch sử công việc</p>
              <p className="text-sm text-gray-500 mt-1">
                Các yêu cầu đã hoàn thành sẽ hiển thị tại đây.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
