import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImage from "../../assets/Screenshot_2026-01-17_220348-removebg-preview.png";
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
    currentPath.startsWith("/admin/account/")
  );
  const userData = useMemo(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : { fullName: "Admin", userType: "ADMIN" };
    } catch {
      return { fullName: "Admin", userType: "ADMIN" };
    }
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
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
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 text-left cursor-pointer ${
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
              className={`${
                isAccountOpen ? "block" : "hidden"
              } mt-1 ml-4 space-y-1 pl-4`}
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
            {(userData.fullName || "A").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {userData.fullName || "Admin"}
            </div>
            <div className="text-xs text-gray-500">{userData.userType || "ADMIN"}</div>
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

export default AdminSidebar;
