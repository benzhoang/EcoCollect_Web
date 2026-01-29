import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaUsers,
  FaBullhorn,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

const AdminSidebar = ({ isOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isAccountOpen, setIsAccountOpen] = useState(
    currentPath.startsWith("/admin/account/"),
  );

  useEffect(() => {
    setIsAccountOpen(currentPath.startsWith("/admin/account/"));
  }, [currentPath]);

  const isDashboardActive = currentPath === "/admin/dashboard";
  const isAccountActive = currentPath.startsWith("/admin/account/");
  const isCitizensActive = currentPath === "/admin/account/citizens";
  const isCollectorsActive = currentPath === "/admin/account/collectors";
  const isRecyclingEnterprisesActive =
    currentPath === "/admin/account/recycling-enterprises";
  const isComplaintsActive = currentPath === "/admin/complaints";

  const userData = {
    username: "Admin",
    plan: "ADMIN",
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };

  const handleAccountClick = (e) => {
    e?.preventDefault?.();
    setIsAccountOpen((v) => !v);
    if (!isAccountActive) {
      window.history.pushState({}, "", "/admin/account/citizens");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  const getIcon = (iconType) => {
    switch (iconType) {
      case "dashboard":
        return <FaChartBar className="w-5 h-5" />;
      case "user":
        return <FaUsers className="w-5 h-5" />;
      case "complaints":
        return <FaBullhorn className="w-5 h-5" />;
      case "logout":
        return <FaSignOutAlt className="w-4 h-4" />;
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
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="text-xl font-bold text-green-600">EcoCollect</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="px-3 space-y-1 list-none">
          <li>
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 no-underline ${
                isDashboardActive
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
              }`}
            >
              <span
                className={
                  isDashboardActive ? "text-green-600" : "text-gray-500"
                }
              >
                {getIcon("dashboard")}
              </span>
              <span className="text-sm">Báo cáo</span>
            </Link>
          </li>

          <li>
            <button
              type="button"
              onClick={handleAccountClick}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                isAccountActive
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
              }`}
            >
              <span
                className={isAccountActive ? "text-green-600" : "text-gray-500"}
              >
                {getIcon("user")}
              </span>
              <span className="flex-1 text-sm">Quản lý tài khoản</span>
              <FaChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isAccountOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`${isAccountOpen ? "block" : "hidden"} mt-1 ml-4 space-y-1 pl-4`}
            >
              <li>
                <Link
                  to="/admin/account/citizens"
                  className={`block px-3 py-2 rounded-lg transition-colors no-underline text-sm ${
                    isCitizensActive
                      ? "bg-green-50 text-green-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
                  }`}
                >
                  Dân cư
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/account/collectors"
                  className={`block px-3 py-2 rounded-lg transition-colors no-underline text-sm ${
                    isCollectorsActive
                      ? "bg-green-50 text-green-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
                  }`}
                >
                  Người thu gom
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/account/recycling-enterprises"
                  className={`block px-3 py-2 rounded-lg transition-colors no-underline text-sm ${
                    isRecyclingEnterprisesActive
                      ? "bg-green-50 text-green-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
                  }`}
                >
                  Doanh nghiệp tái chế
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link
              to="/admin/complaints"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 no-underline ${
                isComplaintsActive
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
              }`}
            >
              <span
                className={
                  isComplaintsActive ? "text-green-600" : "text-gray-500"
                }
              >
                {getIcon("complaints")}
              </span>
              <span className="text-sm">Khiếu nại</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Profile & Logout Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-green-600 rounded-full">
            {userData.username.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {userData.username}
            </div>
            <div className="text-xs text-gray-500">{userData.plan}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-600 transition-colors rounded-lg hover:bg-red-50"
        >
          {getIcon("logout")}
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
