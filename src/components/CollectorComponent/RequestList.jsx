import React, { useState, useEffect, useCallback } from "react";
import { FaEye } from "react-icons/fa";
import { getCollectorAssignments, getWasteCategories } from "../../service/api";
import CollectorPagination from "./CollectorPagination";

// Dữ liệu mẫu danh sách yêu cầu thu gom đã được doanh nghiệp gán cho Collector
// export const MOCK_REQUESTS = [
//   {
//     id: 1,
//     code: "YC-2024-001",
//     image:
//       "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
//     wasteType: "Nhựa (PET)",
//     wasteTypeColor: "bg-blue-100 text-blue-700",
//     estimatedWeight: "~15 kg",
//     address: "234 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
//     assignedAt: "31/01/2025 - 08:00",
//     status: "Đang trên đường",
//     statusColor: "bg-amber-100 text-amber-700",
//     coordinates: { lat: 10.8031, lng: 106.7147 },
//   },
//   {
//     id: 2,
//     code: "YC-2024-002",
//     image:
//       "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
//     wasteType: "Rác điện tử",
//     wasteTypeColor: "bg-orange-100 text-orange-700",
//     estimatedWeight: "~8 kg",
//     address: "56 Võ Văn Tần, Quận 3, TP.HCM",
//     assignedAt: "31/01/2025 - 07:30",
//     status: "Đang trên đường",
//     statusColor: "bg-amber-100 text-amber-700",
//     coordinates: { lat: 10.782, lng: 106.6872 },
//   },
//   {
//     id: 3,
//     code: "YC-2024-003",
//     image:
//       "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
//     wasteType: "Giấy / Carton",
//     wasteTypeColor: "bg-amber-100 text-amber-700",
//     estimatedWeight: "~25 kg",
//     address: "12 Pasteur, Quận 3, TP.HCM",
//     assignedAt: "30/01/2025 - 16:00",
//     status: "Đang trên đường",
//     statusColor: "bg-amber-100 text-amber-700",
//     coordinates: { lat: 10.7822, lng: 106.695 },
//   },
//   {
//     id: 4,
//     code: "YC-2024-004",
//     image:
//       "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
//     wasteType: "Kim loại",
//     wasteTypeColor: "bg-gray-100 text-gray-700",
//     estimatedWeight: "~12 kg",
//     address: "78 Trần Hưng Đạo, Quận 5, TP.HCM",
//     assignedAt: "30/01/2025 - 14:20",
//     status: "Đang trên đường",
//     statusColor: "bg-amber-100 text-amber-700",
//     coordinates: { lat: 10.7562, lng: 106.6774 },
//   },
//   {
//     id: 5,
//     code: "YC-2024-005",
//     image:
//       "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
//     wasteType: "Nhựa (PET)",
//     wasteTypeColor: "bg-blue-100 text-blue-700",
//     estimatedWeight: "~20 kg",
//     address: "90 Lê Lợi, Quận 1, TP.HCM",
//     assignedAt: "01/02/2025 - 09:00",
//     status: "Đã gán",
//     statusColor: "bg-green-100 text-green-700",
//     coordinates: { lat: 10.7769, lng: 106.7009 },
//   },
//   {
//     id: 6,
//     code: "YC-2024-006",
//     image:
//       "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
//     wasteType: "Giấy / Carton",
//     wasteTypeColor: "bg-amber-100 text-amber-700",
//     estimatedWeight: "~18 kg",
//     address: "15 Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
//     assignedAt: "01/02/2025 - 10:30",
//     status: "Đã gán",
//     statusColor: "bg-green-100 text-green-700",
//     coordinates: { lat: 10.7822, lng: 106.6884 },
//   },
// ];

const PAGE_SIZE = 5;

const getWasteTypeColor = (wasteType) => {
  if (!wasteType) return "bg-gray-100 text-gray-700";
  const t = String(wasteType).toLowerCase();
  if (t.includes("nhựa") || t.includes("pet"))
    return "bg-blue-100 text-blue-700";
  if (t.includes("điện tử")) return "bg-orange-100 text-orange-700";
  if (t.includes("giấy") || t.includes("carton"))
    return "bg-amber-100 text-amber-700";
  if (t.includes("kim loại")) return "bg-gray-100 text-gray-700";
  return "bg-gray-100 text-gray-700";
};

