import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImage from "../../assets/Screenshot_2026-01-17_220348-removebg-preview.png";

const CollectorSidebar = ({ isOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const userData = useMemo(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : { fullName: "Người thu gom", userType: "COLLECTOR" };
    } catch {
      return { fullName: "Người thu gom", userType: "COLLECTOR" };
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const menuItems = [
    {
      id: "requests",
      label: "Yêu cầu",
      icon: "requests",
      path: "/collector/request-list",
    },
    {
      id: "history",
      label: "Lịch sử",
      icon: "history",
      path: "/collector/history",
    },
  ];

  const getIcon = (iconType) => {
    switch (iconType) {
      case "requests":
        return (
          <svg
            className="w-5 h-5"
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
        );
      case "history":
        return (
          <svg
            className="w-5 h-5"
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
        );
      case "logout":
        return (
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img
            src={logoImage}
            alt="EcoCollect Logo"
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="px-3 space-y-1 list-none">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 no-underline ${
                    isActive
                      ? "bg-green-50 text-green-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                  }`}
                >
                  <span
                    className={isActive ? "text-green-600" : "text-gray-500"}
                  >
                    {getIcon(item.icon)}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile & Logout Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-green-600 rounded-full">
            {(userData.fullName || "C").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {userData.fullName || "Người thu gom"}
            </div>
            <div className="text-xs text-gray-500">{userData.userType || "COLLECTOR"}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
        >
          {getIcon("logout")}
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default CollectorSidebar;
