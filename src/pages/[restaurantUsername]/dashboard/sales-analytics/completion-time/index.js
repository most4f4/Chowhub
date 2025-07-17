// src/pages/[restaurantUsername]/dashboard/sales-analytics/completion-time/index.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { apiFetch } from "@/lib/api";
import AnalyticsBackButton from "@/components/AnalyticsBackButton";

export default function CompletionTimeAnalysis() {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  const [completionData, setCompletionData] = useState({
    completionStats: [],
    dailyAverages: [],
    insights: {},
    recommendations: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const loadCompletionData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        timeframe: selectedTimeframe,
      }).toString();

      const response = await apiFetch(`/analytics/completion-time?${params}`);
      setCompletionData(response);
    } catch (err) {
      console.error("Failed to load completion time analytics:", err);
      setCompletionData({
        completionStats: [],
        dailyAverages: [],
        insights: {},
        recommendations: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      loadCompletionData();
    }
  }, [router.isReady, selectedTimeframe]);

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  const getPerformanceColor = (completionTime, avgTime) => {
    if (completionTime <= avgTime * 0.8) return "#4CAF50"; // Fast - Green
    if (completionTime <= avgTime * 1.2) return "#FF9800"; // Average - Orange
    return "#FF4444"; // Slow - Red
  };

  const insights = completionData.insights || {};

  return (
    <DashboardLayout>
      <ManagerOnly>
        <div style={{ padding: "2rem", color: "#FFF" }}>
          <div style={{ marginBottom: "2rem" }}>
            <AnalyticsBackButton />
          </div>
          <h1 style={{ marginBottom: "2rem", fontSize: "2rem" }}>
            ⏱️ Order Completion Time Analytics
          </h1>

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
                  onClick={loadCompletionData}
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#666" : "#FF9800",
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
                  borderTop: "4px solid #FF9800",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 1rem",
                }}
              />
              <p>Analyzing completion times...</p>
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
                {/* Average Completion Time */}
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
                      ⏱️
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.8rem" }}>
                        {insights.avgCompletionTime
                          ? formatDuration(insights.avgCompletionTime)
                          : "N/A"}
                      </h3>
                      <p style={{ margin: 0, color: "#CCC" }}>Average Completion</p>
                      <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                        From order to finish
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fastest Order */}
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
                      🚀
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.8rem" }}>
                        {insights.fastestTime ? formatDuration(insights.fastestTime) : "N/A"}
                      </h3>
                      <p style={{ margin: 0, color: "#CCC" }}>Fastest Order</p>
                      <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                        Best performance
                      </p>
                    </div>
                  </div>
                </div>

                {/* Slowest Order */}
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "2px solid #FF444420",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        backgroundColor: "#FF444420",
                        padding: "1rem",
                        borderRadius: "50%",
                        fontSize: "1.5rem",
                      }}
                    >
                      🐌
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.8rem" }}>
                        {insights.slowestTime ? formatDuration(insights.slowestTime) : "N/A"}
                      </h3>
                      <p style={{ margin: 0, color: "#CCC" }}>Slowest Order</p>
                      <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                        Needs attention
                      </p>
                    </div>
                  </div>
                </div>

                {/* Efficiency Score */}
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
                      📊
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.8rem" }}>
                        {insights.efficiencyScore ? `${insights.efficiencyScore}%` : "N/A"}
                      </h3>
                      <p style={{ margin: 0, color: "#CCC" }}>Efficiency Score</p>
                      <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                        Kitchen performance
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Averages Chart */}
              <div
                style={{
                  backgroundColor: "#1E1E2F",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                  border: "1px solid #3A3A4A",
                }}
              >
                <h3 style={{ marginBottom: "1rem" }}>📈 Daily Average Completion Times</h3>

                {!completionData.dailyAverages || completionData.dailyAverages.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#CCC" }}>
                    <p>No daily average data available</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    {completionData.dailyAverages.map((day, index) => {
                      const maxTime = Math.max(
                        ...completionData.dailyAverages.map((d) => d.avgCompletionTime),
                      );
                      const percentage = maxTime > 0 ? (day.avgCompletionTime / maxTime) * 100 : 0;

                      return (
                        <div key={index} style={{ marginBottom: "1rem" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>
                              {(() => {
                                const [year, month, dayNum] = day.date.split("-"); // Changed 'day' to 'dayNum'
                                const date = new Date(
                                  parseInt(year),
                                  parseInt(month) - 1,
                                  parseInt(dayNum), // Use 'dayNum' here too
                                );
                                return date.toLocaleDateString([], {
                                  weekday: "long",
                                  month: "short",
                                  day: "numeric",
                                });
                              })()}
                            </span>
                            <div style={{ display: "flex", gap: "1rem" }}>
                              <span style={{ color: "#FF9800", fontSize: "0.9rem" }}>
                                {formatDuration(day.avgCompletionTime)}
                              </span>
                              <span style={{ color: "#4CAF50", fontSize: "0.9rem" }}>
                                {day.orderCount} orders
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
                                backgroundColor:
                                  percentage > 80
                                    ? "#FF4444"
                                    : percentage > 60
                                      ? "#FF9800"
                                      : "#4CAF50",
                                borderRadius: "6px",
                                transition: "width 1s ease-in-out",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Individual Order Analysis */}
              <div
                style={{
                  backgroundColor: "#1E1E2F",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                  border: "1px solid #3A3A4A",
                }}
              >
                <h3 style={{ marginBottom: "1rem" }}>📋 Individual Order Performance</h3>

                {!completionData.completionStats || completionData.completionStats.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#CCC" }}>
                    <p>No completed orders found for analysis</p>
                    <p style={{ fontSize: "0.9rem", color: "#888" }}>
                      Orders need both creation and completion timestamps to appear in this
                      analysis.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "1rem" }}>
                    {completionData.completionStats.map((order, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: "#252538",
                          padding: "1rem",
                          borderRadius: "8px",
                          border: "1px solid #3A3A4A",
                          display: "grid",
                          gridTemplateColumns: "auto 1fr auto auto",
                          gap: "1rem",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: getPerformanceColor(
                              order.completionTimeMinutes,
                              insights.avgCompletionTime,
                            ),
                          }}
                        />

                        <div>
                          <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                            Order #{order.orderId?.slice(-6) || "Unknown"}
                          </div>
                          <div style={{ color: "#CCC", fontSize: "0.9rem" }}>
                            {order.itemCount} items • ${order.total?.toFixed(2)} • {order.status}
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                            {formatDuration(order.completionTimeMinutes)}
                          </div>
                          <div style={{ color: "#888", fontSize: "0.8rem" }}>completion time</div>
                        </div>

                        <div style={{ textAlign: "right", color: "#888", fontSize: "0.8rem" }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                          <br />
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommendations */}
              {completionData.recommendations && completionData.recommendations.length > 0 && (
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #3A3A4A",
                  }}
                >
                  <h3 style={{ marginBottom: "1rem" }}>💡 Performance Recommendations</h3>

                  <div style={{ display: "grid", gap: "1rem" }}>
                    {completionData.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: "#252538",
                          padding: "1rem",
                          borderRadius: "8px",
                          border: "1px solid #3A3A4A",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            marginBottom: "0.5rem",
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
                          <div style={{ fontWeight: 600, color: "#FFF" }}>{rec.title}</div>
                        </div>
                        <p style={{ margin: 0, color: "#CCC", fontSize: "0.9rem" }}>
                          {rec.description}
                        </p>
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

// import { useRouter } from "next/router";
// import DashboardLayout from "@/components/DashboardLayout";
// import { ManagerOnly } from "@/components/Protected";
// import { Card, Button } from "react-bootstrap";
// import {
//   FiCheckCircle,
//   FiClock,
//   FiTrendingUp,
//   FiAlertTriangle,
//   FiTarget,
//   FiActivity,
// } from "react-icons/fi";

// export default function CompletionTimeAnalysis() {
//   const router = useRouter();
//   const { restaurantUsername } = router.query;

//   return (
//     <DashboardLayout>
//       <ManagerOnly>
//         <div style={{ padding: "1rem" }}>
//           <h1
//             style={{
//               color: "#FFF",
//               marginBottom: "2rem",
//               display: "flex",
//               alignItems: "center",
//               gap: "1rem",
//             }}
//           >
//             <FiCheckCircle style={{ color: "#FF9800" }} />
//             Order Completion Time Analytics
//           </h1>

//           {/* Coming Soon Card */}
//           <Card
//             style={{ backgroundColor: "#1E1E2F", border: "2px solid #FF9800", textAlign: "center" }}
//           >
//             <Card.Body style={{ padding: "4rem 2rem" }}>
//               <div style={{ fontSize: "4rem", marginBottom: "2rem" }}>
//                 <FiClock style={{ color: "#FF9800" }} />
//               </div>

//               <h2 style={{ color: "#FFF", marginBottom: "1rem" }}>Coming Soon!</h2>

//               <p
//                 style={{
//                   color: "#CCC",
//                   fontSize: "1.1rem",
//                   marginBottom: "2rem",
//                   maxWidth: "600px",
//                   margin: "0 auto 2rem",
//                 }}
//               >
//                 Order Completion Time Analytics will provide comprehensive insights into your
//                 kitchen efficiency, order processing speed, and service optimization opportunities.
//               </p>

//               {/* Feature Preview */}
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//                   gap: "1.5rem",
//                   marginBottom: "2rem",
//                   textAlign: "left",
//                 }}
//               >
//                 <div
//                   style={{
//                     backgroundColor: "#252538",
//                     padding: "1.5rem",
//                     borderRadius: "8px",
//                     border: "1px solid #3A3A4A",
//                   }}
//                 >
//                   <div style={{ color: "#4CAF50", fontSize: "1.5rem", marginBottom: "1rem" }}>
//                     <FiTarget />
//                   </div>
//                   <h5 style={{ color: "#FFF", marginBottom: "0.5rem" }}>Average Completion Time</h5>
//                   <p style={{ color: "#CCC", fontSize: "0.9rem", margin: 0 }}>
//                     Track average order processing time from placement to completion
//                   </p>
//                 </div>

//                 <div
//                   style={{
//                     backgroundColor: "#252538",
//                     padding: "1.5rem",
//                     borderRadius: "8px",
//                     border: "1px solid #3A3A4A",
//                   }}
//                 >
//                   <div style={{ color: "#2196F3", fontSize: "1.5rem", marginBottom: "1rem" }}>
//                     <FiTrendingUp />
//                   </div>
//                   <h5 style={{ color: "#FFF", marginBottom: "0.5rem" }}>Performance Trends</h5>
//                   <p style={{ color: "#CCC", fontSize: "0.9rem", margin: 0 }}>
//                     Monitor completion time trends across different time periods
//                   </p>
//                 </div>

//                 <div
//                   style={{
//                     backgroundColor: "#252538",
//                     padding: "1.5rem",
//                     borderRadius: "8px",
//                     border: "1px solid #3A3A4A",
//                   }}
//                 >
//                   <div style={{ color: "#FF4444", fontSize: "1.5rem", marginBottom: "1rem" }}>
//                     <FiAlertTriangle />
//                   </div>
//                   <h5 style={{ color: "#FFF", marginBottom: "0.5rem" }}>Bottleneck Detection</h5>
//                   <p style={{ color: "#CCC", fontSize: "0.9rem", margin: 0 }}>
//                     Identify process bottlenecks and optimization opportunities
//                   </p>
//                 </div>

//                 <div
//                   style={{
//                     backgroundColor: "#252538",
//                     padding: "1.5rem",
//                     borderRadius: "8px",
//                     border: "1px solid #3A3A4A",
//                   }}
//                 >
//                   <div style={{ color: "#9C27B0", fontSize: "1.5rem", marginBottom: "1rem" }}>
//                     <FiActivity />
//                   </div>
//                   <h5 style={{ color: "#FFF", marginBottom: "0.5rem" }}>Kitchen Efficiency</h5>
//                   <p style={{ color: "#CCC", fontSize: "0.9rem", margin: 0 }}>
//                     Analyze kitchen performance and staff efficiency metrics
//                   </p>
//                 </div>
//               </div>

//               <Button
//                 onClick={() => router.push(`/${restaurantUsername}/dashboard/sales-analytics`)}
//                 style={{
//                   backgroundColor: "#FF9800",
//                   borderColor: "#FF9800",
//                   padding: "0.75rem 2rem",
//                   fontSize: "1.1rem",
//                   fontWeight: 600,
//                 }}
//               >
//                 Back to Analytics Dashboard
//               </Button>
//             </Card.Body>
//           </Card>
//         </div>
//       </ManagerOnly>
//     </DashboardLayout>
//   );
// }
