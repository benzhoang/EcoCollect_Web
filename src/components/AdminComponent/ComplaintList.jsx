import React, { useState, useMemo, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { getComplaints } from "../../service/api";

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
  onViewDetail,
  complaintTypes = {},
  statusMap = {},
}) => {
  const [complaintsRaw, setComplaintsRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await getComplaints({
          category: filterType || undefined,
          status: filterStatus || undefined,
        });
        if (cancelled) return;
        const list = res?.data?.content ?? [];
        setComplaintsRaw(Array.isArray(list) ? list : []);
      } catch (err) {
        if (!cancelled)
          setLoadError(err?.message ?? "Không tải được danh sách khiếu nại.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [filterType, filterStatus]);

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
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase w-40 whitespace-nowrap">
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
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {complaintTypes[c.category] ?? c.category ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <span className="text-sm text-gray-700 line-clamp-2">
                      {c.description ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        statusMap[c.status]?.color ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusMap[c.status]?.label ?? c.status ?? "—"}
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
                        onClick={() => onViewDetail?.(c.id)}
                        className="flex items-center justify-center w-9 h-9 transition-colors border border-gray-300 rounded-lg hover:bg-blue-50 shrink-0"
                        title="Xem chi tiết"
                      >
                        <FaEye className="text-blue-600 text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintList;
