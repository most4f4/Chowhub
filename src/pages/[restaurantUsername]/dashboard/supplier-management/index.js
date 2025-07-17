import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { Card, Button } from "react-bootstrap";
import {
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiAlertTriangle,
  FiTarget,
  FiActivity,
} from "react-icons/fi";

export default function SupplierManagement() {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  return (
    <DashboardLayout>
      <ManagerOnly>
        <div style={{ padding: "1rem" }}>
          <h1
            style={{
              color: "#FFF",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <FiCheckCircle style={{ color: "#FF9800" }} />
            Supplier Management
          </h1>

          {/* Coming Soon Card */}
          <Card
            style={{ backgroundColor: "#1E1E2F", border: "2px solid #FF9800", textAlign: "center" }}
          >
            <Card.Body style={{ padding: "4rem 2rem" }}>
              <div style={{ fontSize: "4rem", marginBottom: "2rem" }}>
                <FiClock style={{ color: "#FF9800" }} />
              </div>

              <h2 style={{ color: "#FFF", marginBottom: "1rem" }}>Coming Soon!</h2>

              <p
                style={{
                  color: "#CCC",
                  fontSize: "1.1rem",
                  marginBottom: "2rem",
                  maxWidth: "600px",
                  margin: "0 auto 2rem",
                }}
              >
                Supplier management features are under development. Stay tuned for updates on how
                you can manage your suppliers effectively.
              </p>

              {/* Feature Preview */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#252538",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #3A3A4A",
                  }}
                >
                  <div style={{ color: "#4CAF50", fontSize: "1.5rem", marginBottom: "1rem" }}>
                    <FiTarget />
                  </div>
                  <h5 style={{ color: "#FFF", marginBottom: "0.5rem" }}>Order History & Trends</h5>
                  <p style={{ color: "#CCC", fontSize: "0.9rem", margin: 0 }}>
                    Analyze supplier order frequency, costs, and trends to make informed decisions.
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "#252538",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #3A3A4A",
                  }}
                >
                  <div style={{ color: "#2196F3", fontSize: "1.5rem", marginBottom: "1rem" }}>
                    <FiTrendingUp />
                  </div>
                  <h5 style={{ color: "#FFF", marginBottom: "0.5rem" }}>Delivery Issue Tracking</h5>
                  <p style={{ color: "#CCC", fontSize: "0.9rem", margin: 0 }}>
                    Log late deliveries or quality issues to monitor supplier performance.
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "#252538",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #3A3A4A",
                  }}
                >
                  <div style={{ color: "#FF4444", fontSize: "1.5rem", marginBottom: "1rem" }}>
                    <FiAlertTriangle />
                  </div>
                  <h5 style={{ color: "#FFF", marginBottom: "0.5rem" }}>Procurement Workflow</h5>
                  <p style={{ color: "#CCC", fontSize: "0.9rem", margin: 0 }}>
                    Streamline purchase requests, approvals, and order placements from a single
                    dashboard.
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "#252538",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #3A3A4A",
                  }}
                >
                  <div style={{ color: "#9C27B0", fontSize: "1.5rem", marginBottom: "1rem" }}>
                    <FiActivity />
                  </div>
                  <h5 style={{ color: "#FFF", marginBottom: "0.5rem" }}>Kitchen Efficiency</h5>
                  <p style={{ color: "#CCC", fontSize: "0.9rem", margin: 0 }}>
                    Analyze kitchen performance and staff efficiency metrics
                  </p>
                </div>
              </div>

              <Button
                onClick={() => router.push(`/${restaurantUsername}/dashboard/sales-analytics`)}
                style={{
                  backgroundColor: "#FF9800",
                  borderColor: "#FF9800",
                  padding: "0.75rem 2rem",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                }}
              >
                Back to Analytics Dashboard
              </Button>
            </Card.Body>
          </Card>
        </div>
      </ManagerOnly>
    </DashboardLayout>
  );
}
