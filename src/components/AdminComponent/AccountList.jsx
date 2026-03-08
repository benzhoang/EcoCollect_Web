import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ModalConfirm from "./Modal/ModalConfirm";
import UpdateAccountModal from "./Modal/UpdateAccountModal";
import { getAdminUsers } from "../../service/api";

const ROLE_LABELS = {
  ROLE_CITIZEN: "Dân cư",
  ROLE_COLLECTOR: "Người thu gom",
  ROLE_ENTERPRISE_MANAGER: "Doanh nghiệp tái chế",
};

const ROLE_TO_SEGMENT = {
  ROLE_CITIZEN: "citizens",
  ROLE_COLLECTOR: "collectors",
  ROLE_ENTERPRISE_MANAGER: "recycling-enterprises",
};

const AccountList = ({ roleFilter = null, searchTerm = "" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccountEmail, setSelectedAccountEmail] = useState("");
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAdminUsers({
          role: roleFilter || undefined,
          searchTerm: searchTerm || undefined,
          page: 0,
          size: 10,
        });
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.content)
            ? response.content
            : Array.isArray(response?.data)
              ? response.data
              : Array.isArray(response?.data?.content)
                ? response.data.content
                : [];
        setAccounts(list);
      } catch (err) {
        setError(err?.message || "Không thể tải danh sách tài khoản.");
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [roleFilter, searchTerm]);

  const handleView = (accountId) => {
    const segment = ROLE_TO_SEGMENT[roleFilter] ?? "citizens";
    window.history.pushState(
      {},
      "",
      `/admin/account/${segment}/${accountId}`
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleEdit = () => {
    setIsModalUpdateOpen(true);
  };

  const handleDelete = (id, email) => {
    setSelectedAccountEmail(email);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Delete account:", selectedAccountEmail);
    setIsModalOpen(false);
    setSelectedAccountEmail("");
  };

  const formatRoles = (roles) => {
    if (!Array.isArray(roles)) return "—";
    return roles.map((r) => ROLE_LABELS[r] || r).join(", ") || "—";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN");
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  STT
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  HỌ VÀ TÊN
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  EMAIL
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  SỐ ĐIỆN THOẠI
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase">
                  TRẠNG THÁI
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  VAI TRÒ
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  NGÀY TẠO
                </th>
                <th className="w-40 px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-sm text-center text-gray-500"
                  >
                    Chưa có dữ liệu tài khoản.
                  </td>
                </tr>
              ) : (
                accounts.map((account, index) => (
                  <tr
                    key={account.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {account.fullName ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {account.email ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {account.phone ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          account.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {account.status === "ACTIVE"
                          ? "Hoạt động"
                          : (account.status ?? "—")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {formatRoles(account.roles)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {formatDate(account.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(account.id)}
                          className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-blue-50 shrink-0"
                          title="Xem chi tiết"
                        >
                          <FaEye className="text-sm text-blue-600" />
                        </button>
                        <button
                          onClick={handleEdit}
                          className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-yellow-50 shrink-0"
                          title="Sửa"
                        >
                          <FaEdit className="text-sm text-yellow-600" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(account.id, account.email)
                          }
                          className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-red-50 shrink-0"
                          title="Xóa"
                        >
                          <FaTrash className="text-sm text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalConfirm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAccountEmail("");
        }}
        onConfirm={handleConfirmDelete}
        accountEmail={selectedAccountEmail}
      />

      <UpdateAccountModal
        isOpen={isModalUpdateOpen}
        onClose={() => setIsModalUpdateOpen(false)}
      />
    </>
  );
};

export default AccountList;
