// src/pages/[restaurantUsername]/dashboard/sales-analytics/peak-hours/index.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { apiFetch } from "@/lib/api";
import AnalyticsBackButton from "@/components/AnalyticsBackButton";

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
      // If API fails, show empty state instead of hardcoded data
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

  const insights = peakHourData.insights || {};

  return (
    <DashboardLayout>
      <ManagerOnly>
        <div style={{ padding: "2rem", color: "#FFF" }}>
          <div style={{ marginBottom: "2rem" }}>
            <AnalyticsBackButton />
          </div>
          <h1 style={{ marginBottom: "2rem", fontSize: "2rem" }}>🕐 Peak Hour Analysis</h1>

          {/* Simple Controls */}
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

              {/* Simple Heatmap */}
              <div
                style={{
                  backgroundColor: "#1E1E2F",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                  border: "1px solid #3A3A4A",
                }}
              >
                <h3 style={{ marginBottom: "1rem" }}>📊 24-Hour Activity Heatmap</h3>

                {peakHourData.hourlyStats.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#CCC" }}>
                    <p>No hourly data available for the selected period</p>
                    <p style={{ fontSize: "0.9rem", color: "#888" }}>
                      {peakHourData.hourlyStats.length === 0 && !loading
                        ? "This could be because you only have 3 orders in your database. Try adding more orders or selecting a different date range."
                        : ""}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {Array.from({ length: 24 }, (_, hour) => {
                      const hourData = peakHourData.hourlyStats.find((h) => h.hour === hour);
                      const orderCount = hourData?.orderCount || 0;
                      const revenue = hourData?.revenue || 0;
                      const maxOrders = Math.max(
                        ...peakHourData.hourlyStats.map((h) => h.orderCount),
                      );
                      const intensity = maxOrders > 0 ? (orderCount / maxOrders) * 100 : 0;

                      let backgroundColor = "#3A3A4A"; // Default gray
                      if (intensity > 80)
                        backgroundColor = "#FF4444"; // High
                      else if (intensity > 60)
                        backgroundColor = "#FF9800"; // Medium-High
                      else if (intensity > 40)
                        backgroundColor = "#FFC107"; // Medium
                      else if (intensity > 20)
                        backgroundColor = "#4CAF50"; // Low-Medium
                      else if (intensity > 0) backgroundColor = "#81C784"; // Low

                      return (
                        <div
                          key={hour}
                          style={{
                            minWidth: "60px",
                            height: "80px",
                            backgroundColor,
                            borderRadius: "8px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #555",
                            cursor: "pointer",
                          }}
                          title={`${getHourLabel(hour)}: ${orderCount} orders, ${revenue.toFixed(2)}`}
                        >
                          <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                            {getHourLabel(hour)}
                          </div>
                          <div style={{ fontSize: "0.7rem", marginTop: "4px" }}>
                            {orderCount} orders
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Daily Patterns */}
              <div
                style={{
                  backgroundColor: "#1E1E2F",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  border: "1px solid #3A3A4A",
                }}
              >
                <h3 style={{ marginBottom: "1rem" }}>📅 Daily Patterns</h3>

                {!peakHourData.dailyPatterns || peakHourData.dailyPatterns.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#CCC" }}>
                    <p>No daily pattern data available</p>
                    <p style={{ fontSize: "0.9rem", color: "#888" }}>
                      With only 3 orders, there may not be enough data to show meaningful daily
                      patterns. Try creating more test orders or selecting a wider date range.
                    </p>
                  </div>
                ) : (
                  <>
                    {peakHourData.dailyPatterns.map((day, index) => {
                      const maxOrders = Math.max(
                        ...peakHourData.dailyPatterns.map((d) => d.orderCount),
                      );
                      const percentage = maxOrders > 0 ? (day.orderCount / maxOrders) * 100 : 0;

                      return (
                        <div key={index} style={{ marginBottom: "1rem" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>{getDayName(day.dayOfWeek)}</span>
                            <div style={{ display: "flex", gap: "1rem" }}>
                              <span style={{ color: "#4CAF50", fontSize: "0.9rem" }}>
                                {day.orderCount} orders
                              </span>
                              <span style={{ color: "#FF9800", fontSize: "0.9rem" }}>
                                ${day.revenue.toFixed(2)}
                              </span>
                              <span style={{ color: "#2196F3", fontSize: "0.9rem" }}>
                                Avg: ${day.avgOrderValue.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div
                            style={{
                              width: "100%",
                              height: "12px",
                              backgroundColor: "#3A3A4A",
                              borderRadius: "6px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${percentage}%`,
                                height: "100%",
                                backgroundColor: index === 5 || index === 6 ? "#FF9800" : "#4CAF50", // Weekend highlighting
                                borderRadius: "6px",
                                transition: "width 1s ease-in-out",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </ManagerOnly>
    </DashboardLayout>
  );
}
