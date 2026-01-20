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
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"
            }`}
          >
            <FaGauge
              className={`mr-3 transition-colors duration-300 text-lg ${
                isDashboardActive ? "text-blue-600" : "text-gray-500"
              }`}
            />
            <span>Báo cáo</span>
          </Link>
        </li>
        <li>
          <button
            type="button"
            className={`w-full flex items-center p-3 text-left transition-all duration-300 text-base font-medium rounded-lg hover:bg-gray-50 cursor-pointer text-gray-700 hover:text-blue-600`}
          >
            <FaUser
              className={`mr-3 transition-colors duration-300 text-lg text-gray-500`}
            />
            <span className="text-gray-700 hover:text-blue-600">
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
                to="/admin/account/residents"
                className={`flex items-center p-2 no-underline rounded-md transition-colors text-gray-700 hover:bg-gray-100
                }`}
              >
                <span>Dân cư</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/account/recyclers"
                className={`flex items-center p-2 no-underline rounded-md transition-colors text-gray-700 hover:bg-gray-100
                }`}
              >
                <span>Người thu gom</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/account/recycling-companies"
                className={`flex items-center p-2 no-underline rounded-md transition-colors text-gray-700 hover:bg-gray-100
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
            className={`flex items-center p-3 no-underline transition-all duration-300 text-base font-medium rounded-lg hover:bg-gray-50 text-gray-700 hover:text-blue-600
            }`}
          >
            <FaBullhorn
              className={`mr-3 transition-colors duration-300 text-lg text-gray-500
              }`}
            />
            <span className="text-gray-700 hover:text-blue-600">
             Khiếu nại
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="/signin"
            className="flex items-center w-full p-3 text-base font-medium text-left text-gray-500 transition-all duration-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:text-red-600"
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