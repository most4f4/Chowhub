// src/pages/[restaurantUsername]/dashboard/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import Protected from "@/components/Protected";
import { useAtomValue } from "jotai";
import { userAtom } from "@/store/atoms";
import { apiFetch } from "@/lib/api";
import {
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiBox,
  FiStar,
  FiActivity,
  FiCalendar,
  FiTarget,
  FiRefreshCw,
  FiEye,
  FiBarChart2,
  FiBell,
  FiBook,
} from "react-icons/fi";
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
import { Line, Bar, Doughnut, Radar } from "react-chartjs-2";

// Register the new components:
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

export default function OverviewPage() {
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const isManager = user?.role === "manager";

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/analytics/dashboard-overview");
      setData(response);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.restaurantId) {
      loadDashboardData();
      // Auto-refresh every 60 seconds
      const interval = setInterval(loadDashboardData, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const SummaryCard = ({ icon, label, value, color, subtext, onClick, trend }) => (
    <div
      style={{
        backgroundColor: "#1E1E2F",
        borderRadius: 12,
        padding: "1.5rem",
        border: `2px solid ${color}20`,
        transition: "all 0.3s ease",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = `0 8px 32px ${color}30`;
          e.currentTarget.style.borderColor = color;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = `${color}20`;
        }
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: `${color}10`,
          opacity: 0.5,
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
        <div
          style={{
            backgroundColor: `${color}20`,
            borderRadius: "50%",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color,
            fontSize: "1.5rem",
          }}
        >
          {icon}
        </div>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: 0,
              color: "#FFF",
              fontSize: "1.8rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {value}
            {trend && (
              <span
                style={{
                  fontSize: "0.8rem",
                  color: trend > 0 ? "#4CAF50" : trend < 0 ? "#F44336" : "#FF9800",
                }}
              >
                {trend > 0 ? "↗" : trend < 0 ? "↘" : "→"} {Math.abs(trend)}%
              </span>
            )}
          </h3>
          <p style={{ margin: "0.25rem 0 0", color: "#CCC", fontSize: "0.9rem" }}>{label}</p>
          {subtext && (
            <p style={{ margin: "0.25rem 0 0", color: "#888", fontSize: "0.8rem" }}>{subtext}</p>
          )}
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ icon, title, description, onClick, color }) => (
    <div
      style={{
        backgroundColor: "#1E1E2F",
        borderRadius: 12,
        padding: "1.5rem",
        border: "1px solid #3A3A4A",
        cursor: "pointer",
        transition: "all 0.3s ease",
        height: "100%",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#252538";
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#1E1E2F";
        e.currentTarget.style.borderColor = "#3A3A4A";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          color: color,
          fontSize: "2rem",
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <h4 style={{ color: "#FFF", textAlign: "center", marginBottom: "0.5rem" }}>{title}</h4>
      <p style={{ color: "#CCC", textAlign: "center", fontSize: "0.9rem", margin: 0 }}>
        {description}
      </p>
    </div>
  );

  const AlertCard = ({ type, items, color, icon, title }) => (
    <div
      style={{
        backgroundColor: "#1E1E2F",
        borderRadius: 12,
        padding: "1.5rem",
        border: `2px solid ${color}30`,
        marginBottom: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <div
          style={{
            backgroundColor: `${color}20`,
            borderRadius: "50%",
            padding: "0.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color,
            fontSize: "1.2rem",
          }}
        >
          {icon}
        </div>
        <h4 style={{ margin: 0, color: "#FFF" }}>{title}</h4>
        <span
          style={{
            backgroundColor: `${color}20`,
            color: color,
            padding: "0.25rem 0.75rem",
            borderRadius: 12,
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          {items.length}
        </span>
      </div>

      {items.length > 0 ? (
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "0.5rem",
                backgroundColor: "#252538",
                borderRadius: 6,
                marginBottom: "0.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#FFF", fontSize: "0.9rem" }}>{item.name}</span>
              <span style={{ color: "#CCC", fontSize: "0.8rem" }}>
                {type === "orders"
                  ? `${item.timeAgo} min ago`
                  : `${item.quantity}/${item.threshold} ${item.unit}`}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#888", textAlign: "center", margin: 0 }}>All good! 👍</p>
      )}
    </div>
  );

  if (!user || loading) {
    return (
      <Protected>
        <DashboardLayout>
          <div
            style={{
              backgroundColor: "#121212",
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#FFF",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  border: "3px solid #333",
                  borderTop: "3px solid #4CAF50",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 1rem",
                }}
              />
              <p>Loading Dashboard...</p>
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
          </div>
        </DashboardLayout>
      </Protected>
    );
  }

  // Chart configurations for managers
  const salesTrendData = data?.managerData?.dailyTrend
    ? {
        labels: data.managerData.dailyTrend.map((day) => {
          const date = new Date(day.date);
          return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }),
        datasets: [
          {
            label: "Daily Sales ($)",
            data: data.managerData.dailyTrend.map((day) => day.sales),
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      }
    : null;

  const salesTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Sales Trend (Last 7 Days)",
        color: "#FFF",
        font: { size: 14 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#CCC",
          callback: function (value) {
            return "$" + value;
          },
        },
        grid: { color: "#3A3A4A" },
      },
      x: {
        ticks: { color: "#CCC" },
        grid: { color: "#3A3A4A" },
      },
    },
  };

  const popularItemsData = data?.managerData?.popularItems?.length
    ? {
        labels: data.managerData.popularItems.map((item) => item.name),
        datasets: [
          {
            data: data.managerData.popularItems.map((item) => item.quantity),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
          },
        ],
      }
    : null;

  return (
    <Protected>
      <DashboardLayout>
        <div style={{ padding: "1.5rem", color: "#FFF" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: 700 }}>
                {isManager ? "📊 Management Overview" : "👋 Staff Dashboard"}
              </h1>
              <p style={{ color: "#CCC", margin: "0.5rem 0 0", fontSize: "1.1rem" }}>
                {isManager
                  ? "Real-time insights and analytics"
                  : `Welcome back, ${user.firstName}!`}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {lastUpdated && (
                <div style={{ color: "#888", fontSize: "0.9rem" }}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              <button
                onClick={loadDashboardData}
                style={{
                  backgroundColor: "#4CAF50",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.75rem 1rem",
                  color: "#FFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FiRefreshCw /> Refresh
              </button>
            </div>
          </div>

          {/* Manager Dashboard */}
          {isManager && data?.managerData && (
            <>
              {/* Key Metrics */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <SummaryCard
                  icon={<FiDollarSign />}
                  label="Today's Sales"
                  value={`$${data.managerData.salesMetrics.todaySales}`}
                  color="#4CAF50"
                  subtext={`${data.managerData.salesMetrics.todayOrders} orders`}
                  onClick={() =>
                    router.push(`/${router.query.restaurantUsername}/dashboard/sales-analytics`)
                  }
                />
                <SummaryCard
                  icon={<FiTrendingUp />}
                  label="This Week"
                  value={`$${data.managerData.salesMetrics.weekSales}`}
                  color="#2196F3"
                  subtext={`${data.managerData.salesMetrics.weekOrders} orders`}
                  onClick={() =>
                    router.push(
                      `/${router.query.restaurantUsername}/dashboard/sales-analytics/staff-performance`,
                    )
                  }
                />
                <SummaryCard
                  icon={<FiShoppingCart />}
                  label="Average Order"
                  value={`$${data.managerData.salesMetrics.avgOrderValue}`}
                  color="#FF9800"
                  subtext="This week's average"
                />
                <SummaryCard
                  icon={<FiUsers />}
                  label="Top Staff"
                  value={data.managerData.topStaff[0]?.name || "N/A"}
                  color="#9C27B0"
                  subtext={
                    data.managerData.topStaff[0]
                      ? `$${data.managerData.topStaff[0].sales} sales`
                      : "No sales data"
                  }
                  onClick={() =>
                    router.push(
                      `/${router.query.restaurantUsername}/dashboard/sales-analytics/staff-performance`,
                    )
                  }
                />
              </div>

              {/* Charts Row */}
              {/* Expanded Charts Section */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2rem",
                  marginBottom: "2rem",
                }}
              >
                {/* Sales Trend Chart */}
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "1.5rem",
                    borderRadius: 12,
                    border: "1px solid #3A3A4A",
                  }}
                >
                  {salesTrendData ? (
                    <div style={{ height: "300px" }}>
                      <Line data={salesTrendData} options={salesTrendOptions} />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "300px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#888",
                      }}
                    >
                      <p>No sales data available</p>
                    </div>
                  )}
                </div>

                {/* Peak Hours Chart */}
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "1.5rem",
                    borderRadius: 12,
                    border: "1px solid #3A3A4A",
                  }}
                >
                  <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", color: "#FFF" }}>
                    Peak Hours This Week
                  </h3>
                  {data?.managerData?.peakHoursChart?.length > 0 ? (
                    <div style={{ height: "250px" }}>
                      <Bar
                        data={{
                          labels: Array.from({ length: 24 }, (_, i) =>
                            i === 0
                              ? "12 AM"
                              : i < 12
                                ? `${i} AM`
                                : i === 12
                                  ? "12 PM"
                                  : `${i - 12} PM`,
                          ),
                          datasets: [
                            {
                              label: "Orders",
                              data: Array.from({ length: 24 }, (_, hour) => {
                                const hourData = data.managerData.peakHoursChart.find(
                                  (h) => h._id === hour,
                                );
                                return hourData ? hourData.orderCount : 0;
                              }),
                              backgroundColor: "#2196F3",
                              borderColor: "#2196F3",
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: { color: "#CCC" },
                              grid: { color: "#3A3A4A" },
                            },
                            x: {
                              ticks: {
                                color: "#CCC",
                                maxRotation: 45,
                              },
                              grid: { color: "#3A3A4A" },
                            },
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "250px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#888",
                      }}
                    >
                      <p>No peak hour data</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Second Row of Charts */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2rem",
                  marginBottom: "2rem",
                }}
              >
                {/* Staff Performance Radar Chart */}
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "1.5rem",
                    borderRadius: 12,
                    border: "1px solid #3A3A4A",
                  }}
                >
                  <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", color: "#FFF" }}>
                    Staff Performance This Week
                  </h3>
                  {data?.managerData?.staffPerformanceChart?.length > 0 ? (
                    <div style={{ height: "250px" }}>
                      <Radar
                        data={{
                          labels: data.managerData.staffPerformanceChart.map(
                            (staff) => staff.name.split(" ")[0],
                          ),
                          datasets: [
                            {
                              label: "Sales",
                              data: data.managerData.staffPerformanceChart.map(
                                (staff) => staff.sales,
                              ),
                              backgroundColor: "rgba(76, 175, 80, 0.2)",
                              borderColor: "#4CAF50",
                              pointBackgroundColor: "#4CAF50",
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                          },
                          scales: {
                            r: {
                              angleLines: { color: "#3A3A4A" },
                              grid: { color: "#3A3A4A" },
                              pointLabels: { color: "#CCC", font: { size: 10 } },
                              ticks: { display: false },
                            },
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "250px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#888",
                      }}
                    >
                      <p>No staff performance data</p>
                    </div>
                  )}
                </div>

                {/* Menu Performance Doughnut Chart */}
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "1.5rem",
                    borderRadius: 12,
                    border: "1px solid #3A3A4A",
                  }}
                >
                  <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", color: "#FFF" }}>
                    Top Menu Items (Last 7 Days - by Quantity)
                  </h3>
                  {data?.managerData?.menuPerformanceChart?.length > 0 ? (
                    <div style={{ height: "250px" }}>
                      <Doughnut
                        data={{
                          labels: data.managerData.menuPerformanceChart.map((item) => item.name),
                          datasets: [
                            {
                              data: data.managerData.menuPerformanceChart.map(
                                (item) => item.quantity,
                              ),
                              backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#4BC0C0",
                                "#9966FF",
                                "#FF9F40",
                              ],
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "right",
                              labels: { color: "#CCC", font: { size: 10 } },
                            },
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "250px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#888",
                      }}
                    >
                      <p>No menu performance data</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Third Row - Completion Time Chart */}
              <div
                style={{
                  backgroundColor: "#1E1E2F",
                  padding: "1.5rem",
                  borderRadius: 12,
                  border: "1px solid #3A3A4A",
                  marginBottom: "2rem",
                }}
              >
                <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", color: "#FFF" }}>
                  Order Completion Times (Last 10 Orders) - Avg:{" "}
                  {data?.managerData?.completionTimeChart?.avgTime || 0} min
                </h3>
                {data?.managerData?.completionTimeChart?.times?.length > 0 ? (
                  <div style={{ height: "200px" }}>
                    <Bar
                      data={{
                        labels: data.managerData.completionTimeChart.times.map(
                          (_, index) => `Order ${index + 1}`,
                        ),
                        datasets: [
                          {
                            label: "Completion Time (minutes)",
                            data: data.managerData.completionTimeChart.times,
                            backgroundColor: data.managerData.completionTimeChart.times.map(
                              (time) =>
                                time <= data.managerData.completionTimeChart.avgTime * 0.8
                                  ? "#4CAF50"
                                  : time <= data.managerData.completionTimeChart.avgTime * 1.2
                                    ? "#FF9800"
                                    : "#F44336",
                            ),
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              color: "#CCC",
                              callback: function (value) {
                                return value + " min";
                              },
                            },
                            grid: { color: "#3A3A4A" },
                          },
                          x: {
                            ticks: { color: "#CCC" },
                            grid: { color: "#3A3A4A" },
                          },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#888",
                    }}
                  >
                    <p>No completion time data available</p>
                  </div>
                )}
              </div>

              {/* Top Staff Performance */}
              {data.managerData.topStaff?.length > 0 && (
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "1.5rem",
                    borderRadius: 12,
                    border: "1px solid #3A3A4A",
                    marginBottom: "2rem",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 1rem",
                      color: "#FFF",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    🏆 Top Performers This Week
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1rem",
                    }}
                  >
                    {data.managerData.topStaff.slice(0, 3).map((staff, index) => {
                      const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
                      const medals = ["🥇", "🥈", "🥉"];
                      return (
                        <div
                          key={index}
                          style={{
                            backgroundColor: "#252538",
                            padding: "1rem",
                            borderRadius: 8,
                            border: `2px solid ${colors[index]}30`,
                            textAlign: "center",
                          }}
                        >
                          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                            {medals[index]}
                          </div>
                          <h4 style={{ margin: 0, color: "#FFF", fontSize: "1.1rem" }}>
                            {staff.name}
                          </h4>
                          <p style={{ margin: "0.25rem 0", color: "#CCC", fontSize: "0.9rem" }}>
                            @{staff.username}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              marginTop: "0.5rem",
                            }}
                          >
                            <div>
                              <p style={{ margin: 0, color: colors[index], fontWeight: 600 }}>
                                ${staff.sales}
                              </p>
                              <p style={{ margin: 0, color: "#888", fontSize: "0.8rem" }}>Sales</p>
                            </div>
                            <div>
                              <p style={{ margin: 0, color: "#4CAF50", fontWeight: 600 }}>
                                {staff.orders}
                              </p>
                              <p style={{ margin: 0, color: "#888", fontSize: "0.8rem" }}>Orders</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Actions for Managers */}
              <div
                style={{
                  backgroundColor: "#1E1E2F",
                  padding: "1.5rem",
                  borderRadius: 12,
                  border: "1px solid #3A3A4A",
                  marginBottom: "2rem",
                }}
              >
                <h3 style={{ margin: "0 0 1rem", color: "#FFF" }}>⚡ Quick Actions</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  <QuickActionCard
                    icon={<FiBarChart2 />}
                    title="View Analytics"
                    description="Detailed sales & performance reports"
                    onClick={() =>
                      router.push(`/${router.query.restaurantUsername}/dashboard/sales-analytics`)
                    }
                    color="#4CAF50"
                  />
                  <QuickActionCard
                    icon={<FiUsers />}
                    title="Manage Staff"
                    description="Staff performance & user management"
                    onClick={() =>
                      router.push(`/${router.query.restaurantUsername}/dashboard/user-management`)
                    }
                    color="#2196F3"
                  />
                  <QuickActionCard
                    icon={<FiBox />}
                    title="Inventory"
                    description="Check stock levels & ingredients"
                    onClick={() =>
                      router.push(
                        `/${router.query.restaurantUsername}/dashboard/ingredient-management`,
                      )
                    }
                    color="#FF9800"
                  />
                  <QuickActionCard
                    icon={<FiBook />}
                    title="Menu Items"
                    description="Manage menu & pricing"
                    onClick={() =>
                      router.push(`/${router.query.restaurantUsername}/dashboard/menu-management`)
                    }
                    color="#9C27B0"
                  />
                </div>
              </div>
            </>
          )}

          {/* Staff Dashboard */}
          {!isManager && (
            <>
              {/* Staff Quick Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <SummaryCard
                  icon={<FiShoppingCart />}
                  label="Orders Today"
                  value={data?.staffData?.todayStats?.orderCount || 0}
                  color="#4CAF50"
                  subtext="Restaurant-wide"
                />
                <SummaryCard
                  icon={<FiClock />}
                  label="Avg Wait Time"
                  value={`${data?.staffData?.todayStats?.avgWaitTime || 0} min`}
                  color="#FF9800"
                  subtext="Current pending orders"
                />
                <SummaryCard
                  icon={<FiActivity />}
                  label="Pending Orders"
                  value={data?.alertCounts?.pendingOrders || 0}
                  color="#2196F3"
                  subtext="Need attention"
                  onClick={() =>
                    router.push(`/${router.query.restaurantUsername}/dashboard/ordering`)
                  }
                />
                <SummaryCard
                  icon={<FiAlertTriangle />}
                  label="Stock Alerts"
                  value={data?.alertCounts?.lowStock || 0}
                  color="#FF4444"
                  subtext="Low inventory items"
                />
              </div>

              {/* Staff Quick Actions */}
              <div
                style={{
                  backgroundColor: "#1E1E2F",
                  padding: "1.5rem",
                  borderRadius: 12,
                  border: "1px solid #3A3A4A",
                  marginBottom: "2rem",
                }}
              >
                <h3 style={{ margin: "0 0 1rem", color: "#FFF" }}>🚀 Quick Actions</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  <QuickActionCard
                    icon={<FiShoppingCart />}
                    title="Place Order"
                    description="Create new customer order"
                    onClick={() =>
                      router.push(`/${router.query.restaurantUsername}/dashboard/ordering`)
                    }
                    color="#4CAF50"
                  />
                  <QuickActionCard
                    icon={<FiBox />}
                    title="Order History"
                    description="View past customer orders"
                    onClick={() =>
                      router.push(`/${router.query.restaurantUsername}/dashboard/ordering/history`)
                    }
                    color="#FF9800"
                  />
                  <QuickActionCard
                    icon={<FiEye />}
                    title="Active Orders"
                    description="View pending & in-progress orders"
                    onClick={() =>
                      router.push(`/${router.query.restaurantUsername}/dashboard/ordering`)
                    }
                    color="#2196F3"
                  />
                  <QuickActionCard
                    icon={<FiBell />}
                    title="Notifications"
                    description="View recent alerts & updates"
                    onClick={() =>
                      router.push(
                        `/${router.query.restaurantUsername}/dashboard/notification-history`,
                      )
                    }
                    color="#9C27B0"
                  />
                </div>
              </div>

              {/* Recent Orders for Staff */}
              {data?.staffData?.recentOrders?.length > 0 && (
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "1.5rem",
                    borderRadius: 12,
                    border: "1px solid #3A3A4A",
                    marginBottom: "2rem",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 1rem",
                      color: "#FFF",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    📋 Your Recent Orders
                  </h3>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {data.staffData.recentOrders.map((order) => (
                      <div
                        key={order._id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "1rem",
                          backgroundColor: "#252538",
                          borderRadius: 8,
                          marginBottom: "0.5rem",
                          border: "1px solid #3A3A4A",
                        }}
                      >
                        <div>
                          <p style={{ margin: 0, color: "#FFF", fontWeight: 600 }}>
                            Order #{order._id.slice(-6)}
                          </p>
                          <p style={{ margin: "0.25rem 0 0", color: "#CCC", fontSize: "0.9rem" }}>
                            {order.itemCount} items •{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ margin: 0, color: "#4CAF50", fontWeight: 600 }}>
                            ${order.total.toFixed(2)}
                          </p>
                          <span
                            style={{
                              backgroundColor:
                                order.status === "fulfilled"
                                  ? "#4CAF5020"
                                  : order.status === "pending"
                                    ? "#FF980020"
                                    : "#F4433620",
                              color:
                                order.status === "fulfilled"
                                  ? "#4CAF50"
                                  : order.status === "pending"
                                    ? "#FF9800"
                                    : "#F44336",
                              padding: "0.25rem 0.5rem",
                              borderRadius: 4,
                              fontSize: "0.8rem",
                              textTransform: "capitalize",
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Unavailable Menu Items Alert for Staff */}
          {data?.unavailableMenuItems?.length > 0 && (
            <div
              style={{
                backgroundColor: "#1E1E2F",
                padding: "1.5rem",
                borderRadius: 12,
                border: "2px solid #FF980030",
                marginBottom: "2rem",
              }}
            >
              <h3
                style={{
                  margin: "0 0 1rem",
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                ⚠️ Unavailable Menu Items
              </h3>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {data.unavailableMenuItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "0.75rem",
                      backgroundColor: "#252538",
                      borderRadius: 6,
                      marginBottom: "0.5rem",
                      border: "1px solid #FF980030",
                    }}
                  >
                    <p style={{ margin: 0, color: "#FFF", fontWeight: 600 }}>
                      {item.itemName} ({item.variationName})
                    </p>
                    <p style={{ margin: "0.25rem 0 0", color: "#FF9800", fontSize: "0.8rem" }}>
                      Missing: {item.missingIngredients.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts Section (Both Manager and Staff) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isManager ? "1fr 1fr 1fr" : "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            {/* Pending Orders Alert */}
            <AlertCard
              type="orders"
              items={data?.pendingOrders || []}
              color="#FF9800"
              icon={<FiClock />}
              title="Pending Orders"
            />

            {/* Low Stock Alert */}
            <AlertCard
              type="stock"
              items={data?.lowStockIngredients || []}
              color="#F44336"
              icon={<FiAlertTriangle />}
              title="Critical Stock Items"
            />

            {/* Critical Stock Alert (Manager Only) */}
            {isManager && (
              <AlertCard
                type="stock"
                items={data?.criticalStockIngredients || []}
                color="#D32F2F"
                icon={<FiBox />}
                title="Out of Stock"
              />
            )}
          </div>

          {/* Recent Completed Orders (Manager Only) */}
          {isManager && data?.managerData?.recentCompletedOrders?.length > 0 && (
            <div
              style={{
                backgroundColor: "#1E1E2F",
                padding: "1.5rem",
                borderRadius: 12,
                border: "1px solid #3A3A4A",
                marginTop: "2rem",
              }}
            >
              <h3
                style={{
                  margin: "0 0 1rem",
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                ✅ Recently Completed Orders
              </h3>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {data.managerData.recentCompletedOrders.map((order) => (
                  <div
                    key={order._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.75rem 1rem",
                      backgroundColor: "#252538",
                      borderRadius: 6,
                      border: "1px solid #4CAF5030",
                    }}
                  >
                    <div>
                      <span style={{ color: "#FFF", fontWeight: 600 }}>
                        Order #{order._id.slice(-6)}
                      </span>
                      <span style={{ color: "#CCC", fontSize: "0.9rem", marginLeft: "1rem" }}>
                        by {order.placedBy?.firstName} {order.placedBy?.lastName}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ color: "#4CAF50", fontWeight: 600 }}>
                        ${order.total.toFixed(2)}
                      </span>
                      {order.completionTime && (
                        <span style={{ color: "#FF9800", fontSize: "0.8rem" }}>
                          {order.completionTime} min
                        </span>
                      )}
                      <span style={{ color: "#888", fontSize: "0.8rem" }}>
                        {new Date(order.finishedOn).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </Protected>
  );
}
