import React, { useEffect, useRef, useState } from "react";
import {
  FaUsers,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaTag,
  FaCheckCircle,
  FaClipboardCheck,
} from "react-icons/fa";
import {
  getAdminStatisticsOverview,
  getAdminStatisticsReportsByMonth,
  getAdminStatisticsCollectorsByArea,
} from "../../service/api";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  BarController,
  PieController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  BarController,
  PieController,
  Title,
  Tooltip,
  Legend,
);

/** Chuẩn hóa body API (array trực tiếp hoặc { data/content/result }) */
const toStatsArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.content)) return payload.content;
  if (Array.isArray(payload.result)) return payload.result;
  return [];
};

const monthToIndex = (rawMonth) => {
  if (rawMonth == null) return -1;
  const n = Number(rawMonth);
  if (Number.isInteger(n) && n >= 0 && n <= 11) return n;
  if (Number.isInteger(n) && n >= 1 && n <= 12) return n - 1;
  const parsed = new Date(String(rawMonth));
  if (!Number.isNaN(parsed.getTime())) return parsed.getMonth();
  return -1;
};

const PIE_COLORS = [
  "rgba(34, 197, 94, 0.85)",
  "rgba(59, 130, 246, 0.85)",
  "rgba(251, 146, 60, 0.85)",
  "rgba(168, 85, 247, 0.85)",
  "rgba(236, 72, 153, 0.85)",
  "rgba(20, 184, 166, 0.85)",
  "rgba(234, 179, 8, 0.85)",
  "rgba(239, 68, 68, 0.85)",
];

