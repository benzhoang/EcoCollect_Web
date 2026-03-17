import React, { useState, useEffect, useMemo } from "react";
import { FaEdit, FaPause } from "react-icons/fa";
import toast from "react-hot-toast";
import UpdateAreaModal from "./Modal/UpdateAreaModal";
import ModalConfirm from "./Modal/ModalConfirm";
import AdminPagination from "./AdminPagination";
import { getAreas, deactivateArea } from "../../service/api";

const PAGE_SIZE = 5;

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

const AreaList = ({ userId = null }) => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);

  const pageInfo = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      totalElements: areas.length,
      totalPages: Math.max(1, Math.ceil(areas.length / PAGE_SIZE)),
    }),
    [page, areas.length],
  );
  const displayAreas = useMemo(
    () => areas.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [areas, page],
  );

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

  const handleCloseDeleteModal = () => {
    if (!deleteLoading) {
      setIsModalDeleteOpen(false);
      setSelectedArea(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedArea?.id) return;
    setDeleteLoading(true);
    try {
      await deactivateArea(selectedArea.id);
      const response = await getAreas();
      const rawData = response?.data ?? response;
      const rootNodes = rawData
        ? Array.isArray(rawData)
          ? rawData
          : [rawData]
        : [];
      setAreas(buildAreaOptions(rootNodes));
      handleCloseDeleteModal();
      toast.success("Đã vô hiệu hóa khu vực.");
    } catch {
      toast.error("Không thể vô hiệu hóa khu vực. Vui lòng thử lại.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdateSuccess = async () => {
    setIsModalUpdateOpen(false);
    setEditingArea(null);
    try {
      const response = await getAreas();
      const rawData = response?.data ?? response;
      const rootNodes = rawData
        ? Array.isArray(rawData)
          ? rawData
          : [rawData]
        : [];
      setAreas(buildAreaOptions(rootNodes));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (nextPage) => {
    setPage(Math.max(0, nextPage - 1));
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
              displayAreas.map((area, index) => (
                <tr
                  key={area.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {page * PAGE_SIZE + index + 1}
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
                        className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-gray-50 shrink-0"
                        title="Vô hiệu hóa"
                      >
                        <FaPause className="text-sm text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && (
          <AdminPagination
            pageInfo={pageInfo}
            currentPage={page + 1}
            onPageChange={handlePageChange}
            itemCount={displayAreas.length}
            itemLabel="khu vực"
          />
        )}
      </div>

      <ModalConfirm
        isOpen={isModalDeleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xác nhận vô hiệu hóa"
        message={
          selectedArea
            ? `Bạn có chắc muốn vô hiệu hóa khu vực "${selectedArea.name}"?`
            : "Bạn có chắc chắn muốn vô hiệu hóa khu vực này?"
        }
        confirmText="Vô hiệu hóa"
        isLoading={deleteLoading}
      />

      <UpdateAreaModal
        isOpen={isModalUpdateOpen}
        onClose={() => {
          setIsModalUpdateOpen(false);
          setEditingArea(null);
        }}
        area={editingArea}
        onSuccess={handleUpdateSuccess}
        userId={userId}
      />
    </>
  );
};

export default AreaList;
