import React, { useState, useEffect, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateWasteCategoryModal from "./Modal/UpdateWasteCategoryModal";
import AdminPagination from "./AdminPagination";
import { getWasteCategories } from "../../service/api";

const PAGE_SIZE = 5;

const WasteCategoryList = ({ refreshTrigger = 0 }) => {
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  const pageInfo = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      totalElements: categories.length,
      totalPages: Math.max(1, Math.ceil(categories.length / PAGE_SIZE)),
    }),
    [page, categories.length],
  );
  const displayList = useMemo(
    () => categories.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [categories, page],
  );
  const handlePageChange = (nextPage) => {
    setPage(Math.max(0, nextPage - 1));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getWasteCategories();
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];
        setCategories(list);
      } catch (err) {
        setError(err?.message || "Không thể tải danh sách danh mục loại rác.");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [refreshTrigger]);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalUpdateOpen(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsModalDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
      setIsModalDeleteOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleUpdateSuccess = (updatedCategory) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)),
    );
    setIsModalUpdateOpen(false);
    setEditingCategory(null);
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
                  TÊN LOẠI RÁC
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase">
                  TRẠNG THÁI
                </th>
                <th className="w-40 px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-sm text-center text-gray-500"
                  >
                    Chưa có dữ liệu danh mục loại rác.
                  </td>
                </tr>
              ) : (
                displayList.map((category, index) => (
                  <tr
                    key={category.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {page * PAGE_SIZE + index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {category.code ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {category.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          category.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {category.active ? "Hoạt động" : "Ẩn"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-yellow-50 shrink-0"
                          title="Sửa"
                        >
                          <FaEdit className="text-sm text-yellow-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
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
        {!loading && !error && (
          <AdminPagination
            pageInfo={pageInfo}
            currentPage={page + 1}
            onPageChange={handlePageChange}
            itemCount={displayList.length}
            itemLabel="danh mục loại rác"
          />
        )}
      </div>

      {/* Modal xác nhận xóa danh mục */}
      {isModalDeleteOpen && selectedCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setIsModalDeleteOpen(false);
            setSelectedCategory(null);
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
                Bạn có chắc muốn xóa danh mục &quot;{selectedCategory.name}
                &quot;?
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4">
              <button
                onClick={() => {
                  setIsModalDeleteOpen(false);
                  setSelectedCategory(null);
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

      <UpdateWasteCategoryModal
        isOpen={isModalUpdateOpen}
        onClose={() => {
          setIsModalUpdateOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSuccess={handleUpdateSuccess}
      />
    </>
  );
};

export default WasteCategoryList;