const getStatusColor = (status) => {
  if (!status) return "bg-gray-100 text-gray-700";
  const s = String(status).toLowerCase();
  if (s.includes("đã gán")) return "bg-green-100 text-green-700";
  if (s.includes("đang trên đường") || s.includes("đang thực hiện"))
    return "bg-amber-100 text-amber-700";
  if (s.includes("hoàn thành")) return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-700";
};

/** Map item từ API (content[]) sang row hiển thị */
const mapAssignmentToRow = (item, categoryMap = {}) => {
  const report = item.report || {};
  const id = item.reportId ?? item.assignmentId ?? report.id ?? item.id;
  const wasteCategoryId = item.wasteCategoryId ?? report.wasteCategoryId;
  const code = report.code ?? item.code ?? "-";
  const address =
    item.addressText ?? report.addressText ?? report.address ?? item.address ?? "-";
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
    code,
    address,
    wasteType,
    wasteTypeColor: item.wasteTypeColor ?? getWasteTypeColor(wasteType),
    assignedAt,
    status,
    statusColor: item.statusColor ?? getStatusColor(status),
    latitude,
    longitude,
  };
};

/**
 * Danh sách yêu cầu thu gom (bảng). Gọi API getCollectorAssignments khi không truyền requests.
 * @param {{ requests?: Array, status?: string }} props - requests: dữ liệu tĩnh (không gọi API); status: lọc API
 */
const RequestList = ({ requests: requestsProp, status }) => {
  const useApi = requestsProp === undefined;

  const [list, setList] = useState(requestsProp ?? []);
  const [loading, setLoading] = useState(useApi);
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
          status: status || undefined,
          page: pageIndex,
          size: PAGE_SIZE,
          sort: ["assignedAt,desc"],
        });

        // API có thể trả trực tiếp page object hoặc bọc trong response.data
        const pageData = response?.data ?? response;
        const content = pageData?.content ?? (Array.isArray(pageData) ? pageData : []);
        const mapped = content.map((item) => mapAssignmentToRow(item, categoryMap));

        setList(mapped);
        setPageInfo({
          page: pageData?.number ?? pageData?.page ?? pageIndex,
          size: pageData?.size ?? PAGE_SIZE,
          totalElements: pageData?.totalElements ?? mapped.length,
          totalPages: pageData?.totalPages ?? 1,
        });
      } catch (err) {
        setError(err?.message ?? "Không thể tải danh sách phân công.");
        setList([]);
        setPageInfo((prev) => ({ ...prev, totalElements: 0, totalPages: 1 }));
      } finally {
        setLoading(false);
      }
    },
    [status, categoryMap],
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
    if (useApi) {
      fetchAssignments(page);
    } else {
      setList(requestsProp ?? []);
      setLoading(false);
      setError(null);
    }
  }, [useApi, page, fetchAssignments, requestsProp]);

  const handlePageChange = (nextPage) => {
    setPage(Math.max(0, nextPage - 1));
  };

  const displayList = useApi ? list : (requestsProp ?? list);

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-6">
      <div className="flex-1 min-h-0 overflow-auto flex flex-col">
        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl flex-1 min-h-0 flex flex-col">
          <div className="overflow-x-auto flex-1 min-h-0">
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
                    Vĩ độ
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Kinh độ
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
                ) : !loading && !error && displayList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-4 text-center text-sm text-gray-500"
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
                        {page * PAGE_SIZE + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {request.assignedAt}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${request.wasteTypeColor}`}
                        >
                          {request.wasteType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {request.latitude}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {request.longitude}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${request.statusColor}`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 min-w-[180px] max-w-[320px] break-words">
                        {request.address}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/collector/request-list/${request.id}`}
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

          {useApi && !loading && !error && (
            <CollectorPagination
              pageInfo={pageInfo}
              currentPage={page + 1}
              onPageChange={handlePageChange}
              itemCount={list.length}
              itemLabel="yêu cầu"
              emptyMessage={
                displayList.length === 0
                  ? `Hiển thị ${list.length} yêu cầu`
                  : undefined
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestList;
