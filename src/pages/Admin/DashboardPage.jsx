import React, { useEffect, useRef } from "react";
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

      const ctx = barCanvas.getContext("2d");
      barChartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
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
          ],
          datasets: [
            {
              label: "Revenue",
              data: [
                45000000, 52000000, 48000000, 61000000, 55000000, 67000000,
                90000000, 72000000, 68000000, 75000000, 80000000, 85000000,
              ],
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
              max: 90000000,
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
              ticks: {
                stepSize: 18000000,
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

      const ctx = pieCanvas.getContext("2d");
      pieChartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Category 1", "Category 2", "Category 3", "Category 4"],
          datasets: [
            {
              data: [160, 101, 120, 728],
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
  }, []);

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

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Tổng số báo cáo */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col">
            <h3 className="mb-1 text-sm font-medium text-gray-600">
              Tổng số báo cáo
            </h3>
            <p className="mb-2 text-xs text-gray-500">/tháng</p>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">20</span>
              <span className="ml-2 text-sm text-gray-600">báo cáo</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tỷ lệ hoàn thành */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col">
            <h3 className="mb-1 text-sm font-medium text-gray-600">
              Tỷ lệ hoàn thành
            </h3>
            <p className="mb-2 text-xs text-gray-500">/tháng</p>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">90</span>
              <span className="ml-2 text-sm text-gray-600">%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Số người thu gom */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col">
            <h3 className="mb-1 text-sm font-medium text-gray-600">
              Số người thu gom
            </h3>
            <p className="mb-2 text-xs text-gray-500">/tháng</p>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">1.000</span>
              <span className="ml-2 text-sm text-gray-600">người</span>
            </div>
          </div>
        </div>

        {/* Card 4: Số lượng yêu cầu */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col">
            <h3 className="mb-1 text-sm font-medium text-gray-600">
              Số lượng yêu cầu
            </h3>
            <p className="mb-2 text-xs text-gray-500">/tháng</p>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">10</span>
              <span className="ml-2 text-sm text-gray-600">yêu cầu</span>
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
