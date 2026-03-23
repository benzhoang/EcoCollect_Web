import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaEye } from "react-icons/fa";
import { getCollectorAssignments, getWasteCategories } from "../../service/api";
import CollectorPagination from "./CollectorPagination";
import toast from "react-hot-toast";

const PAGE_SIZE = 5;

const formatDate = (iso) => {
  if (iso == null || iso === "" || iso === "-") return iso ?? "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

/** Trạng thái cho Collector: ASSIGNED, ON_THE_WAY, COLLECTED (hiển thị Đã thu gom) */
const mapStatusToLabel = (status) => {
  const s = status ? String(status).toUpperCase() : "";
  switch (s) {
    case "ASSIGNED":
      return "Đã phân công";
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

/** Map item từ API (content[]) sang row hiển thị */
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
    status,
    statusColor: mapStatusToBadgeClass(status),
    latitude,
    longitude,
  };
};

/** Chỉ hiển thị assignment có status ASSIGNED hoặc ON_THE_WAY */
const ALLOWED_STATUSES = ["ASSIGNED", "ON_THE_WAY"];

const isAllowedStatus = (item) => {
  const s = (item.currentStatus ?? item.status ?? item.report?.status ?? "")
    .toString()
    .toUpperCase();
  return ALLOWED_STATUSES.includes(s);
};

const FILTER_TABS = ["Tất cả", "Đã phân công", "Đang trên đường"];

/** Tab label → status API (null = không lọc theo status, chỉ giữ ASSIGNED + ON_THE_WAY) */
const TAB_TO_STATUS = {
  "Tất cả": null,
  "Đã phân công": "ASSIGNED",
  "Đang trên đường": "ON_THE_WAY",
};

/**
 * Danh sách yêu cầu thu gom (bảng). Chỉ hiển thị trạng thái Đã giao và Đang trên đường.
 * Gọi API getCollectorAssignments khi không truyền requests.
 * @param {{ requests?: Array }} props - requests: dữ liệu tĩnh (không gọi API)
 */
const RequestList = ({ requests: requestsProp }) => {
  const useApi = requestsProp === undefined;

  const [list, setList] = useState(requestsProp ?? []);
  const [loading, setLoading] = useState(useApi);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [categoryMap, setCategoryMap] = useState({});
  /** Cache map loại rác — tránh gọi lại API khi đổi trang; dùng chung khi fetch song song với assignments */
  const categoryMapRef = useRef({});
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: PAGE_SIZE,
    totalElements: 0,
    totalPages: 1,
  });
  const [activeTab, setActiveTab] = useState("Tất cả");

  const fetchAssignments = useCallback(
    async (pageIndex = 0) => {
      setLoading(true);
      setError(null);
      try {
        const apiStatus = TAB_TO_STATUS[activeTab];

        const loadCategoriesIfNeeded = async () => {
          if (Object.keys(categoryMapRef.current).length > 0) {
            return categoryMapRef.current;
          }
          try {
            const response = await getWasteCategories();
            const categories = response?.data ?? response ?? [];
            const nextMap = {};
            if (Array.isArray(categories)) {
              categories.forEach((cat) => {
                if (cat?.id) {
                  nextMap[cat.id] = cat.name ?? cat.displayName ?? "-";
                }
              });
            }
            categoryMapRef.current = nextMap;
            setCategoryMap(nextMap);
            return nextMap;
          } catch {
            toast.error("Không thể tải danh mục loại rác");
            return categoryMapRef.current;
          }
        };

        const [response, map] = await Promise.all([
          getCollectorAssignments({
            ...(apiStatus ? { status: apiStatus } : {}),
            page: pageIndex,
            size: PAGE_SIZE,
            sort: ["assignedAt,desc"],
          }),
          loadCategoriesIfNeeded(),
        ]);

        const pageData = response?.data ?? response;
        const content =
          pageData?.content ?? (Array.isArray(pageData) ? pageData : []);
        const filtered = apiStatus ? content : content.filter(isAllowedStatus);
        const mapped = filtered.map((item) => mapAssignmentToRow(item, map));

        setList(mapped);
        setPageInfo({
          page: pageData?.number ?? pageData?.page ?? pageIndex,
          size: pageData?.size ?? PAGE_SIZE,
          totalElements: pageData?.totalElements ?? mapped.length,
          totalPages: pageData?.totalPages ?? 1,
        });
      } catch {
        setError("Không thể tải danh sách phân công");
        setList([]);
        setPageInfo((prev) => ({ ...prev, totalElements: 0, totalPages: 1 }));
      } finally {
        setLoading(false);
      }
    },
    [activeTab],
  );

  /** Chế độ dữ liệu tĩnh: vẫn cần danh mục để map tên loại rác */
  useEffect(() => {
    if (useApi) return;
    if (Object.keys(categoryMapRef.current).length > 0) return;
    (async () => {
      try {
        const response = await getWasteCategories();
        const categories = response?.data ?? response ?? [];
        const nextMap = {};
        if (Array.isArray(categories)) {
          categories.forEach((cat) => {
            if (cat?.id) {
              nextMap[cat.id] = cat.name ?? cat.displayName ?? "Không có";
            }
          });
        }
        categoryMapRef.current = nextMap;
        setCategoryMap(nextMap);
      } catch {
        toast.error("Không thể tải danh mục loại rác");
      }
    })();
  }, [useApi]);

  useEffect(() => {
    if (useApi) {
      fetchAssignments(page);
    } else {
      setList(requestsProp ?? []);
      setLoading(false);
      setError(null);
    }
  }, [useApi, page, fetchAssignments, requestsProp]);

  useEffect(() => {
    setPage(0);
  }, [activeTab]);

  const handlePageChange = (nextPage) => {
    setPage(Math.max(0, nextPage - 1));
  };

  const filterRowsByTab = (rows) => {
    if (!Array.isArray(rows)) return [];
    const statusFilter = TAB_TO_STATUS[activeTab];
    if (!statusFilter) {
      return rows.filter((r) =>
        ALLOWED_STATUSES.includes(String(r.status || "").toUpperCase()),
      );
    }
    return rows.filter(
      (r) => String(r.status || "").toUpperCase() === statusFilter,
    );
  };

  const displayList = useApi
    ? list
    : filterRowsByTab(
        (requestsProp ?? []).map((item) =>
          mapAssignmentToRow(item, categoryMap),
        ),
      );

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Khu vực bảng — flex-1 để chia sẻ với sidebar phải (giống Enterprise) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === tab
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    STT
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Thời gian gán
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Loại rác
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Trạng thái
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
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      Đang tải...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-red-600"
                    >
                      {error}
                    </td>
                  </tr>
                ) : !loading && !error && displayList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-sm text-center text-gray-500"
                    >
                      Chưa có yêu cầu thu gom nào
                    </td>
                  </tr>
                ) : (
                  displayList.map((request, index) => (
                    <tr
                      key={request.id}
                      className="transition-colors hover:bg-gray-50/80"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {useApi ? page * PAGE_SIZE + index + 1 : index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDate(request.assignedAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                          {request.wasteType || "Không có"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${mapStatusToBadgeClass(request.status)}`}
                        >
                          {mapStatusToLabel(request.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 min-w-[180px] max-w-[320px] break-words">
                        {request.address || "Không có"}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/collector/request-list/${request.id}`}
                          data-state={
                            request.assignmentId
                              ? JSON.stringify({
                                  assignmentId: request.assignmentId,
                                })
                              : undefined
                          }
                          className="inline-flex items-center justify-center no-underline transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-blue-50 shrink-0"
                          title="Xem chi tiết"
                        >
                          <FaEye className="text-sm text-blue-600" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {useApi && !loading && !error && (
            <CollectorPagination
              pageInfo={pageInfo}
              currentPage={page + 1}
              onPageChange={handlePageChange}
              itemCount={list.length}
              itemLabel="yêu cầu"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestList;
