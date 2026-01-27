import React, { useState } from 'react';
import AccountList from '../../components/AdminComponent/AccountList';
import { FaSearch } from 'react-icons/fa';

const CitizenListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Search:', searchTerm);
    // Xử lý logic tìm kiếm
  };

  return (
    <div className="flex flex-col w-full h-full gap-6">
      <div className="p-6 bg-white rounded-lg shadow-sm">
        {/* Header Section */}
      <div className="flex items-center justify-end mb-10">

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-4 pr-10 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg min-w-60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <FaSearch className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
        </div>
      </div>

        <AccountList />
      </div>
    </div>
  );
};

export default CitizenListPage;
