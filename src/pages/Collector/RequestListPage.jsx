import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import RequestList from "../../components/CollectorComponent/RequestList";

const RequestListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

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

      {/* Danh sách yêu cầu (API getCollectorAssignments + phân trang) */}
      <RequestList />
    </div>
  );
};

export default RequestListPage;
