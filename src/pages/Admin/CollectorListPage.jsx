import React, { useState } from "react";
import AccountList from "../../components/AdminComponent/AccountList";
import ModalCreate from "../../components/AdminComponent/ModalCreate";
import { FaPlus, FaSearch } from "react-icons/fa";

const CollectorListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    console.log("Search:", searchTerm);
    // Xử lý logic tìm kiếm
  };

  return (
    <div className="flex flex-col w-full h-full gap-6">
      {/* Page Header */}
      <header className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">
            Danh sách người thu gom
          </h1>
          <p className="text-sm text-gray-600">
            Quản lý và theo dõi thông tin nhân viên thu gom rác.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-4 pr-10 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg min-w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <FaSearch className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 shrink-0"
          >
            <FaPlus className="text-white" />
            <span>Tạo tài khoản mới</span>
          </button>
        </div>
      </header>

      <AccountList />

      <ModalCreate isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default CollectorListPage;
