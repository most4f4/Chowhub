import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Header } from "@/components/Header";
import Top from "@/components/Top";
import styles from "../create-restaurant/createRes.module.css";
import { Form, Button, Container, Card, Row, Col, Alert } from "react-bootstrap";
import { useRouter } from "next/router";
import { FiMail, FiArrowLeft, FiHome, FiSend } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("idle");
    setError("");

    try {
      await apiFetch("/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <>
      <Top />
      <Header title="🔐 Forgot Password" image="/images/create-res-header.jpg" />

      <div
        style={{
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg={5} md={7} sm={9}>
              {/* Enhanced Forgot Password Card */}
              <Card
                style={{
                  backgroundColor: "#343a40",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Card.Body className="p-5">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div
                      style={{
                        backgroundColor: "#20c997",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1rem",
                        fontSize: "1.5rem",
                      }}
                    >
                      🔐
                    </div>
                    <h2 style={{ color: "#fff", fontWeight: "600", marginBottom: "0.5rem" }}>
                      Forgot Password
                    </h2>
                    <p style={{ color: "#adb5bd", fontSize: "0.9rem" }}>
                      Enter your email to receive a password reset link
                    </p>
                  </div>

                  {/* Success Alert */}
                  {status === "success" && (
                    <div
                      style={{
                        backgroundColor: "rgba(76, 175, 80, 0.1)",
                        border: "1px solid rgba(76, 175, 80, 0.3)",
                        borderRadius: "8px",
                        padding: "1rem",
                        marginBottom: "1.5rem",
                        color: "#4CAF50",
                      }}
                    >
                      ✅ If this email is registered, a reset link has been sent.
                    </div>
                  )}

                  {/* Error Alert */}
                  {status === "error" && (
                    <div
                      style={{
                        backgroundColor: "rgba(244, 67, 54, 0.1)",
                        border: "1px solid rgba(244, 67, 54, 0.3)",
                        borderRadius: "8px",
                        padding: "1rem",
                        marginBottom: "1.5rem",
                        color: "#f44336",
                      }}
                    >
                      ❌ {error}
                    </div>
                  )}

                  <Form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <Form.Group className="mb-4">
                      <Form.Label style={{ color: "#e9ecef", fontWeight: "500" }}>
                        <FiMail style={{ marginRight: "0.5rem" }} />
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        className={styles.loginInput}
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "8px",
                          color: "#fff",
                          padding: "12px 16px",
                          fontSize: "1rem",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#20c997";
                          e.target.style.boxShadow = "0 0 0 3px rgba(32, 201, 151, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </Form.Group>

                    {/* Submit Button */}
                    {status === "success" ? (
                      <Button
                        variant="primary"
                        onClick={() => router.push("/")}
                        style={{
                          width: "100%",
                          backgroundColor: "#2196F3",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px",
                          fontSize: "1rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#1976D2";
                          e.target.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#2196F3";
                          e.target.style.transform = "translateY(0)";
                        }}
                      >
                        <FiHome />
                        Go back to Home
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        style={{
                          width: "100%",
                          backgroundColor: "#198754",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px",
                          fontSize: "1rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#157347";
                          e.target.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#198754";
                          e.target.style.transform = "translateY(0)";
                        }}
                      >
                        <FiSend />
                        Send Reset Link
                      </Button>
                    )}
                  </Form>

                  {/* Navigation Links */}
                  <div
                    className="text-center mt-4 pt-3"
                    style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "2rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        variant="link"
                        onClick={() => router.push("/login")}
                        style={{
                          color: "#20c997",
                          textDecoration: "none",
                          fontWeight: "500",
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                        onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                        onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                      >
                        <FiArrowLeft size={14} />
                        Back to Login
                      </Button>

                      <Button
                        variant="link"
                        onClick={() => router.push("/create-restaurant")}
                        style={{
                          color: "#adb5bd",
                          textDecoration: "none",
                          fontWeight: "400",
                          padding: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.textDecoration = "underline";
                          e.target.style.color = "#20c997";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.textDecoration = "none";
                          e.target.style.color = "#adb5bd";
                        }}
                      >
                        Create Account
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Help Text */}
              <div className="text-center mt-4">
                <p
                  style={{
                    color: "#6c757d",
                    fontSize: "0.85rem",
                    margin: 0,
                  }}
                >
                  🔒 Password reset links expire in 24 hours for security
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
