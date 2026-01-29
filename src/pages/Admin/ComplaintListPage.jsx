import React, { useState, useMemo } from "react";
import { FaSearch, FaEye, FaBullhorn, FaBell } from "react-icons/fa";

const COMPLAINT_TYPES = {
  wrong_waste: "Thu gom không đúng loại rác",
  no_collection: "Không đến thu gom dù đã Accepted",
  invalid_image: "Hình ảnh xác nhận không hợp lệ",
  wrong_points: "Điểm thưởng bị cộng sai",
};

const SOURCES = {
  citizen: "Dân cư",
  collector: "Người thu gom",
  enterprise: "Doanh nghiệp tái chế",
};

const STATUS_MAP = {
  new: { label: "Mới", color: "bg-amber-100 text-amber-800" },
  verifying: { label: "Đang xác minh", color: "bg-blue-100 text-blue-800" },
  resolved_accepted: {
    label: "Chấp nhận - Yêu cầu thu gom lại",
    color: "bg-green-100 text-green-800",
  },
  resolved_rejected: { label: "Từ chối", color: "bg-red-100 text-red-800" },
  resolved_adjusted: {
    label: "Đã điều chỉnh điểm",
    color: "bg-emerald-100 text-emerald-800",
  },
  resolved_warning: {
    label: "Đã gắn cảnh báo",
    color: "bg-orange-100 text-orange-800",
  },
};

const MOCK_COMPLAINTS = [
  {
    id: "KN-001",
    source: "citizen",
    type: "wrong_waste",
    status: "new",
    complainantName: "Nguyễn Văn A",
    complainantContact: "nguyenvana@email.com",
    respondentName: "Công ty Thu gom Xanh",
    respondentRole: "enterprise",
    createdAt: "2025-01-28T08:30:00",
    description:
      "Đăng ký thu gom rác tái chế nhưng xe đến thu luôn cả rác hữu cơ, trộn lẫn. Yêu cầu thu gom lại đúng loại.",
    images: [
      "https://picsum.photos/400/300?random=1",
      "https://picsum.photos/400/300?random=2",
    ],
    gps: {
      lat: 10.8231,
      lng: 106.6297,
      address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    },
    reportId: "BC-2025-0042",
    statusHistory: [
      {
        status: "new",
        at: "2025-01-28T08:30:00",
        note: "Khiếu nại được gửi.",
        admin: null,
      },
    ],
    logs: [
      { at: "2025-01-28T08:30:00", action: "Tạo khiếu nại", by: "Hệ thống" },
    ],
  },
  {
    id: "KN-002",
    source: "collector",
    type: "no_collection",
    status: "verifying",
    complainantName: "Trần Thị B",
    complainantContact: "tranthib@email.com",
    respondentName: "Đội thu gom Q.3",
    respondentRole: "collector",
    createdAt: "2025-01-27T14:20:00",
    description:
      "Đã Accept lịch thu gom 27/01 nhưng không ai đến. Chờ cả buổi chiều.",
    images: [],
    gps: { lat: 10.7826, lng: 106.6821, address: "45 Lê Lợi, Q.3, TP.HCM" },
    reportId: "BC-2025-0038",
    statusHistory: [
      {
        status: "new",
        at: "2025-01-27T14:20:00",
        note: "Khiếu nại được gửi.",
        admin: null,
      },
      {
        status: "verifying",
        at: "2025-01-28T09:00:00",
        note: "Đang đối chiếu lịch và GPS.",
        admin: "Admin 1",
      },
    ],
    logs: [
      { at: "2025-01-27T14:20:00", action: "Tạo khiếu nại", by: "Hệ thống" },
      {
        at: "2025-01-28T09:00:00",
        action: "Chuyển trạng thái: Đang xác minh",
        by: "Admin 1",
      },
    ],
  },
  {
    id: "KN-003",
    source: "citizen",
    type: "invalid_image",
    status: "new",
    complainantName: "Lê Văn C",
    complainantContact: "levanc@email.com",
    respondentName: "Collector Minh",
    respondentRole: "collector",
    createdAt: "2025-01-28T07:15:00",
    description:
      "Ảnh xác nhận thu gom không rõ địa chỉ, nghi ngờ chụp ở nơi khác.",
    images: ["https://picsum.photos/400/300?random=3"],
    gps: {
      lat: 10.7769,
      lng: 106.7009,
      address: "78 Nguyễn Trãi, Q.5, TP.HCM",
    },
    reportId: "BC-2025-0041",
    statusHistory: [
      {
        status: "new",
        at: "2025-01-28T07:15:00",
        note: "Khiếu nại được gửi.",
        admin: null,
      },
    ],
    logs: [
      { at: "2025-01-28T07:15:00", action: "Tạo khiếu nại", by: "Hệ thống" },
    ],
  },
  {
    id: "KN-004",
    source: "citizen",
    type: "wrong_points",
    status: "resolved_adjusted",
    complainantName: "Phạm Thị D",
    complainantContact: "phamthid@email.com",
    respondentName: "Hệ thống",
    respondentRole: "system",
    createdAt: "2025-01-25T11:00:00",
    description:
      "Thu gom 15kg nhựa nhưng chỉ cộng 5 điểm. Đúng ra phải 15 điểm.",
    images: [],
    gps: null,
    reportId: "BC-2025-0030",
    statusHistory: [
      {
        status: "new",
        at: "2025-01-25T11:00:00",
        note: "Khiếu nại được gửi.",
        admin: null,
      },
      {
        status: "verifying",
        at: "2025-01-26T10:00:00",
        note: "Đối chiếu cân nặng và điểm.",
        admin: "Admin 2",
      },
      {
        status: "resolved_adjusted",
        at: "2025-01-26T14:00:00",
        note: "Đã cộng bù 10 điểm cho Citizen.",
        admin: "Admin 2",
      },
    ],
    logs: [
      { at: "2025-01-25T11:00:00", action: "Tạo khiếu nại", by: "Hệ thống" },
      {
        at: "2025-01-26T10:00:00",
        action: "Chuyển trạng thái: Đang xác minh",
        by: "Admin 2",
      },
      {
        at: "2025-01-26T14:00:00",
        action: "Điều chỉnh điểm: +10",
        by: "Admin 2",
      },
    ],
  },
  {
    id: "KN-005",
    source: "enterprise",
    type: "wrong_waste",
    status: "resolved_warning",
    complainantName: "Công ty Tái chế Y",
    complainantContact: "contact@recycley.vn",
    respondentName: "Đội thu gom Q.7",
    respondentRole: "collector",
    createdAt: "2025-01-24T16:45:00",
    description:
      "Nhiều lần nhận rác không đúng chủng loại từ đội thu gom Q.7, ảnh hưởng dây chuyền tái chế.",
    images: [
      "https://picsum.photos/400/300?random=4",
      "https://picsum.photos/400/300?random=5",
    ],
    gps: null,
    reportId: null,
    statusHistory: [
      {
        status: "new",
        at: "2025-01-24T16:45:00",
        note: "Khiếu nại được gửi.",
        admin: null,
      },
      {
        status: "verifying",
        at: "2025-01-25T09:00:00",
        note: "Xác minh lịch sử vi phạm.",
        admin: "Admin 1",
      },
      {
        status: "resolved_warning",
        at: "2025-01-25T15:00:00",
        note: "Gắn cảnh báo; vi phạm lặp lại.",
        admin: "Admin 1",
      },
    ],
    logs: [
      { at: "2025-01-24T16:45:00", action: "Tạo khiếu nại", by: "Hệ thống" },
      {
        at: "2025-01-25T09:00:00",
        action: "Chuyển trạng thái: Đang xác minh",
        by: "Admin 1",
      },
      {
        at: "2025-01-25T15:00:00",
        action: "Gắn cảnh báo cho Đội thu gom Q.7",
        by: "Admin 1",
      },
    ],
  },
];

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

const ComplaintListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const complaints = useMemo(() => {
    let list = [...MOCK_COMPLAINTS];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.complainantName.toLowerCase().includes(q) ||
          c.respondentName.toLowerCase().includes(q) ||
          (c.reportId && c.reportId.toLowerCase().includes(q)),
      );
    }
    if (filterSource) list = list.filter((c) => c.source === filterSource);
    if (filterType) list = list.filter((c) => c.type === filterType);
    if (filterStatus) list = list.filter((c) => c.status === filterStatus);
    return list;
  }, [searchTerm, filterSource, filterType, filterStatus]);

  const handleOpenDetail = (id) => {
    // Navigate to detail page with complaint ID as query param
    window.history.pushState({}, "", `/admin/complaints/detail?id=${id}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="flex flex-col w-full h-full gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <FaBullhorn className="text-xl text-green-600" />
          <h1 className="text-xl font-bold text-gray-900">
            Khiếu nại & tranh chấp
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaBell className="text-amber-500" />
          <span>
            Hệ thống gửi thông báo khi có khiếu nại mới (dashboard / thông báo
            nội bộ)
          </span>
        </div>
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Filters & Search */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute text-gray-500 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Tìm theo mã KN, người khiếu nại, bên bị KN, mã báo cáo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="sr-only">Nguồn</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="py-2 pl-3 pr-8 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tất cả nguồn</option>
                {Object.entries(SOURCES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="sr-only">Loại khiếu nại</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="py-2 pl-3 pr-8 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tất cả loại</option>
                {Object.entries(COMPLAINT_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="sr-only">Trạng thái</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-2 pl-3 pr-8 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(STATUS_MAP).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase border-b">
                  STT
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase border-b">
                  Mã KN
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase border-b">
                  Nguồn
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase border-b">
                  Loại khiếu nại
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase border-b">
                  Người khiếu nại
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase border-b">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase border-b">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase border-b">
                  Thao tác
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
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{i + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {c.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {SOURCES[c.source]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {COMPLAINT_TYPES[c.type]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {c.complainantName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${STATUS_MAP[c.status]?.color || "bg-gray-100 text-gray-800"}`}
                      >
                        {STATUS_MAP[c.status]?.label || c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOpenDetail(c.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 transition-colors bg-green-50 rounded-md hover:bg-green-100"
                      >
                        <FaEye /> Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComplaintListPage;
