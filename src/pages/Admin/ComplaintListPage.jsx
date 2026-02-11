import React, { useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import ComplaintList from "../../components/AdminComponent/ComplaintList";

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
    <div className="flex flex-col w-full h-full gap-6">
      {/* Page Header */}
      <header className="flex items-center justify-between w-full px-6 py-4 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-black">
            Khiếu nại & tranh chấp
          </h1>
          <p className="text-sm text-gray-600">
            Quản lý và xử lý các khiếu nại, tranh chấp từ người dùng.
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo nguồn, người khiếu nại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-4 pr-10 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg min-w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <FaSearch className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
        </div>
      </header>

      <div className="flex flex-col gap-6 p-6">
        {/* Filters */}
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

        <ComplaintList
          complaints={complaints}
          onViewDetail={handleOpenDetail}
          complaintTypes={COMPLAINT_TYPES}
          sources={SOURCES}
          statusMap={STATUS_MAP}
        />
      </div>
    </div>
  );
};

export default ComplaintListPage;
