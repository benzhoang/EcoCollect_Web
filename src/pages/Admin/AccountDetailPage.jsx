import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCalendarAlt,
  FaBan,
} from "react-icons/fa";
import { getAdminUserDetail, getAreas } from "../../service/api";
import UpdateStatusModal from "../../components/AdminComponent/Modal/UpdateStatusModal";
import PromoteCollectorModal from "../../components/AdminComponent/Modal/PromoteCollectorModal";
import DeleteRoleModal from "../../components/AdminComponent/Modal/DeleteRoleModal";
import toast from "react-hot-toast";

/**
 * Chuyển cây khu vực -> danh sách phẳng chỉ leaf (giống AreaList).
 * Mỗi phần tử: { id, name } với name = "TP.HCM - Quan 1 - Phuong Ben Nghe".
 */
const buildAreaOptions = (nodes, parentName = "") => {
  if (!nodes) return [];
  const result = [];
  nodes.forEach((node) => {
    if (!node) return;
    const currentName = parentName ? `${parentName} - ${node.name}` : node.name;
    if (
      Array.isArray(node.children) &&
      node.children.length > 0 &&
      typeof node.children[0] === "object"
    ) {
      result.push(...buildAreaOptions(node.children, currentName));
    } else {
      result.push({ id: node.id, name: currentName });
    }
  });
  return result;
};

