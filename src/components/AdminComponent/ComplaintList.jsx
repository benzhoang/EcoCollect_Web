import React, { useState, useMemo, useEffect, useCallback } from "react";
import { FaEdit } from "react-icons/fa";
import { getComplaints } from "../../service/api";
import AdminPagination from "./AdminPagination";
import UpdateComplaintStatusModal from "./Modal/UpdateComplaintStatusModal";

const PAGE_SIZE = 5;

const CATEGORY_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "MISSED_PICKUP", label: "Bỏ sót thu gom" },
  { value: "WRONG_WASTE_TYPE", label: "Sai loại rác" },
  { value: "INVALID_PROOF", label: "Bằng chứng không hợp lệ" },
  { value: "POINTS_WRONG", label: "Điểm thưởng sai" },
  { value: "OTHER", label: "Khác" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "IN_REVIEW", label: "Đang xem xét" },
  { value: "RESOLVED", label: "Đã giải quyết" },
  { value: "REJECTED", label: "Từ chối" },
];

const STATUS_STYLES = {
  OPEN: "bg-orange-100 text-orange-700",
  IN_REVIEW: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ComplaintList = ({ searchTerm = "" }) => {
  // Filters (theo params Swagger: category + status)
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [complaintsRaw, setComplaintsRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: PAGE_SIZE,
    totalElements: 0,
    totalPages: 1,
  });

  const load = useCallback(
    async (pageIndex = 0) => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await getComplaints({
          category: filterType || undefined,
          status: filterStatus || undefined,
          page: pageIndex,
          size: PAGE_SIZE,
        });
        const data = res?.data ?? res;
        const list = data?.content ?? (Array.isArray(data) ? data : []);
        setComplaintsRaw(Array.isArray(list) ? list : []);
        setPageInfo({
          page: data?.number ?? data?.page ?? pageIndex,
          size: data?.size ?? PAGE_SIZE,
          totalElements: data?.totalElements ?? 0,
          totalPages: data?.totalPages ?? 1,
        });
      } catch {
        setLoadError("Không tải được danh sách khiếu nại");
        setComplaintsRaw([]);
        setPageInfo((prev) => ({ ...prev, totalElements: 0, totalPages: 1 }));
      } finally {
        setLoading(false);
      }
    },
    [filterType, filterStatus],
  );

  useEffect(() => {
    load(page);
  }, [page, load]);

  useEffect(() => {
    setPage(0);
  }, [filterType, filterStatus]);

  const handlePageChange = (nextPage) => {
    setPage(Math.max(0, nextPage - 1));
  };

  const handleOpenUpdate = (complaint) => {
    setSelectedComplaint(complaint);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdate = () => {
    setIsUpdateModalOpen(false);
    setSelectedComplaint(null);
  };

  const complaints = useMemo(() => {
    let list = [...complaintsRaw];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (c) =>
          (c.description && c.description.toLowerCase().includes(q)) ||
          (c.category && c.category.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [complaintsRaw, searchTerm]);

  const isResolvedOrRejected = (status) =>
    ["RESOLVED", "REJECTED"].includes(String(status || "").toUpperCase());

  // Chỉ hiện cột THAO TÁC nếu trong trang hiện tại còn dòng có thể cập nhật
  const showActionsColumn = complaints.some(
    (c) => !isResolvedOrRejected(c.status),
  );
  const tableColCount = showActionsColumn ? 8 : 7;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Loại khiếu nại
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-2 pl-3 pr-8 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Trạng thái
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-2 pl-3 pr-8 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase whitespace-nowrap">
                  STT
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase whitespace-nowrap">
                  LOẠI KHIẾU NẠI
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase whitespace-nowrap">
                  MÔ TẢ
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase whitespace-nowrap">
                  TRẠNG THÁI
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase whitespace-nowrap">
                  NGÀY TẠO
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase whitespace-nowrap">
                  NGÀY XỬ LÝ
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase whitespace-nowrap">
                  GHI CHÚ XỬ LÝ
                </th>
                {showActionsColumn && (
                  <th className="w-40 px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase whitespace-nowrap">
                    THAO TÁC
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={tableColCount}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td
                    colSpan={tableColCount}
                    className="px-6 py-12 text-center text-red-600"
                  >
                    {loadError}
                  </td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableColCount}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Không có khiếu nại nào phù hợp.
                  </td>
                </tr>
              ) : (
                complaints.map((c, i) => (
                  <tr key={c.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {page * PAGE_SIZE + i + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {CATEGORY_OPTIONS.find((o) => o.value === c.category)
                          ?.label ??
                          c.category ??
                          "Không có"}
                      </span>
                    </td>
                    <td className="max-w-xs px-6 py-4">
                      <span className="text-sm text-gray-700 line-clamp-2">
                        {c.description ?? "Không có"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          STATUS_STYLES[c.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {STATUS_OPTIONS.find((o) => o.value === c.status)
                          ?.label ??
                          c.status ??
                          "Không có"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {formatDate(c.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">
                        {c.resolvedAt ? formatDate(c.resolvedAt) : "Không có"}
                      </span>
                    </td>
                    <td className="max-w-xs px-6 py-4">
                      <span
                        className="text-sm text-gray-700 line-clamp-2"
                        title={c.resolutionNote ?? ""}
                      >
                        {c.resolutionNote ?? "Không có"}
                      </span>
                    </td>
                    {showActionsColumn && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          {!isResolvedOrRejected(c.status) && (
                            <button
                              type="button"
                              onClick={() => handleOpenUpdate(c)}
                              className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-yellow-50 shrink-0"
                              title="Cập nhật trạng thái"
                            >
                              <FaEdit className="text-sm text-yellow-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
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
            itemCount={complaints.length}
            itemLabel="khiếu nại"
          />
        )}
        <UpdateComplaintStatusModal
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdate}
          complaintId={selectedComplaint?.id}
          initialStatus={selectedComplaint?.status}
          initialResolutionNote={selectedComplaint?.resolutionNote}
          onSuccess={() => load(page)}
        />
      </div>
    </div>
  );
};

export default ComplaintList;
