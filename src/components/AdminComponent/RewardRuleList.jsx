import React, { useState, useEffect, useMemo } from "react";
import { FaPause } from "react-icons/fa";
import { FaArrowsRotate } from "react-icons/fa6";
import toast from "react-hot-toast";
import {
  getAdminRewardRules,
  getWasteCategories,
  toggleAdminRewardRule,
} from "../../service/api";
import AdminPagination from "./AdminPagination";
import ModalConfirm from "./Modal/ModalConfirm";

const PAGE_SIZE = 5;

const formatDate = (dateStr) => {
  if (!dateStr) return "Không có";
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

const RewardRuleList = ({ searchTerm = "", refreshKey = 0 }) => {
  const [isModalToggleOpen, setIsModalToggleOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(false);
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
      } catch {
        if (!cancelled) setLoadError("Không tải được dữ liệu");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const getCategoryName = (wasteCategoryId) =>
    categoryNameMap[wasteCategoryId] ?? wasteCategoryId ?? "Không có";

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

  const handleToggle = (item) => {
    setSelectedItem(item);
    setIsModalToggleOpen(true);
  };

  const handleCloseToggleModal = () => {
    if (!toggleLoading) {
      setIsModalToggleOpen(false);
      setSelectedItem(null);
    }
  };

  const handleConfirmToggle = async () => {
    if (!selectedItem?.id) return;
    setToggleLoading(true);
    try {
      await toggleAdminRewardRule(selectedItem.id);
      setRules((prev) =>
        prev.map((r) =>
          r.id === selectedItem.id ? { ...r, active: !(r.active ?? false) } : r,
        ),
      );
      handleCloseToggleModal();
      const isRestore = selectedItem.active === false;
      toast.success(
        isRestore
          ? "Đã bật lại quy tắc thưởng."
          : "Đã tạm dừng quy tắc thưởng.",
      );
    } catch {
      toast.error(
        "Không thể thay đổi trạng thái quy tắc thưởng. Vui lòng thử lại.",
      );
    } finally {
      setToggleLoading(false);
    }
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
                          : (item.pointsPerKg ?? "Không có")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {typeof item.bonusQualityPoints === "number"
                          ? item.bonusQualityPoints
                          : (item.bonusQualityPoints ?? "Không có")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {typeof item.bonusFastCompletePoints === "number"
                          ? item.bonusFastCompletePoints
                          : (item.bonusFastCompletePoints ?? "Không có")}
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
                          : (item.priority ?? "Không có")}
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
                        {item.active ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {item.active === false ? (
                          <button
                            onClick={() => handleToggle(item)}
                            className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-green-100 shrink-0"
                            title="Khôi phục"
                          >
                            <FaArrowsRotate className="text-sm text-green-600" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggle(item)}
                            className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-gray-100 shrink-0"
                            title="Tạm dừng"
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

      <ModalConfirm
        isOpen={isModalToggleOpen}
        onClose={handleCloseToggleModal}
        onConfirm={handleConfirmToggle}
        title={
          selectedItem?.active === false
            ? "Xác nhận bật lại quy tắc thưởng"
            : "Xác nhận tạm dừng quy tắc thưởng"
        }
        message={
          selectedItem
            ? selectedItem.active === false
              ? `Bạn có chắc muốn bật lại quy tắc thưởng cho "${getCategoryName(selectedItem.wasteCategoryId)}"?`
              : `Bạn có chắc muốn tạm dừng quy tắc thưởng cho "${getCategoryName(selectedItem.wasteCategoryId)}"?`
            : ""
        }
        confirmText={selectedItem?.active === false ? "Khôi phục" : "Tạm dừng"}
        isLoading={toggleLoading}
      />
    </>
  );
};

export default RewardRuleList;
