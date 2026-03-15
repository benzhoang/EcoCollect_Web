import React, { useState, useEffect, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getAdminRewardRules, getWasteCategories } from "../../service/api";
import AdminPagination from "./AdminPagination";

const PAGE_SIZE = 5;

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

const RewardRuleList = ({ searchTerm = "" }) => {
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [rules, setRules] = useState([]);
  const [categoryNameMap, setCategoryNameMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const [rulesRes, categoriesRes] = await Promise.all([
          getAdminRewardRules(),
          getWasteCategories(),
        ]);
        if (cancelled) return;
        const list = Array.isArray(rulesRes?.data) ? rulesRes.data : [];
        setRules(list);
        const cats = Array.isArray(categoriesRes?.data)
          ? categoriesRes.data
          : [];
        const map = {};
        cats.forEach((c) => {
          if (c?.id != null) map[c.id] = c.name ?? c.code ?? c.id;
        });
        setCategoryNameMap(map);
      } catch (err) {
        if (!cancelled) setLoadError(err?.message ?? "Không tải được dữ liệu.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const getCategoryName = (wasteCategoryId) =>
    categoryNameMap[wasteCategoryId] ?? wasteCategoryId ?? "—";

  const filteredList = useMemo(() => {
    if (!searchTerm) return rules;
    const term = searchTerm.toLowerCase();
    return rules.filter((item) => {
      const name =
        categoryNameMap[item.wasteCategoryId] ?? item.wasteCategoryId ?? "";
      return String(name).toLowerCase().includes(term);
    });
  }, [rules, searchTerm, categoryNameMap]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const pageInfo = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      totalElements: filteredList.length,
      totalPages: Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE)),
    }),
    [page, filteredList.length],
  );
  const displayList = useMemo(
    () => filteredList.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [filteredList, page],
  );

  const handlePageChange = (nextPage) => {
    setPage(Math.max(0, nextPage - 1));
  };

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
      setRules((prev) => prev.filter((r) => r.id !== selectedItem.id));
      setIsModalDeleteOpen(false);
      setSelectedItem(null);
    }
  };

  const onUpdateSuccess = (updatedItem) => {
    setRules((prev) =>
      prev.map((r) => (r.id === updatedItem.id ? updatedItem : r)),
    );
    setIsModalUpdateOpen(false);
    setEditingItem(null);
  };

  return (
    <>
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase whitespace-nowrap">
                  STT
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase whitespace-nowrap">
                  LOẠI RÁC
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right text-gray-700 uppercase whitespace-nowrap">
                  ĐIỂM/KG
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  ĐIỂM CHẤT
                  <br />
                  LƯỢNG
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  ĐIỂM HOÀN THÀNH
                  <br />
                  NHANH
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase whitespace-nowrap">
                  HIỆU LỰC TỪ
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase whitespace-nowrap">
                  HIỆU LỰC ĐẾN
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase whitespace-nowrap">
                  ƯU TIÊN
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase whitespace-nowrap">
                  TRẠNG THÁI
                </th>
                <th className="w-40 px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase whitespace-nowrap">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-8 text-sm text-center text-gray-500"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-8 text-sm text-center text-red-600"
                  >
                    {loadError}
                  </td>
                </tr>
              ) : displayList.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-8 text-sm text-center text-gray-500"
                  >
                    Chưa có dữ liệu quy tắc thưởng.
                  </td>
                </tr>
              ) : (
                displayList.map((item, index) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {page * PAGE_SIZE + index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {getCategoryName(item.wasteCategoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {typeof item.pointsPerKg === "number"
                          ? item.pointsPerKg
                          : (item.pointsPerKg ?? "—")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {typeof item.bonusQualityPoints === "number"
                          ? item.bonusQualityPoints
                          : (item.bonusQualityPoints ?? "—")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {typeof item.bonusFastCompletePoints === "number"
                          ? item.bonusFastCompletePoints
                          : (item.bonusFastCompletePoints ?? "—")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {formatDate(item.effectiveFrom)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {formatDate(item.effectiveTo)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {typeof item.priority === "number"
                          ? item.priority
                          : (item.priority ?? "—")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          item.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.active ? "Hoạt động" : "Ẩn"}
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
        {!loading && !loadError && (
          <AdminPagination
            pageInfo={pageInfo}
            currentPage={page + 1}
            onPageChange={handlePageChange}
            itemCount={displayList.length}
            itemLabel="quy tắc thưởng"
          />
        )}
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
                Bạn có chắc muốn xóa quy tắc thưởng này?
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

      {/* Modal sửa placeholder */}
      {isModalUpdateOpen && editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setIsModalUpdateOpen(false);
            setEditingItem(null);
          }}
        >
          <div
            className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Sửa quy tắc thưởng
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Modal cập nhật quy tắc thưởng sẽ được thêm sau.
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

export default RewardRuleList;
