import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ComplaintList from "../../components/AdminComponent/ComplaintList";

const COMPLAINT_TYPES = {
  wrong_waste: "Thu gom không đúng loại rác",
  no_collection: "Không đến thu gom dù đã Accepted",
  invalid_image: "Hình ảnh xác nhận không hợp lệ",
  wrong_points: "Điểm thưởng bị cộng sai",
  MISSED_PICKUP: "Không đến thu gom",
  WRONG_WASTE: "Thu gom không đúng loại rác",
  INVALID_IMAGE: "Hình ảnh xác nhận không hợp lệ",
  WRONG_POINTS: "Điểm thưởng bị cộng sai",
};

const STATUS_MAP = {
  new: { label: "Mới", color: "bg-amber-100 text-amber-800" },
  verifying: { label: "Đang xác minh", color: "bg-blue-100 text-blue-800" },
  resolved_accepted: {
    label: "Chấp nhận - Yêu cầu thu gom lại",
    color: "bg-green-100 text-green-800",
  },
  resolved_rejected: { label: "Từ chối", color: "bg-red-100 text-red-800" },
  resolved_adjusted: {
    label: "Đã điều chỉnh điểm",
    color: "bg-emerald-100 text-emerald-800",
  },
  resolved_warning: {
    label: "Đã gắn cảnh báo",
    color: "bg-orange-100 text-orange-800",
  },
  OPEN: { label: "Mở", color: "bg-amber-100 text-amber-800" },
  IN_PROGRESS: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800" },
  RESOLVED: { label: "Đã xử lý", color: "bg-green-100 text-green-800" },
  CLOSED: { label: "Đóng", color: "bg-gray-100 text-gray-800" },
};

const ComplaintListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleOpenDetail = (id) => {
    // Navigate to detail page with complaint ID as query param
    window.history.pushState({}, "", `/admin/complaints/detail?id=${id}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="flex flex-col w-full h-full gap-6">
      {/* Page Header */}
      <header className="flex items-center justify-between w-full px-6 py-4 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-black">
            Khiếu nại & tranh chấp
          </h1>
          <p className="text-sm text-gray-600">
            Quản lý và xử lý các khiếu nại, tranh chấp từ người dùng.
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo nguồn, người khiếu nại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-4 pr-10 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg min-w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <FaSearch className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
        </div>
      </header>

      <div className="flex flex-col gap-6 p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-end">
          <div>
            <label className="sr-only">Loại khiếu nại</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="py-2 pl-3 pr-8 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Tất cả loại</option>
              {Object.entries(COMPLAINT_TYPES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="sr-only">Trạng thái</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-2 pl-3 pr-8 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              {Object.entries(STATUS_MAP).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ComplaintList
          filterType={filterType}
          filterStatus={filterStatus}
          searchTerm={searchTerm}
          onViewDetail={handleOpenDetail}
        />
      </div>
    </div>
  );
};

export default ComplaintListPage;
