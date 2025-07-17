import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { FaTimes, FaCheck, FaThumbtack, FaClipboardList, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import Style from "../menu-management/menuManage.module.css";
import Head from "next/head";

function timeSince(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + " hrs ago";
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + " mins ago";
  return "just now";
}

function getBorderColor(date) {
  const minutesPassed = Math.floor((new Date() - new Date(date)) / 60000);
  if (minutesPassed < 10) return "#4CAF50";
  if (minutesPassed < 20) return "#FFB74D";
  if (minutesPassed < 30) return "#FF8A65";
  if (minutesPassed < 40) return "#FF7043";
  return "#E53935";
}

export default function ActiveOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => {});
  const [confirmMessage, setConfirmMessage] = useState("");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const scrollContainerRef = useRef(null);

  const loadOrders = async () => {
    try {
      const res = await apiFetch("/order/active");
      setOrders(res);
    } catch (err) {
      toast.error("Failed to fetch active orders");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const askConfirm = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmModalOpen(true);
  };

  const handleFulfill = async (id) => {
    askConfirm("Are you sure you want to mark this order as fulfilled?", async () => {
      try {
        await apiFetch(`/order/${id}/complete`, { method: "PATCH" });
        toast.success("Order marked fulfilled");
        loadOrders();
      } catch {
        toast.error("Failed to mark fulfilled");
      }
    });
  };

  const handleCancel = async (id) => {
    askConfirm("Are you sure you want to cancel this order?", async () => {
      try {
        await apiFetch(`/order/${id}/cancel`, { method: "PATCH" });
        toast.success("Order cancelled");
        loadOrders();
      } catch {
        toast.error("Failed to cancel order");
      }
    });
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
      setTimeout(() => {
        setShowLeftArrow(container.scrollLeft > 0);
      }, 300);
    }
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" });
      setTimeout(() => {
        setShowLeftArrow(container.scrollLeft > 0);
      }, 300);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div style={{ padding: "1rem", minWidth: "0" }}>
        <h1 style={{ color: "#FFF", marginBottom: "1.5rem" }}>📋 Active Orders</h1>

        <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
          <div
            ref={scrollContainerRef}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "2rem",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              padding: "1rem 0",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              maxWidth: "100%",
            }}
            onScroll={() => {
              const container = scrollContainerRef.current;
              setShowLeftArrow(container.scrollLeft > 0);
            }}
          >
            {orders.map((order) => {
              const borderColor = getBorderColor(order.createdAt);
              return (
                <div
                  key={order._id}
                  style={{
                    background: "#3a3a4a",
                    color: "#eaeaea",
                    fontFamily: "'Patrick Hand', cursive",
                    width: "300px",
                    minHeight: "500px",
                    padding: "2rem 1.5rem 1.5rem",
                    border: `2px solid ${borderColor}`,
                    borderRadius: "10px",
                    boxShadow: `0 0 12px ${borderColor}`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                    scrollSnapAlign: "start",
                    transformOrigin: "center left",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%) rotate(-15deg)",
                      backgroundColor: "#c62828",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "26px",
                      height: "26px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
                      zIndex: 2,
                    }}
                  >
                    <FaThumbtack size={12} />
                  </div>

                  <div>
                    <h3 style={{ marginBottom: "0.5rem", fontSize: "1.25rem" }}>
                      Order #{order._id.slice(-4)}
                    </h3>
                    <div style={{ fontSize: "1.05rem", marginBottom: "0.75rem", opacity: 0.9 }}>
                      <strong>By:</strong> {order.placedBy?.username || "Unknown"} <br />
                      <strong>Placed:</strong>{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      ({timeSince(order.createdAt)})
                    </div>

                    <div style={{ borderTop: "1px dashed #888", margin: "0.5rem 0" }} />

                    <div style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
                      {order.orderLineItems.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                          <span>
                            • {item.quantity} x {item.name}{" "}
                            {item.variationName && <em style={{ fontWeight: 400, opacity: 0.8 }}>({item.variationName})</em>}
                          </span>
                          <span>${item.subTotal.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTop: "1px dashed #888", margin: "0.5rem 0" }} />

                    <div style={{ fontSize: "1rem", opacity: 0.9 }}>
                      <strong>Comment:</strong> {order.comment || "None"}
                    </div>
                  </div>

                  <div style={{ marginTop: "1.2rem", fontSize: "1rem" }}>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <strong>Subtotal:</strong> ${order.subtotal.toFixed(2)} <br />
                      <strong>Tax:</strong> ${order.tax.toFixed(2)} <br />
                      <strong>Total:</strong> ${order.total.toFixed(2)}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => handleCancel(order._id)}
                        style={{
                          background: "#d9534f",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 12px",
                          color: "#fff",
                          fontSize: "0.85rem",
                          fontFamily: "'Patrick Hand', cursive",
                          cursor: "pointer",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#c9302c")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#d9534f")}
                      >
                        <FaTimes /> Cancel
                      </button>

                      <button
                        onClick={() => handleFulfill(order._id)}
                        style={{
                          background: "#5cb85c",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 18px",
                          color: "#fff",
                          fontSize: "0.85rem",
                          fontFamily: "'Patrick Hand', cursive",
                          cursor: "pointer",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#4cae4c")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#5cb85c")}
                      >
                        <FaCheck /> Fulfill
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#444",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#555")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#444")}
            >
              <FaArrowLeft size={20} />
            </button>
          )}

          {orders.length > 4 && (
            <button
              onClick={scrollRight}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#444",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#555")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#444")}
            >
              <FaArrowRight size={20} />
            </button>
          )}
        </div>
      </div>

      <Modal
        contentClassName={Style.modalContent}
        centered
        show={confirmModalOpen}
        onHide={() => setConfirmModalOpen(false)}
      >
        <Modal.Header className={Style.modalHeader}>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body className={Style.modalBody}>
          <p>{confirmMessage}</p>
        </Modal.Body>
        <Modal.Footer className={Style.modalFooter}>
          <Button variant="secondary" onClick={() => setConfirmModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setConfirmModalOpen(false);
              confirmAction();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
}