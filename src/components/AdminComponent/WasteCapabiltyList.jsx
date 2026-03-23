import React, { useState, useEffect, useMemo } from "react";
import { FaPause } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  getAdminWasteCapabilities,
  toggleAdminWasteCapability,
} from "../../service/api";
import ModalConfirm from "./Modal/ModalConfirm";
import AdminPagination from "./AdminPagination";
import { FaArrowsRotate } from "react-icons/fa6";

const PAGE_SIZE = 5;

const WasteCapabilityList = ({ searchTerm = "", refreshToken = 0 }) => {
  const [isModalToggleOpen, setIsModalToggleOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(false);
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
      } catch {
        setError("Không thể tải danh sách công suất.");
        setCapabilities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCapabilities();
  }, [refreshToken]);

  const filteredList = searchTerm
    ? capabilities.filter((item) => {
        const name = item.wasteCategoryName ?? item.wasteType ?? "";
        const code = item.wasteCategoryCode ?? item.wasteTypeId ?? "";
        const term = searchTerm.toLowerCase();
        return (
          name.toString().toLowerCase().includes(term) ||
          code.toString().toLowerCase().includes(term)
        );
      })
    : capabilities;

  const [page, setPage] = useState(0);
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

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

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
    if (!selectedItem?.wasteCategoryId) return;
    setToggleLoading(true);
    try {
      await toggleAdminWasteCapability(selectedItem.wasteCategoryId);
      setCapabilities((prev) =>
        prev.map((c) =>
          c.id === selectedItem.id
            ? { ...c, accepting: !(c.accepting ?? false) }
            : c,
        ),
      );
      handleCloseToggleModal();
      const isRestore = selectedItem.accepting === false;
      toast.success(
        isRestore ? "Đã khôi phục tiếp nhận" : "Đã tạm dừng tiếp nhận",
      );
    } catch {
      toast.error("Không thể thay đổi trạng thái tiếp nhận. Vui lòng thử lại.");
    } finally {
      setToggleLoading(false);
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
                        {item.wasteCategoryCode ??
                          item.wasteTypeId ??
                          "Không có"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {item.wasteCategoryName ?? item.wasteType ?? "Không có"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {(() => {
                          const cap =
                            item.dailyCapacityKg ?? item.capacityPerDay;
                          return typeof cap === "number"
                            ? `${cap} kg`
                            : (cap ?? "Không có");
                        })()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          (item.accepting ?? item.status) === true
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {(item.accepting ?? item.status) === true
                          ? "Có"
                          : "Không"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {item.accepting === false ? (
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
                            title="Tạm dừng tiếp nhận"
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
            itemLabel="công suất"
          />
        )}
      </div>

      <ModalConfirm
        isOpen={isModalToggleOpen}
        onClose={handleCloseToggleModal}
        onConfirm={handleConfirmToggle}
        title={
          selectedItem?.accepting === false
            ? "Xác nhận khôi phục lại"
            : "Xác nhận tạm dừng tiếp nhận"
        }
        message={
          selectedItem
            ? selectedItem.accepting === false
              ? `Bạn có chắc muốn khôi phục tiếp nhận của loại rác "${selectedItem.wasteCategoryName ?? selectedItem.wasteType ?? selectedItem.wasteCategoryCode ?? "này"}"?`
              : `Bạn có chắc muốn tạm dừng tiếp nhận của loại rác "${selectedItem.wasteCategoryName ?? selectedItem.wasteType ?? selectedItem.wasteCategoryCode ?? "này"}"?`
            : ""
        }
        confirmText={
          selectedItem?.accepting === false ? "Khôi phục" : "Tạm dừng"
        }
        isLoading={toggleLoading}
      />
    </>
  );
};

export default WasteCapabilityList;