const DashboardPage = () => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  const [stats, setStats] = useState({
    totalActiveCollectors: 0,
    totalActiveWasteCategories: 0,
    totalComplaintsReceived: 0,
    totalResolvedComplaints: 0,
    totalActiveAreas: 0,
    totalAcceptingWasteCategories: 0,
  });

  const [reportsByMonth, setReportsByMonth] = useState([]);
  const [collectorsByArea, setCollectorsByArea] = useState([]);
  /** Query `year` (int) cho GET /admin/statistics/reports-by-month */
  const [reportsChartYear, setReportsChartYear] = useState(() =>
    new Date().getFullYear(),
  );
  const [reportsYearInput, setReportsYearInput] = useState(() =>
    String(new Date().getFullYear()),
  );
  /** DAY | WEEK | MONTH | YEAR — cùng API range như HistoryPage / collector stats */
  const [rangeFilter, setRangeFilter] = useState("MONTH");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminStatisticsOverview({
          range: rangeFilter,
        });
        const data = response?.data ?? response ?? {};
        setStats({
          totalActiveCollectors: Number(data.totalActiveCollectors ?? 0),
          totalActiveWasteCategories: Number(
            data.totalActiveWasteCategories ?? 0,
          ),
          totalComplaintsReceived: Number(data.totalComplaintsReceived ?? 0),
          totalResolvedComplaints: Number(data.totalResolvedComplaints ?? 0),
          totalActiveAreas: Number(data.totalActiveAreas ?? 0),
          totalAcceptingWasteCategories: Number(
            data.totalAcceptingWasteCategories ?? 0,
          ),
        });
      } catch (err) {
        console.error("Không thể tải thống kê tổng quan admin:", err);
      }
    };
    fetchStats();
  }, [rangeFilter]);

  useEffect(() => {
    const loadCollectors = async () => {
      try {
        const collectorsRes = await getAdminStatisticsCollectorsByArea();
        const collectorsData = toStatsArray(
          collectorsRes?.data ?? collectorsRes ?? [],
        );
        setCollectorsByArea(collectorsData);
      } catch (err) {
        console.error("Không thể tải thống kê collector theo khu vực:", err);
        setCollectorsByArea([]);
      }
    };
    loadCollectors();
  }, []);

  useEffect(() => {
    const year = Number(reportsChartYear);
    if (!Number.isInteger(year) || year < 2000 || year > 2100) return;

    const loadReportsByMonth = async () => {
      try {
        const reportsRes = await getAdminStatisticsReportsByMonth(year);
        const reportsData = toStatsArray(reportsRes?.data ?? reportsRes ?? []);
        setReportsByMonth(reportsData);
      } catch (err) {
        console.error("Không thể tải thống kê báo cáo theo tháng:", err);
        setReportsByMonth([]);
      }
    };
    loadReportsByMonth();
  }, [reportsChartYear]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const barCanvas = barChartRef.current;
      const pieCanvas = pieChartRef.current;

      // Bar Chart
      if (barCanvas) {
        // Check if canvas already has a chart instance and destroy it
        const existingChart = Chart.getChart(barCanvas);
        if (existingChart) {
          existingChart.destroy();
        }

        // Also destroy our ref instance if it exists
        if (barChartInstance.current) {
          barChartInstance.current.destroy();
          barChartInstance.current = null;
        }

        const monthCounts = MONTH_LABELS.map(() => 0);
        reportsByMonth.forEach((item) => {
          const rawMonth =
            item?.month ?? item?.monthIndex ?? item?.monthNumber ?? item?.m;
          const count = Number(
            item?.reportCount ?? item?.count ?? item?.total ?? item?.value ?? 0,
          );
          if (Number.isNaN(count)) return;
          const idx = monthToIndex(rawMonth);
          if (idx >= 0 && idx < monthCounts.length) {
            monthCounts[idx] += count;
          }
        });

        const maxReports = monthCounts.length
          ? Math.max(...monthCounts, 0) || 5
          : 5;

        const ctx = barCanvas.getContext("2d");
        barChartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: MONTH_LABELS,
            datasets: [
              {
                label: "Số báo cáo",
                data: monthCounts,
                backgroundColor: "rgba(99, 102, 241, 0.8)",
                borderColor: "rgba(99, 102, 241, 1)",
                borderWidth: 1,
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "top",
                align: "center",
                labels: {
                  usePointStyle: true,
                  padding: 15,
                  font: {
                    size: 12,
                  },
                },
              },
              tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                padding: 12,
                titleFont: {
                  size: 14,
                  weight: "bold",
                },
                bodyFont: {
                  size: 13,
                },
                callbacks: {
                  title: function (context) {
                    return context[0].label;
                  },
                  label: function (context) {
                    return (
                      context.dataset.label +
                      ": " +
                      new Intl.NumberFormat("vi-VN").format(context.parsed.y)
                    );
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                suggestedMax: maxReports,
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                  callback: function (value) {
                    return new Intl.NumberFormat("vi-VN").format(value);
                  },
                  font: {
                    size: 11,
                  },
                },
                title: {
                  display: true,
                  font: {
                    size: 12,
                    weight: "bold",
                  },
                },
              },
              x: {
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                  font: {
                    size: 11,
                  },
                },
                title: {
                  display: true,
                  text: "Tháng",
                  font: {
                    size: 12,
                    weight: "bold",
                  },
                },
              },
            },
          },
        });
      }

      // Pie Chart
      if (pieCanvas) {
        // Check if canvas already has a chart instance and destroy it
        const existingChart = Chart.getChart(pieCanvas);
        if (existingChart) {
          existingChart.destroy();
        }

        // Also destroy our ref instance if it exists
        if (pieChartInstance.current) {
          pieChartInstance.current.destroy();
          pieChartInstance.current = null;
        }

        let pieLabels = collectorsByArea.map(
          (item) =>
            item?.areaName ??
            item?.name ??
            item?.districtName ??
            item?.regionName ??
            "Khu vực",
        );
        let pieData = collectorsByArea.map((item) =>
          Number(
            item?.collectorCount ??
              item?.count ??
              item?.total ??
              item?.value ??
              0,
          ),
        );
        const hasPieData = pieData.length > 0 && pieData.some((v) => v > 0);
        if (!hasPieData) {
          pieLabels = ["Chưa có dữ liệu"];
          pieData = [1];
        }

        const ctx = pieCanvas.getContext("2d");
        pieChartInstance.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: pieLabels,
            datasets: [
              {
                data: pieData,
                backgroundColor: pieData.map(
                  (_, i) => PIE_COLORS[i % PIE_COLORS.length],
                ),
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "bottom",
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label || "";
                    const value = context.parsed || 0;
                    return `${label}: ${value}`;
                  },
                },
              },
            },
          },
        });
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      barChartInstance.current?.destroy();
      barChartInstance.current = null;
      pieChartInstance.current?.destroy();
      pieChartInstance.current = null;
    };
  }, [reportsByMonth, collectorsByArea]);

  return (
    <div className="flex flex-col w-full h-full gap-6">
      {/* Page Header */}
      <header className="w-full px-6 py-4 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-black">
            Bảng báo cáo tổng quan
          </h1>
          <p className="text-sm text-gray-600">
            Theo dõi hiệu suất thu gom và quản lý các báo cáo mới nhất.
          </p>
        </div>
      </header>

      {/* Filter thời gian (range) — giống HistoryPage */}
      <div className="px-6 shrink-0">
        <div className="w-full max-w-sm">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Thời gian
          </label>
          <select
            value={rangeFilter}
            onChange={(e) => setRangeFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="DAY">Theo ngày</option>
            <option value="WEEK">Theo tuần</option>
            <option value="MONTH">Theo tháng</option>
            <option value="YEAR">Theo năm</option>
          </select>
        </div>
      </div>

      {/* Thống kê tổng quan theo bộ lọc Thời gian */}
      <div className="grid grid-cols-1 gap-4 px-6 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Người thu gom đang hoạt động
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalActiveCollectors}
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <FaUsers className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Khiếu nại đã nhận</p>
              <p className="text-3xl font-bold text-orange-600">
                {stats.totalComplaintsReceived}
              </p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
              <FaExclamationCircle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Khu vực hoạt động</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.totalActiveAreas}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
              <FaMapMarkerAlt className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Loại rác đang hoạt động
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalActiveWasteCategories}
              </p>
            </div>
            <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <FaTag className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Khiếu nại đã xử lý</p>
              <p className="text-3xl font-bold text-teal-600">
                {stats.totalResolvedComplaints}
              </p>
            </div>
            <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
              <FaCheckCircle className="w-8 h-8 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Loại rác đang tiếp nhận
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {stats.totalAcceptingWasteCategories}
              </p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
              <FaClipboardCheck className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section — chiều cao cố định cho canvas (Chart.js maintainAspectRatio: false) */}
      <div className="grid grid-cols-1 gap-6 px-6 pb-6 lg:grid-cols-2">
        <div className="flex flex-col p-6 bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <h2 className="text-gray-800 text-xl font-semibold">
              Số báo cáo theo năm
            </h2>
            <div className="flex items-center gap-3">
              <label
                htmlFor="reportsByYear"
                className="font-semibold text-gray-600"
              >
                Năm:
              </label>
              <input
                type="number"
                id="reportsByYear"
                value={reportsYearInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  setReportsYearInput(raw);
                  if (raw === "") return;
                  const n = parseInt(raw, 10);
                  if (Number.isFinite(n) && n >= 2000 && n <= 2100) {
                    setReportsChartYear(n);
                  }
                }}
                onBlur={() => {
                  const n = parseInt(reportsYearInput, 10);
                  if (!Number.isFinite(n) || n < 2000 || n > 2100) {
                    setReportsYearInput(String(reportsChartYear));
                  } else {
                    setReportsYearInput(String(n));
                    setReportsChartYear(n);
                  }
                }}
                min={2000}
                max={2100}
                className="px-3 py-2 border-2 border-gray-300 rounded-md text-sm w-20 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
          <div className="relative w-full h-[340px]">
            <canvas ref={barChartRef} className="!max-h-full" />
          </div>
        </div>

        <div className="flex flex-col p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-gray-800 text-xl font-semibold mb-5">
            Số người thu gom theo khu vực làm việc
          </h2>
          <div className="relative w-full h-[340px]">
            <canvas ref={pieChartRef} className="!max-h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
