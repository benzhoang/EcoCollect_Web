import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ModalConfirm from "./ModalConfirm";
import ModalUpdate from "./ModalUpdate";

const AccountList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccountEmail, setSelectedAccountEmail] = useState("");
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  // Dữ liệu mẫu
  const accounts = [
    {
      id: 1,
      fullName: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "123-456-7890",
      role: "Dân cư",
    },
    {
      id: 2,
      fullName: "Bob Smith",
      email: "bob.smith@example.com",
      phone: "234-567-8901",
      role: "Dân cư",
    },
    {
      id: 3,
      fullName: "Charlie Brown",
      email: "charlie.brown@example.com",
      phone: "345-678-9012",
      role: "Dân cư",
    },
    {
      id: 4,
      fullName: "Diana Prince",
      email: "diana.prince@example.com",
      phone: "456-789-0123",
      role: "Dân cư",
    },
    {
      id: 5,
      fullName: "Ethan Hunt",
      email: "ethan.hunt@example.com",
      phone: "567-890-1234",
      role: "Dân cư",
    },
  ];

  const handleView = () => {
    // Sử dụng window.history để tương thích với custom routing trong App.jsx
    window.history.pushState({}, "", `/admin/account/detail`);
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
    // Xử lý logic xóa tài khoản
    console.log("Delete account:", selectedAccountEmail);
    // TODO: Gọi API xóa tài khoản
    setIsModalOpen(false);
    setSelectedAccountEmail("");
  };

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
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  VAI TRÒ
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase w-40">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((account, index) => (
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
                      {account.fullName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {account.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {account.phone}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {account.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(account.id)}
                        className="flex items-center justify-center w-9 h-9 transition-colors border border-gray-300 rounded-lg hover:bg-blue-50 shrink-0"
                        title="Xem chi tiết"
                      >
                        <FaEye className="text-blue-600 text-sm" />
                      </button>
                      <button
                        onClick={handleEdit}
                        className="flex items-center justify-center w-9 h-9 transition-colors border border-gray-300 rounded-lg hover:bg-yellow-50 shrink-0"
                        title="Sửa"
                      >
                        <FaEdit className="text-yellow-600 text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(account.id, account.email)}
                        className="flex items-center justify-center w-9 h-9 transition-colors border border-gray-300 rounded-lg hover:bg-red-50 shrink-0"
                        title="Xóa"
                      >
                        <FaTrash className="text-red-600 text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

      <ModalUpdate
        isOpen={isModalUpdateOpen}
        onClose={() => setIsModalUpdateOpen(false)}
      />
    </>
  );
};

export default AccountList;