const AccountDetailPage = () => {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [areaOptions, setAreaOptions] = useState([]);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showPromoteCollectorModal, setShowPromoteCollectorModal] =
    useState(false);
  const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);

  const pathParts =
    typeof window !== "undefined" ? window.location.pathname.split("/") : [];
  const userId = pathParts[4] || null;

  useEffect(() => {
    if (!userId) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      const data = await getAdminUserDetail(userId);
      if (!cancelled && data?.data) {
        setUserDetail(data.data);
      }
      if (!cancelled) setLoading(false);
    };
    fetch();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    let cancelled = false;
    const fetchAreas = async () => {
      const response = await getAreas();
      if (cancelled) return;
      const rawData = response?.data ?? response;
      const rootNodes = Array.isArray(rawData)
        ? rawData
        : rawData
          ? [rawData]
          : [];
      setAreaOptions(buildAreaOptions(rootNodes));
    };
    fetchAreas();
    return () => {
      cancelled = true;
    };
  }, []);

  const getWorkingAreaName = (workingAreaId) => {
    if (!workingAreaId) return null;
    const area = areaOptions.find((a) => a.id === workingAreaId);
    return area?.name ?? workingAreaId;
  };

  const getRoleLabel = (roles) => {
    if (!roles?.length) return "—";
    const role = roles[0];
    const map = {
      ROLE_CITIZEN: "Dân cư",
      ROLE_COLLECTOR: "Người thu gom",
      ROLE_ENTERPRISE_MANAGER: "Doanh nghiệp tái chế",
    };
    return map[role] || role;
  };

  const formatJoinedDate = (iso) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("vi-VN", {
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const refetchUser = async () => {
    if (!userId) return;
    const data = await getAdminUserDetail(userId);
    if (data?.data) setUserDetail(data.data);
  };

  const handlePromoteToCollector = () => {
    if (!userId) return;
    if (!areaOptions.length) {
      toast.error("Chưa có khu vực nào. Vui lòng tạo khu vực trước.");
      return;
    }
    setShowPromoteCollectorModal(true);
  };

  const handleUpdateStatus = () => {
    setShowUpdateStatusModal(true);
  };

  // const handleClearWorkingArea = async () => {
  //   if (!userId) return;
  //   if (!window.confirm("Xóa khu vực làm việc của người dùng này?")) return;
  //   try {
  //     await clearAdminUserWorkingArea(userId);
  //     toast.success("Đã xóa khu vực làm việc.");
  //     refetchUser();
  //   } catch (e) {
  //     toast.error(e?.message || "Thao tác thất bại.");
  //   }
  // };

  const handleRemoveRole = () => {
    if (!userId) return;
    const roles = userDetail?.roles ?? [];
    if (roles.length === 0) {
      toast.error("Người dùng không có vai trò nào để xóa.");
      return;
    }
    setShowDeleteRoleModal(true);
  };

  return (
    <div className="flex flex-col w-full h-full gap-6">
      {/* Page Header */}
      <header className="flex items-center justify-between w-full px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 text-gray-700 transition-colors hover:text-gray-900"
            onClick={() => {
              const pathParts = window.location.pathname.split("/");
              // path: /admin/account/{citizens|collectors|recycling-enterprises}/:id
              const segment =
                pathParts[3] && pathParts[3] !== "account"
                  ? pathParts[3]
                  : "citizens";
              const listPath = `/admin/account/${segment}`;
              window.history.pushState({}, "", listPath);
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
              {loading ? (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  Đang tải...
                </div>
              ) : !userDetail ? (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  Không tìm thấy thông tin tài khoản.
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  {/* User Info */}
                  <div className="flex-1">
                    <h2 className="mb-1 text-2xl font-bold text-gray-900">
                      {userDetail.fullName ?? "—"}
                    </h2>
                    <p className="mb-3 text-sm font-medium text-green-600">
                      {getRoleLabel(userDetail.roles)}
                    </p>
                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1 mb-3">
                        <FaCalendarAlt className="text-xs" />
                        Tham gia {formatJoinedDate(userDetail.createdAt)}
                      </span>
                      {userDetail.email != null && userDetail.email !== "" && (
                        <span className="flex items-center gap-1 mb-3">
                          Email:{" "}
                          <span className="font-medium">
                            {userDetail.email}
                          </span>
                        </span>
                      )}
                      {userDetail.phone != null && userDetail.phone !== "" && (
                        <span className="flex items-center gap-1">
                          Số điện thoại:{" "}
                          <span className="font-medium">
                            {userDetail.phone}
                          </span>
                        </span>
                      )}
                      {userDetail.workingAreaId != null &&
                        userDetail.workingAreaId !== "" && (
                          <span className="flex items-center gap-1 mt-3">
                            Khu vực:{" "}
                            <span className="font-medium">
                              {getWorkingAreaName(userDetail.workingAreaId)}
                            </span>
                          </span>
                        )}
                      {userDetail.status === "SUSPENDED" && (
                        <span className="flex items-center gap-1 mt-3">
                          Lý do bị đình chỉ:{" "}
                          <span className="font-medium">
                            {userDetail.suspendedReason || "—"}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="text-right">
                    <p className="mb-1 text-xs text-gray-500">
                      TRẠNG THÁI HIỆN TẠI
                    </p>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full ${
                        userDetail.status === "SUSPENDED"
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {userDetail.status === "SUSPENDED" ? (
                        <FaBan className="text-xs" />
                      ) : (
                        <FaCheckCircle className="text-xs" />
                      )}
                      {userDetail.status === "SUSPENDED"
                        ? "Đã đình chỉ"
                        : "Hoạt động"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="space-y-3">
                {userDetail?.roles?.includes("ROLE_CITIZEN") && (
                  <button
                    type="button"
                    onClick={handlePromoteToCollector}
                    className="w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 border border-green-600 rounded-md hover:bg-green-700 hover:border-green-700"
                  >
                    Chuyển thành người thu gom
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  className="w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 hover:border-blue-700"
                >
                  Cập nhật trạng thái người dùng
                </button>
                {/* <button
                  type="button"
                  onClick={handleClearWorkingArea}
                  className="w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 border border-red-600 rounded-md hover:bg-red-700 hover:border-red-700"
                >
                  Xóa khu vực làm việc
                </button> */}
                <button
                  type="button"
                  onClick={handleRemoveRole}
                  className="w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 border border-red-600 rounded-md hover:bg-red-700 hover:border-red-700"
                >
                  Xóa vai trò
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpdateStatusModal
        key={
          showUpdateStatusModal && userDetail?.status
            ? `open-${userDetail.status}`
            : "closed"
        }
        isOpen={showUpdateStatusModal}
        onClose={() => setShowUpdateStatusModal(false)}
        userId={userId}
        onSuccess={refetchUser}
        initialStatus={userDetail?.status || "ACTIVE"}
      />

      <PromoteCollectorModal
        key={
          showPromoteCollectorModal && userDetail?.workingAreaId
            ? `promote-${userDetail.workingAreaId}`
            : "promote-closed"
        }
        isOpen={showPromoteCollectorModal}
        onClose={() => setShowPromoteCollectorModal(false)}
        userId={userId}
        areaOptions={areaOptions}
        onSuccess={refetchUser}
        initialAreaId={userDetail?.workingAreaId || ""}
      />

      <DeleteRoleModal
        isOpen={showDeleteRoleModal}
        onClose={() => setShowDeleteRoleModal(false)}
        userId={userId}
        roles={userDetail?.roles ?? []}
        onSuccess={refetchUser}
      />
    </div>
  );
};

export default AccountDetailPage;
