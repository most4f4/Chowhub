// src/pages/[restaurantUsername]/dashboard/sales-analytics/menu-performance/index.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { apiFetch } from "@/lib/api";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FiPieChart, FiDollarSign, FiShoppingBag, FiStar, FiChevronDown, FiTrendingUp, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import AnalyticsBackButton from "@/components/AnalyticsBackButton";

export default function MenuPerformancePage() {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  // State for menu performance data
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [leastSellingItems, setLeastSellingItems] = useState([]);
  const [profitabilityData, setProfitabilityData] = useState([]);
  const [foodCostData, setFoodCostData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const loadMenuPerformanceData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }).toString();

      const response = await apiFetch(`/analytics/menu-performance?${params}`);

      setTopSellingItems(response.topSellingItems || []);
      setLeastSellingItems(response.leastSellingItems || []);
      setProfitabilityData(response.profitability || []);
      setFoodCostData(response.foodCost || []);

    } catch (err) {
      console.error("Failed to load menu performance analytics:", err);
      toast.error("Failed to load menu performance analytics");
      setTopSellingItems([]);
      setLeastSellingItems([]);
      setProfitabilityData([]);
      setFoodCostData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      loadMenuPerformanceData();
    }
  }, [router.isReady, dateRange]); 

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
            <FiPieChart style={{ color: "#E91E63" }} /> 
            Menu Performance Analytics
          </h1>

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
                  onClick={loadMenuPerformanceData}
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#666" : "#E91E63", 
                    borderColor: loading ? "#666" : "#E91E63",
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
                  borderTop: "4px solid #E91E63", 
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginBottom: "1rem",
                }}
              />
              <p>Loading menu performance data...</p>
              <style jsx>
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
              {/* Summary Cards for Menu Performance */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <SummaryCard
                  icon={<FiShoppingBag />}
                  label="Total Menu Items Sold"
                  value={topSellingItems.reduce((acc, item) => acc + item.quantitySold, 0)} 
                  color="#E91E63"
                  subtext={`${dateRange.startDate} to ${dateRange.endDate}`}
                />
                 <SummaryCard
                  icon={<FiDollarSign />}
                  label="Total Menu Revenue"
                  value={`$${profitabilityData.reduce((acc, item) => acc + item.totalRevenue, 0).toFixed(2)}`} 
                  color="#00BCD4"
                  subtext={`Gross revenue from menu sales`}
                />
                 <SummaryCard
                  icon={<FiTrendingUp />}
                  label="Average Food Cost %"
                  value={`${foodCostData.length > 0 ? (foodCostData.reduce((acc, item) => acc + item.foodCostPercentage, 0) / foodCostData.length).toFixed(1) : 0}%`} 
                  color="#4CAF50"
                  subtext={`Across all menu items`}
                />
                 <SummaryCard
                  icon={<FiStar />}
                  label="Most Profitable Item"
                  value={profitabilityData.length > 0 ? profitabilityData.reduce((max, item) => max.grossProfit > item.grossProfit ? max : item).name : "N/A"} 
                  color="#FF9800"
                  subtext={profitabilityData.length > 0 ? `$${profitabilityData.reduce((max, item) => max.grossProfit > item.grossProfit ? max : item).grossProfit.toFixed(2)} gross profit` : ""}
                />
              </div>

              {/* Top Selling Items Section */}
            {topSellingItems.length > 0 && (
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
                📈 Top-Selling Items
                </h3>
                <div
                style={{
                    backgroundColor: "#1E1E2F",
                    borderRadius: 8,
                    padding: "1.5rem",
                    border: "1px solid #3A3A4A",
                }}
                >
             
                {topSellingItems.map((item, index) => (
                    <div key={item._id} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.8rem 1rem",
                    marginBottom: "0.5rem",
                    backgroundColor: "#252538",
                    borderRadius: 6,
                    border: `1px solid ${index === 0 ? "#FFD70020" : "#E91E6320"}`,
                    }}>
                    <div style={{display: "flex", alignItems: "center", gap: "0.8rem"}}>
                        <span style={{color: "#E91E63", fontWeight: "bold"}}>{index + 1}.</span>
                        <p style={{margin: 0, color: "#FFF", fontSize: "1.1rem"}}>{item.name}</p>
                    </div>
                    <p style={{margin: 0, color: "#CCC", fontSize: "1rem"}}>{item.quantitySold} sold</p>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* Least Selling Items Section */}
            {leastSellingItems.length > 0 && (
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
                📉 Least-Selling Items
                </h3>
                <div
                style={{
                    backgroundColor: "#1E1E2F",
                    borderRadius: 8,
                    padding: "1.5rem",
                    border: "1px solid #3A3A4A",
                }}
                >
                {leastSellingItems.map((item, index) => (
                    <div key={item._id} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.8rem 1rem",
                    marginBottom: "0.5rem",
                    backgroundColor: "#252538",
                    borderRadius: 6,
                    border: `1px solid #66339920`, 
                    }}>
                    <div style={{display: "flex", alignItems: "center", gap: "0.8rem"}}>
                        <span style={{color: "#663399", fontWeight: "bold"}}>{index + 1}.</span>
                        <p style={{margin: 0, color: "#FFF", fontSize: "1.1rem"}}>{item.name}</p>
                    </div>
                    <p style={{margin: 0, color: "#CCC", fontSize: "1rem"}}>{item.quantitySold} sold</p>
                    </div>
                ))}
                </div>
            </div>
            )}

              {/* Menu Item Profitability Table */}
              {profitabilityData.length > 0 && (
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
                    💰 Menu Item Profitability
                  </h3>
                  <div
                    style={{
                      backgroundColor: "#1E1E2F",
                      borderRadius: 8,
                      padding: "1.5rem",
                      border: "1px solid #3A3A4A",
                      overflowX: "auto" 
                    }}
                  >
                    {/* Placeholder for Profitability Table */}
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #3A3A4A" }}>
                          <th style={{ padding: "0.8rem", textAlign: "left", color: "#FFF" }}>Menu Item</th>
                          <th style={{ padding: "0.8rem", textAlign: "right", color: "#FFF" }}>Revenue</th>
                          <th style={{ padding: "0.8rem", textAlign: "right", color: "#FFF" }}>Ingredient Cost</th>
                          <th style={{ padding: "0.8rem", textAlign: "right", color: "#FFF" }}>Gross Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profitabilityData.map((item) => (
                          <tr key={item._id} style={{ borderBottom: "1px solid #2A2A3A" }}>
                            <td style={{ padding: "0.8rem", color: "#CCC" }}>{item.name}</td>
                            <td style={{ padding: "0.8rem", textAlign: "right", color: "#FFF" }}>${item.totalRevenue.toFixed(2)}</td>
                            <td style={{ padding: "0.8rem", textAlign: "right", color: "#FFF" }}>${item.totalIngredientCost.toFixed(2)}</td>
                            <td style={{ padding: "0.8rem", textAlign: "right", color: item.grossProfit >= 0 ? "#4CAF50" : "#F44336", fontWeight: "bold" }}>
                              ${item.grossProfit.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Food Cost Percentage Table */}
              {foodCostData.length > 0 && (
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
                    🍽️ Food Cost Percentage
                  </h3>
                  <div
                    style={{
                      backgroundColor: "#1E1E2F",
                      borderRadius: 8,
                      padding: "1.5rem",
                      border: "1px solid #3A3A4A",
                      overflowX: "auto" 
                    }}
                  >
                    {/* Placeholder for Food Cost Percentage Table */}
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #3A3A4A" }}>
                          <th style={{ padding: "0.8rem", textAlign: "left", color: "#FFF" }}>Menu Item</th>
                          <th style={{ padding: "0.8rem", textAlign: "right", color: "#FFF" }}>Ingredient Cost</th>
                          <th style={{ padding: "0.8rem", textAlign: "right", color: "#FFF" }}>Selling Price</th>
                          <th style={{ padding: "0.8rem", textAlign: "right", color: "#FFF" }}>Food Cost %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {foodCostData.map((item) => (
                          <tr key={item._id} style={{ borderBottom: "1px solid #2A2A3A" }}>
                            <td style={{ padding: "0.8rem", color: "#CCC" }}>{item.name}</td>
                            <td style={{ padding: "0.8rem", textAlign: "right", color: "#FFF" }}>${item.totalIngredientCost.toFixed(2)}</td>
                            <td style={{ padding: "0.8rem", textAlign: "right", color: "#FFF" }}>${item.totalRevenue.toFixed(2)}</td>
                            <td style={{ padding: "0.8rem", textAlign: "right", color: item.foodCostPercentage <= 30 ? "#4CAF50" : item.foodCostPercentage <= 40 ? "#FF9800" : "#F44336", fontWeight: "bold" }}>
                              {item.foodCostPercentage.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}


              {topSellingItems.length === 0 && profitabilityData.length === 0 && foodCostData.length === 0 && (
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
                  <h4 style={{ color: "#FFF", marginBottom: "1rem" }}>No Menu Performance Data Found</h4>
                  <p style={{ color: "#CCC", marginBottom: "1.5rem" }}>
                    No sales data available for menu items in the selected date range.
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
                      backgroundColor: "#E91E63", 
                      borderColor: "#E91E63",
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