import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaFileAlt,
  FaImages,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaCoins,
  FaUserShield,
  FaHistory,
} from "react-icons/fa";

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

const ComplaintDetailPage = () => {
  const [selected, setSelected] = useState(null);
  const [verifyNote, setVerifyNote] = useState("");
  const [requestEvidence, setRequestEvidence] = useState("");
  const [decision, setDecision] = useState("");
  const [adjustPoints, setAdjustPoints] = useState("");
  const [warningReason, setWarningReason] = useState("");
  const [warningDuration, setWarningDuration] = useState("7");
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    // Get complaint ID from URL query params
    const params = new URLSearchParams(window.location.search);
    const complaintId = params.get("id");

    if (complaintId) {
      const complaint = MOCK_COMPLAINTS.find((c) => c.id === complaintId);
      if (complaint) {
        setTimeout(() => {
          setSelected(complaint);
        }, 100);
      }
    }
  }, []);

  const handleBack = () => {
    window.history.pushState({}, "", "/admin/complaints");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleSubmitDecision = () => {
    if (!decision) return;
    // TODO: Gọi API xử lý khiếu nại
    console.log({
      complaintId: selected?.id,
      decision,
      verifyNote,
      requestEvidence,
      adjustPoints: decision === "adjusted" ? adjustPoints : undefined,
      warningReason: decision === "warning" ? warningReason : undefined,
      warningDuration: decision === "warning" ? warningDuration : undefined,
      rejectReason: decision === "rejected" ? rejectReason : undefined,
    });
    handleBack();
  };

  const isResolved =
    selected &&
    [
      "resolved_accepted",
      "resolved_rejected",
      "resolved_adjusted",
      "resolved_warning",
    ].includes(selected.status);

  if (!selected) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-6">
        <p className="text-gray-500">Không tìm thấy khiếu nại.</p>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
        >
          <FaArrowLeft />
          <span>Quay lại</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-6">
      {/* Page Header */}
      <header className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 text-gray-700 transition-colors hover:text-gray-900"
            onClick={handleBack}
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>

          <div className="ml-5">
            <h1 className="text-2xl font-bold text-black">
              Chi tiết khiếu nại
            </h1>
            <p className="text-sm text-gray-600">
              Xem và xử lý chi tiết khiếu nại, tranh chấp từ người dùng.
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-col flex-1 gap-6 p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Summary */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="mb-1 text-xl font-bold text-gray-900">
                    {selected.id}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {SOURCES[selected.source]} ·{" "}
                    {COMPLAINT_TYPES[selected.type]}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                        STATUS_MAP[selected.status]?.color ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {STATUS_MAP[selected.status]?.label || selected.status}
                    </span>
                    {selected.reportId && (
                      <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                        {selected.reportId}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Tạo lúc:</span>{" "}
                  {formatDate(selected.createdAt)}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Người khiếu nại
                  </p>
                  <p className="font-medium text-gray-900">
                    {selected.complainantName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selected.complainantContact}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Bên bị khiếu nại
                  </p>
                  <p className="font-medium text-gray-900">
                    {selected.respondentName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selected.respondentRole === "collector"
                      ? "Người thu gom"
                      : selected.respondentRole === "enterprise"
                        ? "Doanh nghiệp"
                        : "Hệ thống"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FaFileAlt className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Mô tả khiếu nại
                </h3>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {selected.description}
              </p>
            </div>

            {/* Images */}
            {selected.images && selected.images.length > 0 && (
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <FaImages className="text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Hình ảnh đính kèm
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selected.images.map((src, i) => (
                    <a
                      key={i}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden border border-gray-200 rounded-lg"
                    >
                      <img
                        src={src}
                        alt={`Khiếu nại ${i + 1}`}
                        className="object-cover w-40 h-28"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* GPS */}
            {selected.gps && (
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <FaMapMarkerAlt className="text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Vị trí
                  </h3>
                </div>
                <p className="text-gray-700">{selected.gps.address}</p>
                <p className="mt-1 text-sm text-gray-500">
                  GPS: {selected.gps.lat}, {selected.gps.lng}
                </p>
              </div>
            )}

            {/* Verification & Decision - only when not resolved */}
            {!isResolved && (
              <>
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <FaCheckCircle className="text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Xác minh
                    </h3>
                  </div>
                  <p className="mb-4 text-sm text-gray-600">
                    Ghi chú xác minh (đối chiếu ảnh, thời gian, GPS, dữ liệu hệ
                    thống). Yêu cầu bổ sung bằng chứng nếu cần.
                  </p>
                  <textarea
                    value={verifyNote}
                    onChange={(e) => setVerifyNote(e.target.value)}
                    placeholder="Ghi chú xác minh..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="mt-3">
                    <label className="block mb-1 text-xs font-semibold text-gray-700 uppercase">
                      Yêu cầu bổ sung bằng chứng (tùy chọn)
                    </label>
                    <textarea
                      value={requestEvidence}
                      onChange={(e) => setRequestEvidence(e.target.value)}
                      placeholder="Mô tả yêu cầu..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <FaUserShield className="text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Quyết định xử lý
                    </h3>
                  </div>

                  <div className="space-y-3 mb-4">
                    {[
                      {
                        value: "accepted",
                        label: "Chấp nhận khiếu nại và yêu cầu thu gom lại",
                        icon: FaCheckCircle,
                      },
                      {
                        value: "rejected",
                        label: "Từ chối khiếu nại (đúng quy định)",
                        icon: FaTimesCircle,
                      },
                      {
                        value: "adjusted",
                        label: "Điều chỉnh điểm thưởng thủ công cho Citizen",
                        icon: FaCoins,
                      },
                      {
                        value: "warning",
                        label:
                          "Gắn cảnh báo / xử lý Collector hoặc Enterprise (vi phạm lặp lại)",
                        icon: FaExclamationTriangle,
                      },
                    ].map(({ value, label, icon }) => {
                      const IconComponent = icon;
                      return (
                        <label
                          key={value}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            decision === value
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="decision"
                            value={value}
                            checked={decision === value}
                            onChange={(e) => setDecision(e.target.value)}
                            className="text-green-600 focus:ring-green-500"
                          />
                          <IconComponent
                            className={
                              decision === value
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {label}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {decision === "adjusted" && (
                    <div className="p-4 mb-4 bg-gray-50 rounded-lg">
                      <label className="block mb-2 text-xs font-semibold text-gray-700 uppercase">
                        Điểm điều chỉnh (+/-)
                      </label>
                      <input
                        type="number"
                        value={adjustPoints}
                        onChange={(e) => setAdjustPoints(e.target.value)}
                        placeholder="Ví dụ: 10 hoặc -5"
                        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {decision === "warning" && (
                    <div className="p-4 mb-4 space-y-3 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block mb-1 text-xs font-semibold text-gray-700 uppercase">
                          Lý do cảnh báo
                        </label>
                        <input
                          type="text"
                          value={warningReason}
                          onChange={(e) => setWarningReason(e.target.value)}
                          placeholder="Nhập lý do..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-semibold text-gray-700 uppercase">
                          Thời hạn cảnh báo (ngày)
                        </label>
                        <input
                          type="number"
                          value={warningDuration}
                          onChange={(e) => setWarningDuration(e.target.value)}
                          min="1"
                          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {decision === "rejected" && (
                    <div className="p-4 mb-4 bg-gray-50 rounded-lg">
                      <label className="block mb-2 text-xs font-semibold text-gray-700 uppercase">
                        Lý do từ chối
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Giải thích vì sao từ chối (đúng quy định)..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmitDecision}
                      disabled={
                        !decision ||
                        (decision === "rejected" && !rejectReason.trim()) ||
                        (decision === "adjusted" &&
                          (adjustPoints === "" ||
                            Number.isNaN(Number(adjustPoints)))) ||
                        (decision === "warning" && !warningReason.trim())
                      }
                      className="flex-1 px-4 py-2 font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Xác nhận quyết định
                    </button>
                    <button
                      onClick={handleBack}
                      className="flex-1 px-4 py-2 font-medium text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </>
            )}

            {isResolved && (
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <FaCheckCircle />
                  <h3 className="text-lg font-semibold">
                    Khiếu nại đã được xử lý
                  </h3>
                </div>
                <p className="mt-2 text-gray-600">
                  Trạng thái: {STATUS_MAP[selected.status]?.label}. Không thể
                  thay đổi quyết định.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {/* Status history */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaHistory className="text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Lịch sử trạng thái
                  </h3>
                </div>
              </div>
              <div className="space-y-4">
                {selected.statusHistory.map((h, i) => (
                  <div key={i} className="relative pl-6">
                    {i < selected.statusHistory.length - 1 && (
                      <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gray-200" />
                    )}
                    <div className="absolute top-0 left-0 flex items-center justify-center w-4 h-4 bg-green-500 rounded-full" />
                    <p className="font-medium text-gray-900">
                      {STATUS_MAP[h.status]?.label || h.status}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(h.at)}</p>
                    {h.note && (
                      <p className="mt-1 text-sm text-gray-600">{h.note}</p>
                    )}
                    {h.admin && (
                      <p className="mt-1 text-xs text-gray-500">
                        Admin: {h.admin}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Logs */}
            <div className="p-6 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FaFileAlt className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Log liên quan
                </h3>
              </div>
              <div className="space-y-3">
                {selected.logs.map((log, i) => (
                  <div key={i} className="flex justify-between gap-2 text-sm">
                    <span className="text-gray-700">{log.action}</span>
                    <span className="text-gray-500 whitespace-nowrap">
                      {formatDate(log.at)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailPage;
