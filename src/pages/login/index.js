import { useSetAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "@/store/atoms";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Top from "@/components/Top";
import { Header } from "@/components/Header";
import { Form, Button, Container, Card, Row, Col, Spinner } from "react-bootstrap";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff, FiUser, FiLock, FiArrowRight, FiShield } from "react-icons/fi";
import styles from "./style.module.css";

export default function LoginPage() {
  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);
  const router = useRouter();

  // Enhanced state management
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRemember = localStorage.getItem("rememberMe") === "true";

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setRememberMe(storedRemember);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("rememberMe");
      }
    }
    setIsInitializing(false);
  }, [setToken, setUser]);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isInitializing && token && user?.restaurantUsername) {
      router.replace(`/${user.restaurantUsername}/dashboard`);
    }
  }, [token, user, router, isInitializing]);

  // Show loading state while initializing
  if (isInitializing || (token && user?.restaurantUsername)) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f0f23",
        }}
      >
        <div style={{ textAlign: "center", color: "#fff" }}>
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  // Enhanced form validation
  const validateForm = (formData) => {
    const errors = {};

    if (!formData.username || formData.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters long";
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    return errors;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors({});

    const formData = Object.fromEntries(new FormData(e.target));

    // Client-side validation
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const tokenToStore = res.token;
      setToken(tokenToStore);
      setUser(res.user);

      // Enhanced storage with remember me functionality
      if (rememberMe) {
        localStorage.setItem("token", tokenToStore);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("rememberMe", "true");
      } else {
        // Use sessionStorage for temporary storage
        sessionStorage.setItem("token", tokenToStore);
        sessionStorage.setItem("user", JSON.stringify(res.user));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("rememberMe");
      }

      toast.success(`Welcome back, ${res.user.firstName}!`);
      router.push(`/${res.user.restaurantUsername}/dashboard`);
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
      setFormErrors({ general: err.message || "Login failed" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Top />
      <Header title="Welcome Back to ChowHub" image="/images/waitress.jpg" />

      <div
        style={{
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg={5} md={7} sm={9}>
              {/* Enhanced Login Card */}
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
                      🍽️
                    </div>
                    <h2 style={{ color: "#fff", fontWeight: "600", marginBottom: "0.5rem" }}>
                      Sign In
                    </h2>
                    <p style={{ color: "#adb5bd", fontSize: "0.9rem" }}>
                      Access your restaurant dashboard
                    </p>
                  </div>

                  {/* General Error Alert */}
                  {formErrors.general && (
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
                      <FiShield style={{ marginRight: "0.5rem" }} />
                      {formErrors.general}
                    </div>
                  )}

                  <Form onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#e9ecef", fontWeight: "500" }}>
                        <FiUser style={{ marginRight: "0.5rem" }} />
                        Username
                      </Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          name="username"
                          className={styles.loginInput}
                          required
                          placeholder="Enter your username"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: formErrors.username
                              ? "2px solid #f44336"
                              : "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "8px",
                            color: "#fff",
                            padding: "12px 16px",
                            fontSize: "1rem",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#2196F3";
                            e.target.style.boxShadow = "0 0 0 3px rgba(33, 150, 243, 0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                      {formErrors.username && (
                        <div style={{ color: "#f44336", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                          {formErrors.username}
                        </div>
                      )}
                    </Form.Group>

                    {/* Password Field */}
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "#e9ecef", fontWeight: "500" }}>
                        <FiLock style={{ marginRight: "0.5rem" }} />
                        Password
                      </Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          name="password"
                          className={styles.loginInput}
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Enter your password"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: formErrors.password
                              ? "2px solid #f44336"
                              : "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "8px",
                            color: "#fff",
                            padding: "12px 16px",
                            paddingRight: "50px",
                            fontSize: "1rem",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#2196F3";
                            e.target.style.boxShadow = "0 0 0 3px rgba(33, 150, 243, 0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            color: "#adb5bd",
                            cursor: "pointer",
                            padding: "4px",
                          }}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {formErrors.password && (
                        <div style={{ color: "#f44336", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                          {formErrors.password}
                        </div>
                      )}
                    </Form.Group>

                    {/* Remember Me & Forgot Password */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        label="Remember me"
                        style={{ color: "#adb5bd" }}
                      />
                      <Link
                        href="/forgot-password"
                        style={{
                          color: "#2196F3",
                          textDecoration: "none",
                          fontSize: "0.9rem",
                        }}
                        onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                        onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
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
                        if (!isLoading) {
                          e.target.style.backgroundColor = "#157347";
                          e.target.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#198754";
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <FiArrowRight />
                        </>
                      )}
                    </Button>
                  </Form>

                  {/* Additional Options */}
                  <div
                    className="text-center mt-4 pt-3"
                    style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
                  >
                    <p style={{ color: "#adb5bd", marginBottom: "0.5rem" }}>
                      Don&apos;t have an account?
                    </p>
                    <Link
                      href="/create-restaurant"
                      style={{
                        color: "#4CAF50",
                        textDecoration: "none",
                        fontWeight: "500",
                      }}
                      onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                      onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                    >
                      Create a new restaurant account
                    </Link>
                  </div>
                </Card.Body>
              </Card>

              {/* Trust Indicators */}
              <div className="text-center mt-4">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "2rem",
                    color: "#6c757d",
                    fontSize: "0.85rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FiShield />
                    Secure Login
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    🔒 SSL Encrypted
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    ⚡ Fast & Reliable
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
