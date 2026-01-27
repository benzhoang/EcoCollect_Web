import { useState, useEffect } from "react";
import {
  FaBullhorn,
  FaGauge,
  FaUser,
  FaChevronDown,
} from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const SidebarAdmin = ({ isOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isAccountOpen, setIsAccountOpen] = useState(
    currentPath.startsWith("/admin/account/")
  );

  useEffect(() => {
    setIsAccountOpen(currentPath.startsWith("/admin/account/"));
  }, [currentPath]);

  const isDashboardActive = currentPath === "/admin/dashboard";
  const isAccountActive = currentPath.startsWith("/admin/account/");
  const isCitizensActive = currentPath === "/admin/account/citizens";
  const isCollectorsActive = currentPath === "/admin/account/collectors";
  const isRecyclingEnterprisesActive = currentPath === "/admin/account/recycling-enterprises";
  const isComplaintsActive = currentPath === "/admin/complaints";

  return (
    <div
      className={`w-74 h-full bg-white p-5 flex flex-col ${
        isOpen ? "open" : "collapsed"
      }`}
    >
      {/* Navigation */}
      <ul className="p-0 mt-0 space-y-1 list-none flex-1">
        <li>
          <Link
            to="/admin/dashboard"
            className={`flex items-center p-3 no-underline transition-all duration-300 text-base font-medium rounded-lg ${
              isDashboardActive
                ? "bg-green-50 text-green-600"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <FaGauge
              className={`mr-3 transition-colors duration-300 text-lg ${
                isDashboardActive ? "text-green-600" : "text-gray-700"
              }`}
            />
            <span>Báo cáo</span>
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={() => {
              setIsAccountOpen(true);
              // Sử dụng window.history để tương thích với custom routing trong App.jsx
              window.history.pushState({}, '', '/admin/account/citizens');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}  
            className={`w-full flex items-center p-3 text-left transition-all duration-300 text-base font-medium rounded-lg ${
              isAccountActive
                ? "bg-green-50 text-green-600"
                : "hover:bg-gray-50 text-gray-700"
            } cursor-pointer`}
          >
            <FaUser
              className={`mr-3 transition-colors duration-300 text-lg ${
                isAccountActive ? "text-green-600" : "text-gray-500"
              }`}
            />
            <span className={isAccountActive ? "text-green-600" : "text-gray-700"}>
              Quản lý tài khoản
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setIsAccountOpen((v) => !v);
              }}
              className={`ml-auto p-1 rounded cursor-pointer transition-transform duration-200 ${
                isAccountOpen ? "rotate-180" : ""
              } hover:bg-gray-100`}
              aria-label="Toggle user submenu"
              role="button"
            >
              <FaChevronDown />
            </span>
          </button>
          <ul
            className={`${isAccountOpen ? "block" : "hidden"} mt-1 ml-10 space-y-1`}
          >
            <li>
              <Link
                to="/admin/account/citizens"
                className={`flex items-center p-2 no-underline rounded-md transition-colors ${
                  isCitizensActive
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Dân cư</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/account/collectors"
                className={`flex items-center p-2 no-underline rounded-md transition-colors ${
                  isCollectorsActive
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Người thu gom</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/account/recycling-enterprises"
                className={`flex items-center p-2 no-underline rounded-md transition-colors ${
                  isRecyclingEnterprisesActive
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>Doanh nghiệp tái chế</span>
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link
            to="/admin/complaints"
            className={`flex items-center p-3 no-underline transition-all duration-300 text-base font-medium rounded-lg ${
              isComplaintsActive
                ? "bg-green-50 text-green-600"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <FaBullhorn
              className={`mr-3 transition-colors duration-300 text-lg ${
                isComplaintsActive ? "text-green-600" : "text-gray-500"
              }`}
            />
            <span className={isComplaintsActive ? "text-green-600" : "text-gray-700"}>
             Khiếu nại
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="/signin"
            className="flex items-center w-full p-3 text-base font-medium text-left text-red-600 transition-all duration-300 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Đăng xuất</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarAdmin;