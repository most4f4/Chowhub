// src/pages/[restaurantUsername]/dashboard/sales-analytics/index.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { apiFetch } from "@/lib/api";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FiUser, FiDollarSign, FiShoppingCart, FiTrendingUp, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import AnalyticsBackButton from "@/components/AnalyticsBackButton";

export default function SalesAnalyticsPage() {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days ago
    endDate: new Date().toISOString().split("T")[0], // Today
  });

  const loadSalesData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }).toString();

      const response = await apiFetch(`/analytics/sales-by-staff?${params}`);
      setSalesData(response.salesByStaff || []);
      setTotalSales(response.totalSales || 0);
      setTotalOrders(response.totalOrders || 0);
    } catch (err) {
      console.error("Failed to load sales analytics:", err);
      toast.error("Failed to load sales analytics");
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      loadSalesData();
    }
  }, [router.isReady]);

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const SummaryCard = ({ icon, label, value, color, subtext }) => (
    <div
      style={{
        backgroundColor: "#1E1E2F",
        borderRadius: 8,
        padding: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        border: `2px solid ${color}20`,
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 25px ${color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
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
      <div>
        <h3 style={{ margin: 0, color: "#FFF", fontSize: "1.8rem", fontWeight: 600 }}>{value}</h3>
        <p style={{ margin: 0, color: "#CCC", fontSize: "0.9rem" }}>{label}</p>
        {subtext && <p style={{ margin: 0, color: "#888", fontSize: "0.8rem" }}>{subtext}</p>}
      </div>
    </div>
  );

  const StaffSalesCard = ({ staff, rank }) => {
    const avgOrderValue = staff.totalOrders > 0 ? staff.totalSales / staff.totalOrders : 0;
    const isTopPerformer = rank === 1;

    return (
      <div
        style={{
          backgroundColor: "#1E1E2F",
          borderRadius: 8,
          padding: "1.5rem",
          border: isTopPerformer ? "2px solid #FFD700" : "1px solid #3A3A4A",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#252538";
          e.currentTarget.style.borderColor = "#4CAF50";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#1E1E2F";
          e.currentTarget.style.borderColor = isTopPerformer ? "#FFD700" : "#3A3A4A";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {isTopPerformer && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "#FFD700",
              color: "#000",
              padding: "0.5rem 1rem",
              borderBottomLeftRadius: 8,
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            🏆 TOP PERFORMER
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <div
            style={{
              backgroundColor: rank <= 3 ? "#FFD70020" : "#4CAF5020",
              borderRadius: "50%",
              padding: "0.8rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: rank <= 3 ? "#FFD700" : "#4CAF50",
              position: "relative",
            }}
          >
            <FiUser size={24} />
            <div
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                backgroundColor: rank <= 3 ? "#FFD700" : "#4CAF50",
                color: "#000",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              {rank}
            </div>
          </div>
          <div>
            <h4 style={{ margin: 0, color: "#FFF", fontSize: "1.2rem" }}>
              {staff.staffInfo?.firstName} {staff.staffInfo?.lastName}
            </h4>
            <p style={{ margin: 0, color: "#CCC", fontSize: "0.9rem" }}>
              @{staff.staffInfo?.username} • {staff.staffInfo?.role}
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <FiDollarSign style={{ color: "#4CAF50" }} />
              <span style={{ color: "#CCC", fontSize: "0.9rem" }}>Total Sales</span>
            </div>
            <p style={{ margin: 0, color: "#FFF", fontSize: "1.4rem", fontWeight: 600 }}>
              ${staff.totalSales.toFixed(2)}
            </p>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <FiShoppingCart style={{ color: "#2196F3" }} />
              <span style={{ color: "#CCC", fontSize: "0.9rem" }}>Orders</span>
            </div>
            <p style={{ margin: 0, color: "#FFF", fontSize: "1.4rem", fontWeight: 600 }}>
              {staff.totalOrders}
            </p>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <FiTrendingUp style={{ color: "#FF9800" }} />
              <span style={{ color: "#CCC", fontSize: "0.9rem" }}>Avg Order</span>
            </div>
            <p style={{ margin: 0, color: "#FFF", fontSize: "1.4rem", fontWeight: 600 }}>
              ${avgOrderValue.toFixed(2)}
            </p>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <FiCalendar style={{ color: "#9C27B0" }} />
              <span style={{ color: "#CCC", fontSize: "0.9rem" }}>Last Order</span>
            </div>
            <p style={{ margin: 0, color: "#FFF", fontSize: "0.9rem" }}>
              {staff.lastOrderDate ? new Date(staff.lastOrderDate).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>

        {/* Performance Bar */}
        <div style={{ marginTop: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ color: "#CCC", fontSize: "0.8rem" }}>Performance Score</span>
            <span style={{ color: "#4CAF50", fontSize: "0.8rem", fontWeight: 600 }}>
              {salesData.length > 0
                ? Math.round(
                    (staff.totalSales / Math.max(...salesData.map((s) => s.totalSales))) * 100,
                  )
                : 0}
              %
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "6px",
              backgroundColor: "#3A3A4A",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width:
                  salesData.length > 0
                    ? `${(staff.totalSales / Math.max(...salesData.map((s) => s.totalSales))) * 100}%`
                    : "0%",
                height: "100%",
                backgroundColor: rank <= 3 ? "#FFD700" : "#4CAF50",
                borderRadius: 3,
                transition: "width 1s ease-in-out",
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const getTopPerformer = () => {
    if (salesData.length === 0) return null;
    return salesData.reduce((top, current) =>
      current.totalSales > top.totalSales ? current : top,
    );
  };

  const topPerformer = getTopPerformer();

  return (
    <DashboardLayout>
      <ManagerOnly>
        <div style={{ padding: "1rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <AnalyticsBackButton />
          </div>
          <h1
            style={{
              color: "#FFF",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <FiTrendingUp style={{ color: "#4CAF50" }} />
            Sales Performance by Staff
          </h1>

          {/* Date Range Filter */}
          <div
            style={{
              backgroundColor: "#1E1E2F",
              padding: "1.5rem",
              borderRadius: 8,
              marginBottom: "2rem",
              border: "1px solid #3A3A4A",
            }}
          >
            <h5
              style={{
                color: "#FFF",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FiCalendar />
              Date Range Filter
            </h5>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={{ color: "#CCC" }}>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => handleDateChange("startDate", e.target.value)}
                    style={{
                      backgroundColor: "#2A2A3A",
                      border: "1px solid #3A3A4A",
                      color: "#FFF",
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={{ color: "#CCC" }}>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => handleDateChange("endDate", e.target.value)}
                    style={{
                      backgroundColor: "#2A2A3A",
                      border: "1px solid #3A3A4A",
                      color: "#FFF",
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4} style={{ display: "flex", alignItems: "end" }}>
                <Button
                  onClick={loadSalesData}
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#666" : "#4CAF50",
                    borderColor: loading ? "#666" : "#4CAF50",
                    width: "100%",
                  }}
                >
                  {loading ? "Loading..." : "Apply Filter"}
                </Button>
              </Col>
            </Row>
          </div>

          {loading ? (
            <div
              style={{
                textAlign: "center",
                color: "#FFF",
                padding: "4rem",
                backgroundColor: "#1E1E2F",
                borderRadius: 8,
                border: "1px solid #3A3A4A",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  width: "40px",
                  height: "40px",
                  border: "4px solid #3A3A4A",
                  borderTop: "4px solid #4CAF50",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginBottom: "1rem",
                }}
              />
              <p>Loading sales data...</p>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <SummaryCard
                  icon={<FiDollarSign />}
                  label="Total Sales"
                  value={`$${totalSales.toFixed(2)}`}
                  color="#4CAF50"
                  subtext={`${dateRange.startDate} to ${dateRange.endDate}`}
                />
                <SummaryCard
                  icon={<FiShoppingCart />}
                  label="Total Orders"
                  value={totalOrders}
                  color="#2196F3"
                  subtext={`Across all staff members`}
                />
                <SummaryCard
                  icon={<FiUser />}
                  label="Active Staff"
                  value={salesData.length}
                  color="#FF9800"
                  subtext="Staff with orders"
                />
                {topPerformer && (
                  <SummaryCard
                    icon={<FiTrendingUp />}
                    label="Top Performer"
                    value={`${topPerformer.staffInfo?.firstName} ${topPerformer.staffInfo?.lastName}`}
                    color="#9C27B0"
                    subtext={`$${topPerformer.totalSales.toFixed(2)} in sales`}
                  />
                )}
              </div>

              {/* Leaderboard Section */}
              {salesData.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                  <h3
                    style={{
                      color: "#FFF",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    🏆 Sales Leaderboard
                  </h3>
                  <div
                    style={{
                      backgroundColor: "#1E1E2F",
                      borderRadius: 8,
                      padding: "1.5rem",
                      border: "1px solid #3A3A4A",
                    }}
                  >
                    {salesData
                      .sort((a, b) => b.totalSales - a.totalSales)
                      .slice(0, 3)
                      .map((staff, index) => {
                        const rank = index + 1;
                        const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
                        const medals = ["🥇", "🥈", "🥉"];

                        return (
                          <div
                            key={staff.staffId}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "1rem",
                              marginBottom: index < 2 ? "1rem" : 0,
                              backgroundColor: "#252538",
                              borderRadius: 6,
                              border: `2px solid ${medalColors[index]}20`,
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                              <div style={{ fontSize: "1.5rem" }}>{medals[index]}</div>
                              <div>
                                <h4 style={{ margin: 0, color: "#FFF", fontSize: "1.1rem" }}>
                                  {staff.staffInfo?.firstName} {staff.staffInfo?.lastName}
                                </h4>
                                <p style={{ margin: 0, color: "#CCC", fontSize: "0.9rem" }}>
                                  @{staff.staffInfo?.username} • {staff.staffInfo?.role}
                                </p>
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <p
                                style={{
                                  margin: 0,
                                  color: medalColors[index],
                                  fontSize: "1.3rem",
                                  fontWeight: 600,
                                }}
                              >
                                ${staff.totalSales.toFixed(2)}
                              </p>
                              <p style={{ margin: 0, color: "#CCC", fontSize: "0.9rem" }}>
                                {staff.totalOrders} orders
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Staff Performance Cards */}
              {salesData.length > 0 ? (
                <div>
                  <h3
                    style={{
                      color: "#FFF",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    📊 Individual Staff Performance
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                      gap: "1.5rem",
                    }}
                  >
                    {salesData
                      .sort((a, b) => b.totalSales - a.totalSales) // Sort by highest sales first
                      .map((staff, index) => (
                        <StaffSalesCard key={staff.staffId} staff={staff} rank={index + 1} />
                      ))}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: "#1E1E2F",
                    padding: "3rem",
                    borderRadius: 8,
                    textAlign: "center",
                    border: "1px solid #3A3A4A",
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
                  <h4 style={{ color: "#FFF", marginBottom: "1rem" }}>No Sales Data Found</h4>
                  <p style={{ color: "#CCC", marginBottom: "1.5rem" }}>
                    No orders were placed by staff members in the selected date range.
                  </p>
                  <Button
                    onClick={() => {
                      setDateRange({
                        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0],
                        endDate: new Date().toISOString().split("T")[0],
                      });
                    }}
                    style={{
                      backgroundColor: "#4CAF50",
                      borderColor: "#4CAF50",
                    }}
                  >
                    Try Last 90 Days
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </ManagerOnly>
    </DashboardLayout>
  );
}
