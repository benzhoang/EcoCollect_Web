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
  { value: "OPEN", label: "Đang mở" },
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

const ComplaintList = ({
  filterType = "",
  filterStatus = "",
  searchTerm = "",
  // onViewDetail,
  complaintTypes = {},
  statusMap = {},
}) => {
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
      } catch (err) {
        setLoadError(err?.message ?? "Không tải được danh sách khiếu nại.");
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
  return (
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
              <th className="w-40 px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase whitespace-nowrap">
                THAO TÁC
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Đang tải...
                </td>
              </tr>
            ) : loadError ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-red-600">
                  {loadError}
                </td>
              </tr>
            ) : complaints.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
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
                      {complaintTypes[c.category] ??
                        CATEGORY_OPTIONS.find((o) => o.value === c.category)
                          ?.label ??
                        c.category ??
                        "—"}
                    </span>
                  </td>
                  <td className="max-w-xs px-6 py-4">
                    <span className="text-sm text-gray-700 line-clamp-2">
                      {c.description ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        statusMap[c.status]?.color ||
                        STATUS_STYLES[c.status] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusMap[c.status]?.label ??
                        STATUS_OPTIONS.find((o) => o.value === c.status)
                          ?.label ??
                        c.status ??
                        "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {formatDate(c.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {c.resolvedAt ? formatDate(c.resolvedAt) : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenUpdate(c)}
                        className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-yellow-50 shrink-0"
                        title="Cập nhật trạng thái"
                      >
                        <FaEdit className="text-sm text-yellow-600" />
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
  );
};

export default ComplaintList;
