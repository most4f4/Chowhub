// src/pages/[restaurantUsername]/dashboard/sales-analytics/peak-hours/index.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { apiFetch } from "@/lib/api";
import AnalyticsBackButton from "@/components/AnalyticsBackButton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut, Radar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
);

export default function PeakHourAnalysis() {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  const [peakHourData, setPeakHourData] = useState({
    hourlyStats: [],
    dailyPatterns: [],
    weeklyTrends: [],
    insights: {},
    staffingRecommendations: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const loadPeakHourData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        timeframe: selectedTimeframe,
      }).toString();

      const response = await apiFetch(`/analytics/peak-hours?${params}`);
      setPeakHourData(response);
    } catch (err) {
      console.error("Failed to load peak hour analytics:", err);
      setPeakHourData({
        hourlyStats: [],
        dailyPatterns: [],
        weeklyTrends: [],
        insights: {},
        staffingRecommendations: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      loadPeakHourData();
    }
  }, [router.isReady, selectedTimeframe]);

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getHourLabel = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };

  const getDayName = (dayIndex) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayIndex];
  };

  // Chart configurations
  const insights = peakHourData.insights || {};

  // Hourly activity bar chart
  const hourlyChartData = {
    labels: peakHourData.hourlyStats.map((stat) => getHourLabel(stat.hour)),
    datasets: [
      {
        label: "Orders",
        data: peakHourData.hourlyStats.map((stat) => stat.orderCount),
        backgroundColor: "rgba(33, 150, 243, 0.8)",
        borderColor: "#2196F3",
        borderWidth: 2,
        yAxisID: "y",
      },
      {
        label: "Revenue ($)",
        data: peakHourData.hourlyStats.map((stat) => stat.revenue),
        backgroundColor: "rgba(255, 152, 0, 0.8)",
        borderColor: "#FF9800",
        borderWidth: 2,
        yAxisID: "y1",
        type: "line",
        tension: 0.4,
      },
    ],
  };

  const hourlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        labels: { color: "#CCC" },
      },
      title: {
        display: true,
        text: "24-Hour Activity Overview",
        color: "#FFF",
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        ticks: { color: "#CCC" },
        grid: { color: "#3A3A4A" },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        ticks: { color: "#CCC" },
        grid: { color: "#3A3A4A" },
        title: {
          display: true,
          text: "Orders",
          color: "#2196F3",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        ticks: {
          color: "#CCC",
          callback: function (value) {
            return "$" + value.toFixed(0);
          },
        },
        grid: {
          drawOnChartArea: false,
          color: "#3A3A4A",
        },
        title: {
          display: true,
          text: "Revenue ($)",
          color: "#FF9800",
        },
      },
    },
  };

  // Daily patterns bar chart
  const dailyPatternsData = {
    labels: peakHourData.dailyPatterns.map((day) => getDayName(day.dayOfWeek)),
    datasets: [
      {
        label: "Orders",
        data: peakHourData.dailyPatterns.map((day) => day.orderCount),
        backgroundColor: peakHourData.dailyPatterns.map((day, index) =>
          index === 0 || index === 6 ? "rgba(255, 152, 0, 0.8)" : "rgba(76, 175, 80, 0.8)",
        ), // Weekend vs Weekday colors
        borderColor: peakHourData.dailyPatterns.map((day, index) =>
          index === 0 || index === 6 ? "#FF9800" : "#4CAF50",
        ),
        borderWidth: 2,
      },
    ],
  };

  const dailyPatternsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Daily Order Patterns",
        color: "#FFF",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const day = peakHourData.dailyPatterns[context.dataIndex];
            return [
              `Orders: ${context.raw}`,
              `Revenue: $${day?.revenue?.toFixed(2) || 0}`,
              `Avg Order: $${day?.avgOrderValue?.toFixed(2) || 0}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#CCC" },
        grid: { color: "#3A3A4A" },
        title: {
          display: true,
          text: "Number of Orders",
          color: "#FFF",
        },
      },
      x: {
        ticks: { color: "#CCC" },
        grid: { color: "#3A3A4A" },
      },
    },
  };

  // Revenue distribution pie chart
  const revenueDistributionData = {
    labels: peakHourData.dailyPatterns.map((day) => getDayName(day.dayOfWeek)),
    datasets: [
      {
        data: peakHourData.dailyPatterns.map((day) => day.revenue),
        backgroundColor: [
          "#FF6384", // Sunday
          "#36A2EB", // Monday
          "#FFCE56", // Tuesday
          "#4BC0C0", // Wednesday
          "#9966FF", // Thursday
          "#FF9F40", // Friday
          "#FF6384", // Saturday
        ].slice(0, peakHourData.dailyPatterns.length),
      },
    ],
  };

  const revenueDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#CCC",
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "Revenue by Day",
        color: "#FFF",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: $${context.raw.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Peak times heatmap visualization (enhanced)
  const getHeatmapCell = (hour) => {
    const hourData = peakHourData.hourlyStats.find((h) => h.hour === hour);
    const orderCount = hourData?.orderCount || 0;
    const revenue = hourData?.revenue || 0;
    const maxOrders = Math.max(...peakHourData.hourlyStats.map((h) => h.orderCount), 1);
    const intensity = (orderCount / maxOrders) * 100;

    let backgroundColor = "#2A2A3A"; // Default gray
    let textColor = "#CCC";

    if (intensity > 80) {
      backgroundColor = "#FF4444"; // High
      textColor = "#FFF";
    } else if (intensity > 60) {
      backgroundColor = "#FF9800"; // Medium-High
      textColor = "#FFF";
    } else if (intensity > 40) {
      backgroundColor = "#FFC107"; // Medium
      textColor = "#000";
    } else if (intensity > 20) {
      backgroundColor = "#4CAF50"; // Low-Medium
      textColor = "#FFF";
    } else if (intensity > 0) {
      backgroundColor = "#81C784"; // Low
      textColor = "#FFF";
    }

    return {
      backgroundColor,
      textColor,
      orderCount,
      revenue,
      intensity: Math.round(intensity),
    };
  };

  return (
    <DashboardLayout>
      <ManagerOnly>
        <div style={{ padding: "2rem", color: "#FFF" }}>
          <div style={{ marginBottom: "2rem" }}>
            <AnalyticsBackButton />
          </div>
          <h1 style={{ marginBottom: "2rem", fontSize: "2rem" }}>🕐 Peak Hour Analysis</h1>

          {/* Controls */}
          <div
            style={{
              backgroundColor: "#1E1E2F",
              padding: "1.5rem",
              borderRadius: "8px",
              marginBottom: "2rem",
              border: "1px solid #3A3A4A",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>📅 Analysis Controls</h3>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#CCC" }}>
                  Timeframe
                </label>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  style={{
                    backgroundColor: "#2A2A3A",
                    border: "1px solid #3A3A4A",
                    color: "#FFF",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    minWidth: "150px",
                  }}
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {selectedTimeframe === "custom" && (
                <>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#CCC" }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => handleDateChange("startDate", e.target.value)}
                      style={{
                        backgroundColor: "#2A2A3A",
                        border: "1px solid #3A3A4A",
                        color: "#FFF",
                        padding: "0.5rem",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "#CCC" }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => handleDateChange("endDate", e.target.value)}
                      style={{
                        backgroundColor: "#2A2A3A",
                        border: "1px solid #3A3A4A",
                        color: "#FFF",
                        padding: "0.5rem",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                </>
              )}

              <div style={{ display: "flex", alignItems: "end" }}>
                <button
                  onClick={loadPeakHourData}
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#666" : "#2196F3",
                    color: "#FFF",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Loading..." : "Update Analysis"}
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div
              style={{
                backgroundColor: "#1E1E2F",
                padding: "4rem",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #3A3A4A",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "4px solid #3A3A4A",
                  borderTop: "4px solid #2196F3",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 1rem",
                }}
              />
              <p>Analyzing peak hour patterns...</p>
              <style jsx>{`
                @keyframes spin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </div>
          ) : (
            <div>
              {/* Summary Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                {/* Peak Hour Card */}
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "2px solid #2196F320",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        backgroundColor: "#2196F320",
                        padding: "1rem",
                        borderRadius: "50%",
                        fontSize: "1.5rem",
                      }}
                    >
                      🕐
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.8rem" }}>
                        {insights.peakHour ? getHourLabel(insights.peakHour) : "N/A"}
                      </h3>
                      <p style={{ margin: 0, color: "#CCC" }}>Peak Hour</p>
                      <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                        {insights.peakHourOrders || 0} orders
                      </p>
                    </div>
                  </div>
                </div>

                {/* Busiest Day Card */}
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "2px solid #4CAF5020",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        backgroundColor: "#4CAF5020",
                        padding: "1rem",
                        borderRadius: "50%",
                        fontSize: "1.5rem",
                      }}
                    >
                      📈
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.8rem" }}>
                        {insights.busiestDay !== undefined
                          ? getDayName(insights.busiestDay)
                          : "N/A"}
                      </h3>
                      <p style={{ margin: 0, color: "#CCC" }}>Busiest Day</p>
                      <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                        {insights.busiestDayOrders || 0} orders
                      </p>
                    </div>
                  </div>
                </div>

                {/* Average Orders Card */}
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "2px solid #FF980020",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        backgroundColor: "#FF980020",
                        padding: "1rem",
                        borderRadius: "50%",
                        fontSize: "1.5rem",
                      }}
                    >
                      📊
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.8rem" }}>
                        {insights.avgOrdersPerHour ? insights.avgOrdersPerHour.toFixed(1) : "0"}
                      </h3>
                      <p style={{ margin: 0, color: "#CCC" }}>Avg Orders/Hour</p>
                      <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                        During business hours
                      </p>
                    </div>
                  </div>
                </div>

                {/* Staff Efficiency Card */}
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "2px solid #9C27B020",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        backgroundColor: "#9C27B020",
                        padding: "1rem",
                        borderRadius: "50%",
                        fontSize: "1.5rem",
                      }}
                    >
                      👥
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.8rem" }}>
                        {insights.staffEfficiencyScore
                          ? `${insights.staffEfficiencyScore}%`
                          : "N/A"}
                      </h3>
                      <p style={{ margin: 0, color: "#CCC" }}>Staff Efficiency</p>
                      <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                        Based on peak performance
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "2rem",
                  marginBottom: "2rem",
                }}
              >
                {/* Hourly Activity Chart */}
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #3A3A4A",
                  }}
                >
                  {peakHourData.hourlyStats.length > 0 ? (
                    <div style={{ height: "350px" }}>
                      <Bar
                        data={hourlyChartData}
                        options={hourlyChartOptions}
                        key="hourly-activity-chart"
                      />
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "2rem", color: "#CCC" }}>
                      <h3>📊 24-Hour Activity Overview</h3>
                      <p>No hourly data available for the selected period</p>
                    </div>
                  )}
                </div>

                {/* Revenue Distribution Pie Chart */}
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #3A3A4A",
                  }}
                >
                  {peakHourData.dailyPatterns.length > 0 ? (
                    <div style={{ height: "350px" }}>
                      <Doughnut
                        data={revenueDistributionData}
                        options={revenueDistributionOptions}
                        key="revenue-distribution-chart"
                      />
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "2rem", color: "#CCC" }}>
                      <h3>🥧 Revenue by Day</h3>
                      <p>No daily data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Daily Patterns Chart */}
              <div
                style={{
                  backgroundColor: "#1E1E2F",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                  border: "1px solid #3A3A4A",
                }}
              >
                {peakHourData.dailyPatterns.length > 0 ? (
                  <div style={{ height: "300px" }}>
                    <Bar
                      data={dailyPatternsData}
                      options={dailyPatternsOptions}
                      key="daily-patterns-chart"
                    />
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#CCC" }}>
                    <h3>📅 Daily Order Patterns</h3>
                    <p>No daily pattern data available</p>
                  </div>
                )}
              </div>

              {/* Enhanced Heatmap */}
              <div
                style={{
                  backgroundColor: "#1E1E2F",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                  border: "1px solid #3A3A4A",
                }}
              >
                <h3 style={{ marginBottom: "1rem" }}>🔥 24-Hour Activity Heatmap</h3>

                {peakHourData.hourlyStats.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#CCC" }}>
                    <p>No hourly data available for the selected period</p>
                  </div>
                ) : (
                  <>
                    {/* Heatmap Legend */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "1rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ color: "#CCC", fontSize: "0.9rem" }}>Activity Level:</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div
                          style={{
                            width: "15px",
                            height: "15px",
                            backgroundColor: "#2A2A3A",
                            borderRadius: "3px",
                          }}
                        ></div>
                        <span style={{ fontSize: "0.8rem", color: "#888" }}>None</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div
                          style={{
                            width: "15px",
                            height: "15px",
                            backgroundColor: "#81C784",
                            borderRadius: "3px",
                          }}
                        ></div>
                        <span style={{ fontSize: "0.8rem", color: "#888" }}>Low</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div
                          style={{
                            width: "15px",
                            height: "15px",
                            backgroundColor: "#4CAF50",
                            borderRadius: "3px",
                          }}
                        ></div>
                        <span style={{ fontSize: "0.8rem", color: "#888" }}>Medium</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div
                          style={{
                            width: "15px",
                            height: "15px",
                            backgroundColor: "#FFC107",
                            borderRadius: "3px",
                          }}
                        ></div>
                        <span style={{ fontSize: "0.8rem", color: "#888" }}>High</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div
                          style={{
                            width: "15px",
                            height: "15px",
                            backgroundColor: "#FF4444",
                            borderRadius: "3px",
                          }}
                        ></div>
                        <span style={{ fontSize: "0.8rem", color: "#888" }}>Peak</span>
                      </div>
                    </div>

                    {/* Heatmap Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
                        gap: "8px",
                      }}
                    >
                      {Array.from({ length: 24 }, (_, hour) => {
                        const cellData = getHeatmapCell(hour);

                        return (
                          <div
                            key={hour}
                            style={{
                              backgroundColor: cellData.backgroundColor,
                              color: cellData.textColor,
                              borderRadius: "8px",
                              padding: "0.75rem",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid #555",
                              cursor: "pointer",
                              transition: "transform 0.2s ease",
                              minHeight: "100px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                            title={`${getHourLabel(hour)}: ${cellData.orderCount} orders, $${cellData.revenue.toFixed(2)} revenue (${cellData.intensity}% intensity)`}
                          >
                            <div
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                marginBottom: "0.25rem",
                              }}
                            >
                              {getHourLabel(hour)}
                            </div>
                            <div style={{ fontSize: "0.8rem", textAlign: "center" }}>
                              {cellData.orderCount} orders
                            </div>
                            <div style={{ fontSize: "0.7rem", textAlign: "center", opacity: 0.8 }}>
                              ${cellData.revenue.toFixed(0)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Staffing Recommendations */}
              {peakHourData.staffingRecommendations &&
                peakHourData.staffingRecommendations.length > 0 && (
                  <div
                    style={{
                      backgroundColor: "#1E1E2F",
                      padding: "1.5rem",
                      borderRadius: "8px",
                      border: "1px solid #3A3A4A",
                    }}
                  >
                    <h3 style={{ marginBottom: "1rem" }}>👥 Staffing Recommendations</h3>

                    <div style={{ display: "grid", gap: "1rem" }}>
                      {peakHourData.staffingRecommendations.map((rec, index) => (
                        <div
                          key={`staffing-${index}`}
                          style={{
                            backgroundColor: "#252538",
                            padding: "1rem",
                            borderRadius: "8px",
                            border: "1px solid #3A3A4A",
                            display: "grid",
                            gridTemplateColumns: "auto 1fr auto",
                            gap: "1rem",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              color:
                                rec.priority === "high"
                                  ? "#FF4444"
                                  : rec.priority === "medium"
                                    ? "#FF9800"
                                    : "#4CAF50",
                              fontSize: "1.2rem",
                            }}
                          >
                            {rec.priority === "high"
                              ? "🚨"
                              : rec.priority === "medium"
                                ? "⚠️"
                                : "💡"}
                          </div>

                          <div>
                            <div
                              style={{ fontWeight: 600, marginBottom: "0.25rem", color: "#FFF" }}
                            >
                              {rec.timeSlot}
                            </div>
                            <div
                              style={{ color: "#CCC", fontSize: "0.9rem", marginBottom: "0.5rem" }}
                            >
                              Current: {rec.currentStaff} staff • Recommended:{" "}
                              {rec.recommendedStaff} staff • Avg: {rec.avgOrders} orders
                            </div>
                            <p style={{ margin: 0, color: "#AAA", fontSize: "0.85rem" }}>
                              {rec.recommendation}
                            </p>
                          </div>

                          <div
                            style={{
                              backgroundColor:
                                rec.priority === "high"
                                  ? "#FF444420"
                                  : rec.priority === "medium"
                                    ? "#FF980020"
                                    : "#4CAF5020",
                              color:
                                rec.priority === "high"
                                  ? "#FF4444"
                                  : rec.priority === "medium"
                                    ? "#FF9800"
                                    : "#4CAF50",
                              padding: "0.5rem 1rem",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            {rec.priority.toUpperCase()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </ManagerOnly>
    </DashboardLayout>
  );
}
