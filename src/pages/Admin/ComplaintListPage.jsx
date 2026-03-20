import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ComplaintList from "../../components/AdminComponent/ComplaintList";

const ComplaintListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
        <ComplaintList
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};

export default ComplaintListPage;
