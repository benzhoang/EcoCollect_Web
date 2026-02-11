import React from "react";
import { FaEye } from "react-icons/fa";

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
  complaints = [],
  onViewDetail,
  complaintTypes = {},
  sources = {},
  statusMap = {},
}) => {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                STT
              </th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                NGUỒN
              </th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                LOẠI KHIẾU NẠI
              </th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                NGƯỜI KHIẾU NẠI
              </th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                TRẠNG THÁI
              </th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                NGÀY TẠO
              </th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase w-40">
                THAO TÁC
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {complaints.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
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
                      {sources[c.source]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {complaintTypes[c.type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {c.complainantName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        statusMap[c.status]?.color ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusMap[c.status]?.label || c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">
                      {formatDate(c.createdAt)}
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
