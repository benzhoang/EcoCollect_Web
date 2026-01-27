import React, { useState } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import ModalConfirm from './ModalConfirm';

const AccountList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccountEmail, setSelectedAccountEmail] = useState('');
  
  // Dữ liệu mẫu
  const accounts = [
    {
      id: 1,
      fullName: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '123-456-7890',
      role: 'Dân cư'
    },
    {
      id: 2,
      fullName: 'Bob Smith',
      email: 'bob.smith@example.com',
      phone: '234-567-8901',
      role: 'Dân cư'
    },
    {
      id: 3,
      fullName: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      phone: '345-678-9012',
      role: 'Dân cư'
    },
    {
      id: 4,
      fullName: 'Diana Prince',
      email: 'diana.prince@example.com',
      phone: '456-789-0123',
      role: 'Dân cư'
    },
    {
      id: 5,
      fullName: 'Ethan Hunt',
      email: 'ethan.hunt@example.com',
      phone: '567-890-1234',
      role: 'Dân cư'
    }
  ];

  const handleView = () => {
    // Sử dụng window.history để tương thích với custom routing trong App.jsx
    window.history.pushState({}, '', `/admin/account/detail`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleEdit = (id) => {
    console.log('Edit account:', id);
    // Xử lý logic chỉnh sửa
  };

  const handleDelete = (id, email) => {
    setSelectedAccountEmail(email);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Xử lý logic xóa tài khoản
    console.log('Delete account:', selectedAccountEmail);
    // TODO: Gọi API xóa tài khoản
    setIsModalOpen(false);
    setSelectedAccountEmail('');
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white border-collapse rounded-lg">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase border-b">
              STT
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase border-b">
              Họ và tên
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase border-b">
              Email
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase border-b">
              Số điện thoại
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase border-b">
              Vai trò
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase border-b">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {accounts.map((account, index) => (
            <tr key={account.id}>
              <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                {index + 1}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                {account.fullName}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                {account.email}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                {account.phone}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                {account.role}
              </td>
              <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleView(account.id)}
                    className="p-2 transition-colors border border-gray-300 rounded hover:bg-blue-50"
                    title="View"
                  >
                    <FaEye className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleEdit(account.id)}
                    className="p-2 transition-colors border border-gray-300 rounded hover:bg-yellow-50"
                    title="Edit"
                  >
                    <FaEdit className="text-yellow-600" />
                  </button>
                    <button
                      onClick={() => handleDelete(account.id, account.email)}
                      className="p-2 transition-colors border border-gray-300 rounded hover:bg-red-50"
                      title="Delete"
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalConfirm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAccountEmail('');
        }}
        onConfirm={handleConfirmDelete}
        accountEmail={selectedAccountEmail}
      />
    </div>
  );
};

export default AccountList;
