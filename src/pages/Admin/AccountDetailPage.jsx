import React, { useState } from "react";
import {
  FaArrowLeft,
  FaInfoCircle,
  FaFileAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCircle,
  FaCalendarAlt,
  FaWeight,
  FaChevronDown,
  FaUserShield,
  FaLock,
  FaUnlock,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckSquare,
} from "react-icons/fa";

const AccountDetailPage = () => {
  // Permission Management States
  const [selectedRoles, setSelectedRoles] = useState(["citizen"]);
  const [permissions, setPermissions] = useState({
    view: true,
    edit: false,
    delete: false,
    approve: false,
  });
  const [revokeType, setRevokeType] = useState("temporary"); // temporary or permanent
  const [revokeDuration, setRevokeDuration] = useState("7");

  // Suspend/Unsuspend States
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendJustification, setSuspendJustification] = useState("");
  const [isSuspended, setIsSuspended] = useState(false);

  // Sample data
  const user = {
    name: "John Doe",
    username: "@johndoe123",
    id: "#884920",
    joinedDate: "T10/2022",
    recycled: "1240kg",
    status: isSuspended ? "Đã khóa" : "Tài khoản hoạt động",
    email: "j***@example.com",
    tokens: "450",
    pendingRequests: 2,
    currentRoles: ["citizen"],
  };

  const availableRoles = [
    { value: "citizen", label: "Công dân" },
    { value: "collector", label: "Nhân viên thu gom" },
    { value: "enterprise", label: "Doanh nghiệp tái chế" },
    { value: "admin", label: "Quản trị viên" },
  ];

  const suspendReasons = [
    { value: "point_fraud", label: "Gian lận điểm thưởng" },
    {
      value: "false_report",
      label: "Báo cáo rác không đúng sự thật (spam/phishing)",
    },
    {
      value: "wrong_verification",
      label: "Xác minh sai trạng thái thu gom (Collector/Enterprise)",
    },
    { value: "policy_violation", label: "Vi phạm chính sách" },
    { value: "other", label: "Khác" },
  ];

  const history = [
    {
      type: "warning",
      title: "Đã phát cảnh báo",
      date: "2 ngày trước",
      description:
        "Khối lượng nhựa tái chế báo cáo trong 2 giờ cao bất thường.",
      admin: "MINH NGUYỄN",
      adminInitials: "MN",
    },
    {
      type: "verified",
      title: "Tài khoản đã xác minh",
      date: "14/10/2022",
      description: "Giấy tờ tùy thân đã được phê duyệt thủ công.",
      subDescription: "Quy trình xác minh chuẩn",
    },
    {
      type: "created",
      title: "Tài khoản được tạo",
      date: "12/10/2022",
      description: "Không có ghi chú bổ sung.",
    },
  ];

  const getHistoryIcon = (type) => {
    switch (type) {
      case "warning":
        return <FaExclamationTriangle className="text-orange-500" />;
      case "verified":
        return <FaCheckCircle className="text-green-500" />;
      case "created":
        return <FaCircle className="text-blue-500" />;
      case "suspended":
        return <FaLock className="text-red-500" />;
      case "unsuspended":
        return <FaUnlock className="text-green-500" />;
      default:
        return <FaCircle className="text-gray-500" />;
    }
  };

  const handleRoleToggle = (roleValue) => {
    setSelectedRoles((prev) =>
      prev.includes(roleValue)
        ? prev.filter((r) => r !== roleValue)
        : [...prev, roleValue],
    );
  };

  const handlePermissionChange = (permission) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handleSavePermissions = () => {
    // TODO: Gọi API lưu quyền
    console.log({
      userId: user.id,
      roles: selectedRoles,
      permissions,
      revokeType,
      revokeDuration: revokeType === "temporary" ? revokeDuration : null,
    });
    alert("Đã lưu quyền thành công!");
  };

  const handleSuspendAccount = () => {
    if (!suspendReason || !suspendJustification.trim()) {
      alert("Vui lòng nhập đầy đủ lý do và giải thích!");
      return;
    }
    // TODO: Gọi API suspend account
    console.log({
      userId: user.id,
      reason: suspendReason,
      justification: suspendJustification,
    });
    setIsSuspended(true);
    alert(
      "Đã khóa tài khoản thành công! Hệ thống đã ghi log và gửi thông báo cho người dùng.",
    );
  };

  const handleUnsuspendAccount = () => {
    // TODO: Gọi API unsuspend account
    console.log({
      userId: user.id,
      action: "unsuspend",
    });
    setIsSuspended(false);
    setSuspendReason("");
    setSuspendJustification("");
    alert("Đã mở khóa tài khoản thành công!");
  };

  return (
    <div className="flex flex-col w-full h-full gap-6">
      {/* Page Header */}
      <header className="flex items-center justify-between w-full px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 text-gray-700 transition-colors hover:text-gray-900"
            onClick={() => {
              window.history.pushState({}, "", `/admin/account/citizens`);
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
          <div className="ml-5">
            <h1 className="text-2xl font-bold text-black">
              Chi tiết tài khoản
            </h1>
            <p className="text-sm text-gray-600">
              Xem và quản lý thông tin chi tiết của người dùng.
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-col flex-1 gap-6 p-6">
        {/* Main Content - 2 Columns */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="space-y-6 lg:col-span-2">
            {/* User Profile Summary Card */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                {/* Avatar Badge */}
                <div className="relative">
                  <div className="flex items-center justify-center w-20 h-20 text-2xl font-bold text-white bg-green-600 rounded-lg">
                    JD
                  </div>
                  <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"></div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="mb-1 text-2xl font-bold text-gray-900">
                    {user.name}
                  </h2>
                  <p className="mb-3 text-sm font-medium text-green-600">
                    CỘNG TÁC VIÊN TIN CẬY
                  </p>
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                    <span>{user.id}</span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-xs" />
                      Tham gia {user.joinedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaWeight className="text-xs" />
                      {user.recycled} đã tái chế
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="text-right">
                  <p className="mb-1 text-xs text-gray-500">
                    TRẠNG THÁI HIỆN TẠI
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full ${
                      isSuspended
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {isSuspended ? (
                      <FaLock className="text-xs" />
                    ) : (
                      <FaCheckCircle className="text-xs" />
                    )}
                    {user.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Role & Permission Management Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FaUserShield className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Quản lý quyền
                </h3>
              </div>
              <p className="mb-6 text-sm text-gray-600">
                Gán nhiều vai trò và cấu hình quyền chi tiết cho người dùng.
              </p>

              {/* Roles Selection */}
              <div className="mb-6">
                <label className="block mb-3 text-xs font-semibold text-gray-700 uppercase">
                  Vai trò (có thể chọn nhiều)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availableRoles.map((role) => (
                    <label
                      key={role.value}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedRoles.includes(role.value)
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role.value)}
                        onChange={() => handleRoleToggle(role.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {role.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Permissions Configuration */}
              <div className="mb-6">
                <label className="block mb-3 text-xs font-semibold text-gray-700 uppercase">
                  Cấu hình quyền chi tiết
                </label>
                <div className="space-y-2">
                  {[
                    { key: "view", label: "Xem", icon: FaEye },
                    { key: "edit", label: "Sửa", icon: FaEdit },
                    { key: "delete", label: "Xóa", icon: FaTrash },
                    { key: "approve", label: "Phê duyệt", icon: FaCheckSquare },
                  ].map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <label
                        key={item.key}
                        className="flex items-center gap-3 p-3 transition-colors border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={permissions[item.key]}
                          onChange={() => handlePermissionChange(item.key)}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <IconComponent className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Revoke Permission */}
              <div className="p-4 mb-6 border rounded-lg bg-amber-50 border-amber-200">
                <label className="block mb-2 text-xs font-semibold text-gray-700 uppercase">
                  Thu hồi quyền
                </label>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setRevokeType("temporary")}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      revokeType === "temporary"
                        ? "bg-amber-600 text-white"
                        : "bg-white border border-amber-300 text-gray-700 hover:bg-amber-50"
                    }`}
                  >
                    Tạm thời
                  </button>
                  <button
                    onClick={() => setRevokeType("permanent")}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      revokeType === "permanent"
                        ? "bg-amber-600 text-white"
                        : "bg-white border border-amber-300 text-gray-700 hover:bg-amber-50"
                    }`}
                  >
                    Vĩnh viễn
                  </button>
                </div>
                {revokeType === "temporary" && (
                  <div>
                    <label className="block mb-1 text-xs text-gray-600">
                      Thời hạn (ngày)
                    </label>
                    <input
                      type="number"
                      value={revokeDuration}
                      onChange={(e) => setRevokeDuration(e.target.value)}
                      min="1"
                      className="w-full max-w-xs px-3 py-2 border rounded-md border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Save Button */}
              <button
                onClick={handleSavePermissions}
                className="w-full px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Lưu quyền
              </button>
            </div>

            {/* Suspend/Unsuspend Account Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                {isSuspended ? (
                  <>
                    <FaUnlock className="text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Mở khóa tài khoản
                    </h3>
                  </>
                ) : (
                  <>
                    <FaLock className="text-red-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Tạm khóa tài khoản
                    </h3>
                  </>
                )}
              </div>
              <p className="mb-6 text-sm text-gray-600">
                {isSuspended
                  ? "Mở khóa tài khoản để người dùng có thể tiếp tục sử dụng hệ thống."
                  : "Khóa tài khoản khi có dấu hiệu gian lận, báo cáo sai hoặc vi phạm chính sách."}
              </p>

              {!isSuspended ? (
                <>
                  {/* Suspend Reason */}
                  <div className="mb-5">
                    <label className="block mb-2 text-xs font-semibold text-gray-700 uppercase">
                      Lý do khóa tài khoản
                    </label>
                    <div className="relative">
                      <select
                        value={suspendReason}
                        onChange={(e) => setSuspendReason(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Chọn lý do...</option>
                        {suspendReasons.map((reason) => (
                          <option key={reason.value} value={reason.value}>
                            {reason.label}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute text-sm text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                    </div>
                  </div>

                  {/* Justification */}
                  <div className="mb-5">
                    <label className="block mb-2 text-xs font-semibold text-gray-700 uppercase">
                      Giải thích chi tiết
                    </label>
                    <textarea
                      value={suspendJustification}
                      onChange={(e) => setSuspendJustification(e.target.value)}
                      placeholder="Nhập giải thích chi tiết về lý do khóa tài khoản... Hệ thống sẽ ghi log và gửi thông báo cho người dùng."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  {/* Impact Analysis */}
                  <div className="p-4 mb-5 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center gap-2 mb-2">
                      <FaInfoCircle className="text-red-600" />
                      <h4 className="text-sm font-semibold text-gray-900">
                        Tác động khi khóa
                      </h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Khóa tài khoản sẽ ngay lập tức đóng băng{" "}
                      <span className="font-semibold text-orange-600">
                        {user.tokens} ECO-tokens
                      </span>{" "}
                      và hủy {user.pendingRequests} yêu cầu thu gom đang chờ.
                      Người dùng sẽ nhận thông báo qua email: {user.email}
                    </p>
                  </div>

                  {/* Suspend Button */}
                  <button
                    onClick={handleSuspendAccount}
                    disabled={!suspendReason || !suspendJustification.trim()}
                    className="w-full px-4 py-2 font-medium text-white transition-colors bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Khóa tài khoản
                  </button>
                </>
              ) : (
                <>
                  <div className="p-4 mb-5 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center gap-2 mb-2">
                      <FaInfoCircle className="text-green-600" />
                      <h4 className="text-sm font-semibold text-gray-900">
                        Tài khoản đang bị khóa
                      </h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Tài khoản này hiện đang bị khóa. Mở khóa để người dùng có
                      thể tiếp tục sử dụng hệ thống.
                    </p>
                  </div>

                  {/* Unsuspend Button */}
                  <button
                    onClick={handleUnsuspendAccount}
                    className="w-full px-4 py-2 font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Mở khóa tài khoản
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="lg:col-span-1">
            {/* Administrative History Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FaFileAlt className="text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Lịch sử quản trị
                  </h3>
                </div>
                <button className="text-xs font-medium text-gray-600 hover:text-gray-900">
                  TẢI BÁO CÁO
                </button>
              </div>

              {/* History Timeline */}
              <div className="space-y-6">
                {history.map((item, index) => (
                  <div key={index} className="relative pl-8">
                    {/* Timeline Line */}
                    {index < history.length - 1 && (
                      <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                    )}

                    {/* Icon */}
                    <div className="absolute top-0 left-0 flex items-center justify-center w-6 h-6">
                      {getHistoryIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="mb-2 text-xs text-gray-500">{item.date}</p>
                      <p className="mb-2 text-sm text-gray-700">
                        {item.description}
                      </p>
                      {item.subDescription && (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <FaCheckCircle className="text-xs" />
                          <span>{item.subDescription}</span>
                        </div>
                      )}
                      {item.admin && (
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-gray-700 bg-gray-300 rounded-full">
                            {item.adminInitials}
                          </div>
                          <span className="text-xs text-gray-600">
                            QV: {item.admin}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* End of History */}
                <div className="pt-4 text-xs text-center text-gray-400">
                  KẾT THÚC NHẬT KÝ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailPage;
