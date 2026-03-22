import React, { useState, useEffect, useMemo } from "react";
import { FaEdit, FaPause } from "react-icons/fa";
import { FaArrowsRotate } from "react-icons/fa6";
import toast from "react-hot-toast";
import UpdateWasteCategoryModal from "./Modal/UpdateWasteCategoryModal";
import ModalConfirm from "./Modal/ModalConfirm";
import AdminPagination from "./AdminPagination";
import {
  getWasteCategories,
  deactivateWasteCategory,
  activateWasteCategory,
} from "../../service/api";

const PAGE_SIZE = 5;

const WasteCategoryList = ({ refreshTrigger = 0 }) => {
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [modalMode, setModalMode] = useState("deactivate"); // "deactivate" | "activate"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
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
        const response = await getWasteCategories({ includeInactive: true });
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

  /** Mở modal vô hiệu hóa (danh mục đang hoạt động) hoặc kích hoạt (danh mục đã tắt) */
  const handleToggleActive = (category) => {
    setSelectedCategory(category);
    setModalMode(category.active === false ? "activate" : "deactivate");
    setIsModalDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (!deleteLoading) {
      setIsModalDeleteOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleConfirmToggle = async () => {
    if (!selectedCategory?.id) return;
    setDeleteLoading(true);
    try {
      if (modalMode === "activate") {
        await activateWasteCategory(selectedCategory.id);
        setCategories((prev) =>
          prev.map((c) =>
            c.id === selectedCategory.id ? { ...c, active: true } : c,
          ),
        );
        toast.success("Đã kích hoạt danh mục loại rác.");
      } else {
        await deactivateWasteCategory(selectedCategory.id);
        setCategories((prev) =>
          prev.map((c) =>
            c.id === selectedCategory.id ? { ...c, active: false } : c,
          ),
        );
        toast.success("Đã vô hiệu hóa danh mục loại rác.");
      }
      handleCloseDeleteModal();
    } catch {
      toast.error(
        modalMode === "activate"
          ? "Không thể kích hoạt danh mục. Vui lòng thử lại."
          : "Không thể vô hiệu hóa danh mục. Vui lòng thử lại.",
      );
    } finally {
      setDeleteLoading(false);
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
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          category.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {category.active ? "Hoạt động" : "Không hoạt động"}
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
                        {category.active === false ? (
                          <button
                            type="button"
                            onClick={() => handleToggleActive(category)}
                            className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-green-100 shrink-0"
                            title="Khôi phục"
                          >
                            <FaArrowsRotate className="text-sm text-green-600" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleActive(category)}
                            className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-gray-100 shrink-0"
                            title="Vô hiệu hóa"
                          >
                            <FaPause className="text-sm text-gray-500" />
                          </button>
                        )}
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

      <ModalConfirm
        isOpen={isModalDeleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmToggle}
        title={
          modalMode === "activate"
            ? "Xác nhận kích hoạt lại"
            : "Xác nhận vô hiệu hóa"
        }
        message={
          selectedCategory
            ? modalMode === "activate"
              ? `Bạn có chắc muốn kích hoạt lại danh mục "${selectedCategory.name}"?`
              : `Bạn có chắc muốn vô hiệu hóa danh mục "${selectedCategory.name}"?`
            : modalMode === "activate"
              ? "Bạn có chắc muốn kích hoạt lại danh mục này?"
              : "Bạn có chắc chắn muốn vô hiệu hóa danh mục này?"
        }
        confirmText={modalMode === "activate" ? "Kích hoạt" : "Vô hiệu hóa"}
        isLoading={deleteLoading}
        variant={modalMode === "activate" ? "success" : "danger"}
      />

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
