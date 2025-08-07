import DashboardLayout from "@/components/DashboardLayout";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Dropdown, DropdownButton, Form, Spinner, Container, Row, Col } from "react-bootstrap";
import NotificationPopSmall from "@/components/NotificationPopSmall";
export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDropDown, setSelectedDropDown] = useState("All");
  const [unreadFilter, setUnreadFilter] = useState(false);
  useEffect(() => {
    getNotifications();
  }, []);
  const getNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/notification");
      setNotifications(res.notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };
  const filteredNotifications = notifications.filter((n) => {
    const matchesType =
      selectedDropDown === "All" || n.from?.toLowerCase() === selectedDropDown.toLowerCase();
    const matchesUnread = !unreadFilter || !n.seen;
    return matchesType && matchesUnread;
  });
  return (
    <DashboardLayout>
      <Container className="mt-4">
        <Row className="mb-3 align-items-center">
          <Col md="auto">
            <h3>Notifications</h3>
          </Col>
          <Col md="auto">
            <DropdownButton
              variant="outline-secondary"
              size="sm"
              title={selectedDropDown}
              onSelect={(eventKey) => {
                if (eventKey === "1") setSelectedDropDown("All");
                else if (eventKey === "2") setSelectedDropDown("System");
              }}
            >
              <Dropdown.Item eventKey="1">All</Dropdown.Item>
              <Dropdown.Item eventKey="2">System</Dropdown.Item>
            </DropdownButton>
          </Col>
          <Col md="auto">
            <Form.Check
              type="checkbox"
              label="Unread Only"
              checked={unreadFilter}
              onChange={(e) => setUnreadFilter(e.target.checked)}
            />
          </Col>
        </Row>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="secondary" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div
            className="text-center"
            style={{
              color: "#FFFFFF",
            }}
          >
            No notifications to show
          </div>
        ) : (
          filteredNotifications.map((n, idx) => (
            <NotificationPopSmall
              key={idx}
              from={n.from}
              message={n.message}
              timestamp={n.timestamp}
              seen={n.seen}
              type={n.type}
              notificationId={n._id}
            />
          ))
        )}
      </Container>
    </DashboardLayout>
  );
}
