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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminStatisticsOverview({ range: "MONTH" });
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
  }, []);

  useEffect(() => {
    const fetchChartStats = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const [reportsRes, collectorsRes] = await Promise.all([
          getAdminStatisticsReportsByMonth(currentYear),
          getAdminStatisticsCollectorsByArea(),
        ]);

        const reportsData = reportsRes?.data ?? reportsRes ?? [];
        const collectorsData = collectorsRes?.data ?? collectorsRes ?? [];

        setReportsByMonth(Array.isArray(reportsData) ? reportsData : []);
        setCollectorsByArea(
          Array.isArray(collectorsData) ? collectorsData : [],
        );
      } catch (err) {
        console.error("Không thể tải thống kê cho biểu đồ:", err);
        setReportsByMonth([]);
        setCollectorsByArea([]);
      }
    };

    fetchChartStats();
  }, []);

  useEffect(() => {
    // Store ref values for cleanup
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
        const rawMonth = item?.month;
        const count = Number(item?.reportCount ?? 0);
        if (!rawMonth || Number.isNaN(count)) return;
        const parsed = new Date(String(rawMonth));
        if (Number.isNaN(parsed.getTime())) return;
        const idx = parsed.getMonth();
        if (idx >= 0 && idx < monthCounts.length) {
          monthCounts[idx] = count;
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
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(context.parsed.y)
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
                text: "Month",
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

      const pieLabels = collectorsByArea.map(
        (item) => item?.areaName || "Khu vực",
      );
      const pieData = collectorsByArea.map((item) =>
        Number(item?.collectorCount ?? 0),
      );

      const ctx = pieCanvas.getContext("2d");
      pieChartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: pieLabels,
          datasets: [
            {
              data: pieData,
              backgroundColor: [
                "rgba(236, 72, 153, 0.8)",
                "rgba(244, 114, 182, 0.8)",
                "rgba(251, 146, 207, 0.8)",
                "rgba(252, 165, 165, 0.8)",
              ],
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

    // Cleanup function
    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
        barChartInstance.current = null;
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
        pieChartInstance.current = null;
      }

      // Additional cleanup for any charts on canvas
      if (barCanvas) {
        const existingChart = Chart.getChart(barCanvas);
        if (existingChart) {
          existingChart.destroy();
        }
      }
      if (pieCanvas) {
        const existingChart = Chart.getChart(pieCanvas);
        if (existingChart) {
          existingChart.destroy();
        }
      }
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

      {/* Summary Statistics Cards (3 cards, style như HistoryPage, không hiển thị range) */}
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

      {/* Charts Section */}
      <div className="grid flex-1 min-h-0 grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="p-6 bg-white rounded-lg shadow-sm min-h-[420px]">
          <div className="h-full">
            <canvas ref={barChartRef} className="w-full h-full"></canvas>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="p-6 bg-white rounded-lg shadow-sm min-h-[420px]">
          <div className="h-full">
            <canvas ref={pieChartRef} className="w-full h-full"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
