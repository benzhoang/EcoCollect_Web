import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getAdminWasteCapabilities } from "../../service/api";

const WasteCapabilityList = ({ searchTerm = "", refreshToken = 0 }) => {
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [capabilities, setCapabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCapabilities = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAdminWasteCapabilities();
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.content)
              ? response.data.content
              : [];
        setCapabilities(list);
      } catch (err) {
        setError(err?.message || "Không thể tải danh sách công suất.");
        setCapabilities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCapabilities();
  }, [refreshToken]);

  const filteredList = searchTerm
    ? capabilities.filter(
      (item) => {
        const name = item.wasteCategoryName ?? item.wasteType ?? "";
        const code = item.wasteCategoryCode ?? item.wasteTypeId ?? "";
        const term = searchTerm.toLowerCase();
        return name.toString().toLowerCase().includes(term) || code.toString().toLowerCase().includes(term);
      }
    )
    : capabilities;

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalUpdateOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsModalDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setCapabilities((prev) => prev.filter((c) => c.id !== selectedItem.id));
      setIsModalDeleteOpen(false);
      setSelectedItem(null);
    }
  };

  const onUpdateSuccess = (updatedItem) => {
    setCapabilities((prev) =>
      prev.map((c) => (c.id === updatedItem.id ? updatedItem : c)),
    );
    setIsModalUpdateOpen(false);
    setEditingItem(null);
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
      <div className="px-6 py-4 bg-red-50 border border-red-200 rounded-lg">
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
                  MÃ LOẠI
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  LOẠI RÁC
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  CÔNG SUẤT (KG/NGÀY)
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase">
                  ĐANG TIẾP NHẬN
                </th>
                <th className="w-40 px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredList.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-sm text-center text-gray-500"
                  >
                    Chưa có dữ liệu công suất tiếp nhận rác.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {item.wasteCategoryCode ?? item.wasteTypeId ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {item.wasteCategoryName ?? item.wasteType ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {(() => {
                          const cap = item.dailyCapacityKg ?? item.capacityPerDay;
                          return typeof cap === "number" ? `${cap} kg` : (cap ?? "—");
                        })()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${(item.accepting ?? item.status) === true
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {(item.accepting ?? item.status) === true ? "Có" : "Không"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-yellow-50 shrink-0"
                          title="Sửa"
                        >
                          <FaEdit className="text-sm text-yellow-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
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

      {/* Modal xác nhận xóa */}
      {isModalDeleteOpen && selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setIsModalDeleteOpen(false);
            setSelectedItem(null);
          }}
        >
          <div
            className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-6 pb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Xác nhận xóa
              </h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-gray-700">
                Bạn có chắc muốn xóa công suất tiếp nhận &quot;
                {selectedItem.wasteCategoryName ?? selectedItem.wasteType ?? selectedItem.wasteCategoryCode ?? "này"}
                &quot;?
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4">
              <button
                onClick={() => {
                  setIsModalDeleteOpen(false);
                  setSelectedItem(null);
                }}
                type="button"
                className="px-4 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                type="button"
                className="px-4 py-2 text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TODO: thay bằng UpdateWasteCapabilityModal khi có */}
      {isModalUpdateOpen && editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setIsModalUpdateOpen(false);
            setEditingItem(null);
          }}
        >
          <div
            className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Sửa công suất
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Modal cập nhật công suất sẽ được thêm sau.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalUpdateOpen(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => onUpdateSuccess(editingItem)}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WasteCapabilityList;
