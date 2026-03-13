import React, { useState, useEffect, useCallback } from "react";
import { FaSearch, FaEye } from "react-icons/fa";
import { getCollectorAssignments, getWasteCategories } from "../../service/api";
import CollectorPagination from "../../components/CollectorComponent/CollectorPagination";

const PAGE_SIZE = 5;

const mapStatusToLabel = (status) => {
  const s = status ? String(status).toUpperCase() : "";
  switch (s) {
    case "ASSIGNED":
      return "Đã giao";
    case "ON_THE_WAY":
      return "Đang trên đường";
    case "COLLECTED":
      return "Đã thu gom";
    default:
      return status || "Không rõ";
  }
};

const mapStatusToBadgeClass = (status) => {
  const s = status ? String(status).toUpperCase() : "";
  switch (s) {
    case "ASSIGNED":
      return "bg-blue-100 text-blue-800";
    case "ON_THE_WAY":
      return "bg-orange-100 text-orange-800";
    case "COLLECTED":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/** Map assignment từ API sang row hiển thị (giống RequestList: STT, Vĩ độ, Kinh độ; thêm collectedAt cho lịch sử) */
const mapAssignmentToRow = (item, categoryMap = {}) => {
  const report = item.report || {};
  const id = item.reportId ?? item.assignmentId ?? report.id ?? item.id;
  const assignmentId = item.assignmentId ?? item.id;
  const wasteCategoryId = item.wasteCategoryId ?? report.wasteCategoryId;
  const code = report.code ?? item.code ?? "-";
  const address =
    item.addressText ??
    report.addressText ??
    report.address ??
    item.address ??
    "-";
  const wasteType =
    categoryMap[wasteCategoryId] ??
    item.wasteCategoryName ??
    report.wasteCategoryName ??
    item.wasteType ??
    "-";
  const assignedAt = item.assignedAt ?? report.assignedAt ?? "-";
  const collectedAt = item.collectedAt ?? item.completedAt ?? assignedAt;
  const status = item.currentStatus ?? item.status ?? report.status ?? "-";
  const latitude = item.latitude ?? report.latitude ?? "-";
  const longitude = item.longitude ?? report.longitude ?? "-";

  return {
    id,
    assignmentId,
    code,
    address,
    wasteType,
    assignedAt,
    collectedAt,
    status,
    statusColor: mapStatusToBadgeClass(status),
    latitude,
    longitude,
  };
};

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [categoryMap, setCategoryMap] = useState({});
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: PAGE_SIZE,
    totalElements: 0,
    totalPages: 1,
  });

  const fetchAssignments = useCallback(
    async (pageIndex = 0) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCollectorAssignments({
          status: "COLLECTED",
          page: pageIndex,
          size: PAGE_SIZE,
          sort: ["assignedAt,desc"],
        });
        const pageData = response?.data ?? response;
        const content =
          pageData?.content ?? (Array.isArray(pageData) ? pageData : []);
        const mapped = content.map((item) =>
          mapAssignmentToRow(item, categoryMap),
        );
        setList(mapped);
        setPageInfo({
          page: pageData?.number ?? pageData?.page ?? pageIndex,
          size: pageData?.size ?? PAGE_SIZE,
          totalElements: pageData?.totalElements ?? mapped.length,
          totalPages: pageData?.totalPages ?? 1,
        });
      } catch (err) {
        setError(err?.message ?? "Không thể tải lịch sử công việc.");
        setList([]);
        setPageInfo((prev) => ({ ...prev, totalElements: 0, totalPages: 1 }));
      } finally {
        setLoading(false);
      }
    },
    [categoryMap],
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getWasteCategories();
        const categories = response?.data ?? response ?? [];
        if (Array.isArray(categories)) {
          const nextMap = {};
          categories.forEach((cat) => {
            if (cat?.id) {
              nextMap[cat.id] = cat.name ?? cat.displayName ?? "-";
            }
          });
          setCategoryMap(nextMap);
        }
      } catch (err) {
        console.error("Không thể tải danh mục loại rác:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchAssignments(page);
  }, [page, fetchAssignments]);

  const handlePageChange = (nextPage) => {
    setPage(Math.max(0, nextPage - 1));
  };

  const filteredList = list.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.code && item.code.toLowerCase().includes(q)) ||
      (item.wasteType && item.wasteType.toLowerCase().includes(q)) ||
      (item.address && item.address.toLowerCase().includes(q))
    );
  });

  const displayList = filteredList;

  return (
    <div className="flex flex-col w-full h-full min-h-0 gap-6">
      <header className="flex flex-wrap items-center justify-between w-full gap-4 px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-black">Lịch sử công việc</h1>
          <p className="text-sm text-gray-600">
            Danh sách các yêu cầu thu gom đã hoàn thành (trạng thái Đã thu gom)
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo mã, loại rác hoặc địa chỉ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-4 pr-10 text-black placeholder-gray-400 bg-white border border-gray-300 rounded-lg min-w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <FaSearch className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-auto">
        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    STT
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Thời gian thu gom
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Loại rác
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Vĩ độ
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Kinh độ
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Trạng thái xử lý
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Địa điểm
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      Đang tải...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-red-600"
                    >
                      {error}
                    </td>
                  </tr>
                ) : displayList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-sm text-center text-gray-500"
                    >
                      Chưa có lịch sử công việc (yêu cầu đã thu gom)
                    </td>
                  </tr>
                ) : (
                  displayList.map((item, index) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-gray-50/80"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {page * PAGE_SIZE + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.collectedAt}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-700 bg-blue-100">
                          {item.wasteType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {item.latitude}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {item.longitude}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${item.statusColor}`}
                        >
                          {mapStatusToLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 min-w-[180px] max-w-[320px] break-words">
                        {item.address}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/collector/request-list/${item.id}`}
                          data-state={
                            item.assignmentId
                              ? JSON.stringify({
                                  assignmentId: item.assignmentId,
                                })
                              : undefined
                          }
                          className="inline-flex items-center justify-center w-9 h-9 transition-colors border border-gray-300 rounded-lg no-underline hover:bg-blue-50 shrink-0"
                          title="Xem chi tiết"
                        >
                          <FaEye className="text-blue-600 text-sm" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && !error && list.length > 0 && (
            <CollectorPagination
              pageInfo={pageInfo}
              currentPage={page + 1}
              onPageChange={handlePageChange}
              itemCount={list.length}
              itemLabel="yêu cầu"
            />
          )}
        </div>

        {!loading && !error && displayList.length === 0 && list.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="font-medium text-gray-600">
              Chưa có lịch sử công việc
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Các yêu cầu đã thu gom sẽ hiển thị tại đây.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
