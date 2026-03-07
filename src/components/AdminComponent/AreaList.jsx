import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateAreaModal from "./Modal/UpdateAreaModal";
import { getAreas } from "../../service/api";

/**
 * Chuyển cây khu vực -> danh sách phẳng chỉ leaf (giống RankPage buildAreaOptions).
 * Mỗi phần tử: { id, name } với name = path đầy đủ "TP.HCM - Quan 1 - Phuong Ben Nghe".
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

const AreaList = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        const response = await getAreas();
        const rawData = response?.data ?? response;
        if (!rawData) {
          setAreas([]);
          return;
        }
        const rootNodes = Array.isArray(rawData) ? rawData : [rawData];
        const options = buildAreaOptions(rootNodes);
        setAreas(options);
      } catch (err) {
        console.error(err);
        setAreas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  const handleEdit = (area) => {
    setEditingArea(area);
    setIsModalUpdateOpen(true);
  };

  const handleDelete = (area) => {
    setSelectedArea(area);
    setIsModalDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedArea) {
      setAreas((prev) => prev.filter((a) => a.id !== selectedArea.id));
      setIsModalDeleteOpen(false);
      setSelectedArea(null);
    }
  };

  const handleUpdateSuccess = (updatedArea) => {
    setAreas((prev) =>
      prev.map((a) =>
        a.id === updatedArea.id
          ? { id: a.id, name: updatedArea.name ?? a.name }
          : a,
      ),
    );
    setIsModalUpdateOpen(false);
    setEditingArea(null);
  };

  return (
    <>
      {/* mr-6: chừa chỗ bên phải để thanh scroll của layout nằm ngoài bảng */}
      <div className="mr-6 overflow-x-auto overflow-y-visible bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full table-fixed min-w-100">
          <colgroup>
            <col className="w-20" />
            <col />
            <col className="w-40" />
          </colgroup>
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                STT
              </th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                TÊN KHU VỰC
              </th>

              <th className="w-40 px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase">
                THAO TÁC
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-sm text-center text-gray-500"
                >
                  Đang tải...
                </td>
              </tr>
            ) : areas.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-sm text-center text-gray-500"
                >
                  Không có khu vực nào
                </td>
              </tr>
            ) : (
              areas.map((area, index) => (
                <tr
                  key={area.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900" title={area.name}>
                      {area.name ?? "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(area)}
                        className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-yellow-50 shrink-0"
                        title="Sửa"
                      >
                        <FaEdit className="text-sm text-yellow-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(area)}
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

      {/* Modal xác nhận xóa khu vực */}
      {isModalDeleteOpen && selectedArea && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setIsModalDeleteOpen(false);
            setSelectedArea(null);
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
                Bạn có chắc muốn xóa khu vực &quot;{selectedArea.name}&quot;?
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4">
              <button
                onClick={() => {
                  setIsModalDeleteOpen(false);
                  setSelectedArea(null);
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

      <UpdateAreaModal
        isOpen={isModalUpdateOpen}
        onClose={() => {
          setIsModalUpdateOpen(false);
          setEditingArea(null);
        }}
        area={editingArea}
        onSuccess={handleUpdateSuccess}
      />
    </>
  );
};

export default AreaList;
