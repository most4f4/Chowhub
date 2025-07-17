import React from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import {
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiBox,
  FiPieChart,
  FiTrendingUp,
  FiBarChart,
  FiActivity,
} from "react-icons/fi";

export default function AnalyticsDashboard() {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  const analyticsOptions = [
    {
      title: "Sales Performance by Staff",
      description: "Track individual staff sales performance, rankings, and targets",
      icon: <FiUsers size={48} />,
      color: "#4CAF50",
      path: "sales-analytics/staff-performance",
      stats: "Top performers, sales rankings, commission tracking",
    },
    {
      title: "Peak Hour Analysis",
      description: "Analyze busy hours, customer flow patterns, and staffing optimization",
      icon: <FiClock size={48} />,
      color: "#2196F3",
      path: "sales-analytics/peak-hours",
      stats: "Hour-by-hour breakdown, daily patterns, weekly trends",
    },
    {
      title: "Order Completion Time",
      description: "Monitor order processing speed, kitchen efficiency, and service times",
      icon: <FiCheckCircle size={48} />,
      color: "#FF9800",
      path: "sales-analytics/completion-time",
      stats: "Average completion time, bottlenecks, efficiency metrics",
    },
    {
      title: "Inventory Threshold Performance",
      description: "Track inventory levels, stock-outs, and reorder performance",
      icon: <FiBox size={48} />,
      color: "#9C27B0",
      path: "sales-analytics/inventory-performance",
      stats: "Stock levels, threshold alerts, waste analysis",
    },
    {
      title: "Menu Performance Analytics",
      description: "Analyze menu item popularity, profitability, and customer preferences",
      icon: <FiPieChart size={48} />,
      color: "#E91E63",
      path: "sales-analytics/menu-performance",
      stats: "Best sellers, profit margins, seasonal trends",
    },
    {
      title: "Revenue & Growth Analytics",
      description: "Track overall revenue trends, growth patterns, and financial insights",
      icon: <FiTrendingUp size={48} />,
      color: "#00BCD4",
      path: "sales-analytics/revenue-growth",
      stats: "Monthly growth, YoY comparison, profit trends",
    },
  ];

  const AnalyticsCard = ({ option }) => (
    <div
      onClick={() => router.push(`/${restaurantUsername}/dashboard/${option.path}`)}
      style={{
        backgroundColor: "#1E1E2F",
        borderRadius: 16,
        padding: "2rem",
        border: `2px solid ${option.color}20`,
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        minHeight: "280px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = `0 20px 40px ${option.color}30`;
        e.currentTarget.style.borderColor = option.color;
        e.currentTarget.style.backgroundColor = "#252538";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = `${option.color}20`;
        e.currentTarget.style.backgroundColor = "#1E1E2F";
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: `${option.color}10`,
          opacity: 0.5,
        }}
      />

      {/* Icon */}
      <div
        style={{
          backgroundColor: `${option.color}20`,
          borderRadius: "50%",
          padding: "1.5rem",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: option.color,
          marginBottom: "1.5rem",
          alignSelf: "flex-start",
        }}
      >
        {option.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3
          style={{
            margin: 0,
            color: "#FFF",
            fontSize: "1.4rem",
            fontWeight: 600,
            marginBottom: "1rem",
            lineHeight: "1.3",
          }}
        >
          {option.title}
        </h3>

        <p
          style={{
            margin: 0,
            color: "#CCC",
            fontSize: "1rem",
            marginBottom: "1.5rem",
            lineHeight: "1.5",
          }}
        >
          {option.description}
        </p>

        <div
          style={{
            backgroundColor: `${option.color}15`,
            padding: "0.75rem 1rem",
            borderRadius: 8,
            border: `1px solid ${option.color}30`,
          }}
        >
          <p
            style={{
              margin: 0,
              color: option.color,
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            📊 {option.stats}
          </p>
        </div>
      </div>

      {/* Arrow Icon */}
      <div
        style={{
          position: "absolute",
          bottom: "1.5rem",
          right: "1.5rem",
          color: option.color,
          fontSize: "1.5rem",
          opacity: 0.7,
        }}
      >
        →
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <ManagerOnly>
        <div style={{ padding: "1.5rem" }}>
          {/* Header */}
          <div style={{ marginBottom: "3rem", textAlign: "center" }}>
            <h1
              style={{
                color: "#FFF",
                fontSize: "2.5rem",
                fontWeight: 700,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <FiBarChart style={{ color: "#4CAF50" }} />
              Analytics Dashboard
            </h1>
            <p
              style={{
                color: "#CCC",
                fontSize: "1.1rem",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              Comprehensive insights into your restaurant's performance. Choose an analytics
              category to dive into detailed reports and metrics.
            </p>
          </div>

          {/* Quick Stats Bar */}
          <div
            style={{
              backgroundColor: "#1E1E2F",
              borderRadius: 12,
              padding: "1.5rem",
              marginBottom: "3rem",
              border: "1px solid #3A3A4A",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#4CAF50",
                  fontSize: "2rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <FiActivity style={{ marginRight: "0.5rem" }} />6
              </div>
              <p style={{ color: "#CCC", margin: 0 }}>Analytics Categories</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#2196F3",
                  fontSize: "2rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                📈 Live
              </div>
              <p style={{ color: "#CCC", margin: 0 }}>Real-time Data</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#FF9800",
                  fontSize: "2rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                🎯 Smart
              </div>
              <p style={{ color: "#CCC", margin: 0 }}>AI-Powered Insights</p>
            </div>
          </div>

          {/* Analytics Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            {analyticsOptions.map((option, index) => (
              <AnalyticsCard key={index} option={option} />
            ))}
          </div>

          {/* Footer Note */}
          <div
            style={{
              backgroundColor: "#1E1E2F",
              borderRadius: 12,
              padding: "1.5rem",
              border: "1px solid #3A3A4A",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#CCC", margin: 0, fontSize: "0.95rem" }}>
              💡 <strong>Pro Tip:</strong> Analytics data is updated in real-time. Use date filters
              and comparison tools available in each section for deeper insights.
            </p>
          </div>
        </div>
      </ManagerOnly>
    </DashboardLayout>
  );
}
