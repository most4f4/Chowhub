// pages/setup-password/index.js

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Header } from "../../components/Header";
import { motion } from "framer-motion";
import { Form, Button, Container, Card, Row, Col, Spinner } from "react-bootstrap";
import styles from "./setupPass.module.css";
import { toast } from "react-toastify";
import Top from "../../components/Top";
import { FiLock, FiEye, FiEyeOff, FiShield, FiCheck } from "react-icons/fi";

export default function SetupPasswordPage() {
  const router = useRouter();

  // State variables for password, token, errors, and validation state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const [formValidated, setFormValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenLoading, setIsTokenLoading] = useState(true);

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  // Must contain at least 1 uppercase, 1 lowercase, 1 digit, 1 special char, min 8 chars

  // Step 1: Extract token from URL and validate it via backend
  useEffect(() => {
    const tokenFromURL = router.query.token;

    if (tokenFromURL) {
      apiFetch("/auth/validate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenFromURL }),
      })
        .then(() => {
          setToken(tokenFromURL); // Save token if valid
          setTokenValid(true);
        })
        .catch(() => setTokenError("Invalid or expired token."))
        .finally(() => setIsTokenLoading(false));
    } else {
      setIsTokenLoading(false);
    }
  }, [router.query.token]);

  // Step 2: Submit new password to backend with the token
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;

    const validPassword = passwordRegex.test(password);
    const passwordsMatch = password === confirmPassword;

    if (!form.checkValidity() || !validPassword || !passwordsMatch) {
      e.stopPropagation();
      setFormValidated(true);
      setIsLoading(false);
      return;
    }

    try {
      const notification = await apiFetch("/notification/user-activation", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      const result = await apiFetch("/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      toast.success("🎉 You are all set. Ready to Login!", {
        position: "top-center",
        autoClose: 5000,
      });
      // Redirect to login page after successful setup
      router.push("/login");
    } catch (err) {
      console.error("❌ Submit error:", err);
      setSubmitError("Failed to set password.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while validating token
  if (isTokenLoading) {
    return (
      <>
        <Top />
        <Header title="🗝️ Set Your Password" image="/images/set-password.jpg" />
        <div
          style={{
            minHeight: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", color: "#6c757d" }}>
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3">Validating token...</p>
          </div>
        </div>
      </>
    );
  }

  // If token is invalid, show error
  if (!tokenValid) {
    return (
      <>
        <Top />
        <Header title="🗝️ Set Your Password" image="/images/set-password.jpg" />
        <div
          style={{
            paddingTop: "2rem",
            paddingBottom: "2rem",
          }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col lg={5} md={7} sm={9}>
                <Card
                  style={{
                    backgroundColor: "#343a40",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <Card.Body className="p-5 text-center">
                    <div
                      style={{
                        backgroundColor: "#f44336",
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
                      ❌
                    </div>
                    <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Invalid Token</h2>
                    <p style={{ color: "#adb5bd", marginBottom: "2rem" }}>
                      {tokenError || "The password reset link is invalid or has expired."}
                    </p>
                    <Button
                      onClick={() => router.push("/forgot-password")}
                      style={{
                        backgroundColor: "#198754",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 24px",
                        fontWeight: "600",
                      }}
                    >
                      Request New Reset Link
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }

  // Render password setup form after validation
  return (
    <>
      <Top />
      <Header title="🗝️ Set Your Password" image="/images/set-password.jpg" />

      <div
        style={{
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8} sm={10}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Enhanced Setup Password Card */}
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
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 1rem",
                          fontSize: "2rem",
                        }}
                      >
                        🗝️
                      </div>
                      <h2 style={{ color: "#fff", fontWeight: "600", marginBottom: "0.5rem" }}>
                        Set Your Password
                      </h2>
                      <p style={{ color: "#adb5bd", fontSize: "1rem" }}>
                        Create a secure password for your ChowHub account
                      </p>
                    </div>

                    {/* Submit Error Alert */}
                    {submitError && (
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
                        {submitError}
                      </div>
                    )}

                    <Form noValidate onSubmit={handleSubmit}>
                      {/* Password Requirements Info */}
                      <div
                        style={{
                          backgroundColor: "rgba(33, 150, 243, 0.05)",
                          border: "1px solid rgba(33, 150, 243, 0.2)",
                          borderRadius: "8px",
                          padding: "1rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        <h6 style={{ color: "#2196F3", marginBottom: "0.5rem" }}>
                          Password Requirements:
                        </h6>
                        <ul
                          style={{
                            color: "#adb5bd",
                            fontSize: "0.85rem",
                            margin: 0,
                            paddingLeft: "1.2rem",
                          }}
                        >
                          <li>At least 8 characters long</li>
                          <li>Include uppercase and lowercase letters</li>
                          <li>Include at least one number</li>
                          <li>Include at least one special character (@$!%*#?&)</li>
                        </ul>
                      </div>

                      {/* New Password Field */}
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#e9ecef", fontWeight: "500" }}>
                          <FiLock style={{ marginRight: "0.5rem" }} />
                          New Password
                        </Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Control
                            required
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            pattern={passwordRegex.source}
                            isInvalid={formValidated && !passwordRegex.test(password)}
                            isValid={formValidated && passwordRegex.test(password)}
                            className={styles.loginInput}
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                              border:
                                formValidated && !passwordRegex.test(password)
                                  ? "2px solid #f44336"
                                  : formValidated && passwordRegex.test(password)
                                    ? "2px solid #4CAF50"
                                    : "1px solid rgba(255, 255, 255, 0.2)",
                              borderRadius: "8px",
                              color: "#fff",
                              padding: "12px 16px",
                              paddingRight: "50px",
                              fontSize: "1rem",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#20c997";
                              e.target.style.boxShadow = "0 0 0 3px rgba(32, 201, 151, 0.1)";
                            }}
                            onBlur={(e) => {
                              const isValid = passwordRegex.test(password);
                              e.target.style.borderColor =
                                formValidated && !isValid
                                  ? "#f44336"
                                  : formValidated && isValid
                                    ? "#4CAF50"
                                    : "rgba(255, 255, 255, 0.2)";
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
                        <Form.Control.Feedback type="invalid">
                          Must be 8+ characters, include uppercase, lowercase, number, and symbol.
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Confirm Password Field */}
                      <Form.Group className="mb-4">
                        <Form.Label style={{ color: "#e9ecef", fontWeight: "500" }}>
                          <FiLock style={{ marginRight: "0.5rem" }} />
                          Confirm Password
                        </Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Control
                            required
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            isInvalid={formValidated && password !== confirmPassword}
                            isValid={
                              formValidated &&
                              confirmPassword.length > 0 &&
                              password === confirmPassword
                            }
                            className={styles.loginInput}
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                              border:
                                formValidated && password !== confirmPassword
                                  ? "2px solid #f44336"
                                  : formValidated &&
                                      confirmPassword.length > 0 &&
                                      password === confirmPassword
                                    ? "2px solid #4CAF50"
                                    : "1px solid rgba(255, 255, 255, 0.2)",
                              borderRadius: "8px",
                              color: "#fff",
                              padding: "12px 16px",
                              paddingRight: "50px",
                              fontSize: "1rem",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#20c997";
                              e.target.style.boxShadow = "0 0 0 3px rgba(32, 201, 151, 0.1)";
                            }}
                            onBlur={(e) => {
                              const passwordsMatch = password === confirmPassword;
                              e.target.style.borderColor =
                                formValidated && !passwordsMatch
                                  ? "#f44336"
                                  : formValidated && passwordsMatch && confirmPassword.length > 0
                                    ? "#4CAF50"
                                    : "rgba(255, 255, 255, 0.2)";
                              e.target.style.boxShadow = "none";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                        <Form.Control.Feedback type="invalid">
                          Passwords must match.
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Submit Button */}
                      <Button
                        variant="success"
                        type="submit"
                        disabled={isLoading}
                        style={{
                          width: "100%",
                          backgroundColor: "#198754",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px",
                          fontSize: "1.1rem",
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
                            Setting Password...
                          </>
                        ) : (
                          <>
                            <FiCheck />
                            Set Password
                          </>
                        )}
                      </Button>
                    </Form>

                    {/* Security Note */}
                    <div
                      className="text-center mt-4 pt-3"
                      style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
                    >
                      <p
                        style={{
                          color: "#6c757d",
                          fontSize: "0.85rem",
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <FiShield />
                        Your password is encrypted and secure
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
