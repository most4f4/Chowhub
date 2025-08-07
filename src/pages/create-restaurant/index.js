// src/pages/create-restaurant/index.js

import { useRouter } from "next/router";
import { apiFetch } from "@/lib/api";
import { useState, useEffect, useRef } from "react";
import { Form, Button, Col, Row, Container, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import styles from "./createRes.module.css";
import { toast } from "react-toastify";
import Top from "../../components/Top";
import { checkUniqueUserName } from "@/services/checkUsername";
import { FiUser, FiMail, FiMapPin, FiPhone, FiShield } from "react-icons/fi";

// This page allows a manager to create a new restaurant and their own manager account
export default function CreateRestaurant() {
  const router = useRouter();

  const [validated, setValidated] = useState(false);
  const [availableUsername, setAvailableUsername] = useState(null);
  const debouncer = useRef(null); // use debouncer to stop span ping endpoint when not needed

  // Holds warning messages to display if something goes wrong (e.g., duplicate email)
  const [warning, setWarning] = useState("");

  // State for form fields (restaurant and manager info)
  const [formData, setFormData] = useState({
    restaurantName: "",
    restaurantUserName: "",
    restaurantLocation: "",
    firstName: "",
    lastName: "",
    email: "",
    emergencyContact: "",
    username: "",
  });
  //check username validity
  useEffect(() => {
    if (!formData.username) {
      setAvailableUsername(null);
      return;
    }
    clearTimeout(debouncer.current);
    debouncer.current = setTimeout(() => {
      async function check() {
        try {
          const available = await checkUniqueUserName(formData.username);
          // console.log("available: ", available);
          setAvailableUsername(available);
        } catch (err) {
          console.error("Failed to check username", err);
        }
      }
      check();
    }, 500);
  }, [formData.username]);
  // Update formData state as the user types in input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    console.log("form submitted");
    try {
      // Send POST request to backend to register manager and restaurant
      const response = await apiFetch("/auth/register-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      toast.success(`📩 We have sent a verification email to ${formData.email}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log(response.message); // Log success message
      router.push("/"); // Redirect to homepage after success
    } catch (err) {
      // If the API call fails, show the error message
      setWarning(err.message);
    }
  };

  return (
    <div>
      <Top />
      <Header title="Create Your Restaurant 🍕" image="/images/table.jpg" />

      <div
        style={{
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Enhanced Registration Card */}
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
                        🍽️
                      </div>
                      <h2 style={{ color: "#fff", fontWeight: "600", marginBottom: "0.5rem" }}>
                        Create Your Restaurant
                      </h2>
                      <p style={{ color: "#adb5bd", fontSize: "1rem" }}>
                        Join ChowHub and start managing your restaurant digitally
                      </p>
                    </div>

                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                      {/* Restaurant Details Section */}
                      <div
                        style={{
                          backgroundColor: "rgba(32, 201, 151, 0.05)",
                          border: "1px solid rgba(32, 201, 151, 0.2)",
                          borderRadius: "8px",
                          padding: "1.5rem",
                          marginBottom: "2rem",
                        }}
                      >
                        <h5
                          style={{
                            color: "#20c997",
                            marginBottom: "1.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          🍽️ Restaurant Details
                        </h5>

                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label style={{ color: "#e9ecef", fontWeight: "500" }}>
                                <FiUser style={{ marginRight: "0.5rem" }} />
                                Restaurant Name
                              </Form.Label>
                              <Form.Control
                                required
                                type="text"
                                name="restaurantName"
                                value={formData.restaurantName}
                                onChange={handleChange}
                                placeholder="Enter restaurant name"
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
                              <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label style={{ color: "#e9ecef", fontWeight: "500" }}>
                                <FiUser style={{ marginRight: "0.5rem" }} />
                                Restaurant Username
                              </Form.Label>
                              <Form.Control
                                required
                                type="text"
                                name="restaurantUserName"
                                value={formData.restaurantUserName}
                                onChange={handleChange}
                                placeholder="Enter restaurant username"
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
                              <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row className="mb-3">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label style={{ color: "#e9ecef", fontWeight: "500" }}>
                                <FiMapPin style={{ marginRight: "0.5rem" }} />
                                Location
                              </Form.Label>
                              <Form.Control
                                required
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter restaurant location"
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
                          </Col>
                        </Row>
                      </div>

                      {/* Manager Details Section */}
                      <div
                        style={{
                          backgroundColor: "rgba(33, 150, 243, 0.05)",
                          border: "1px solid rgba(33, 150, 243, 0.2)",
                          borderRadius: "8px",
                          padding: "1.5rem",
                          marginBottom: "2rem",
                        }}
                      >
                        <h5
                          style={{
                            color: "#2196F3",
                            marginBottom: "1.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          🧑‍💼 Manager (Admin) Details
                        </h5>

                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label style={{ color: "#e9ecef", fontWeight: "500" }}>
                                <FiUser style={{ marginRight: "0.5rem" }} />
                                Manager Username
                              </Form.Label>
                              <Form.Control
                                required
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a unique username"
                                className={styles.loginInput}
                                isInvalid={availableUsername === false}
                                isValid={availableUsername === true}
                                style={{
                                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                                  border:
                                    availableUsername === false
                                      ? "2px solid #f44336"
                                      : availableUsername === true
                                        ? "2px solid #4CAF50"
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
                                  e.target.style.borderColor =
                                    availableUsername === false
                                      ? "#f44336"
                                      : availableUsername === true
                                        ? "#4CAF50"
                                        : "rgba(255, 255, 255, 0.2)";
                                  e.target.style.boxShadow = "none";
                                }}
                              />
                              {availableUsername === false && (
                                <Form.Text className="text-danger">
                                  Username is already taken
                                </Form.Text>
                              )}
                              {availableUsername === true && (
                                <Form.Text className="text-success">
                                  Username is available
                                </Form.Text>
                              )}
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label style={{ color: "#e9ecef", fontWeight: "500" }}>
                                <FiMail style={{ marginRight: "0.5rem" }} />
                                Email
                              </Form.Label>
                              <Form.Control
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
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
                                  e.target.style.borderColor = "#2196F3";
                                  e.target.style.boxShadow = "0 0 0 3px rgba(33, 150, 243, 0.1)";
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                                  e.target.style.boxShadow = "none";
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label style={{ color: "#e9ecef", fontWeight: "500" }}>
                                <FiUser style={{ marginRight: "0.5rem" }} />
                                First Name
                              </Form.Label>
                              <Form.Control
                                required
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
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
                                  e.target.style.borderColor = "#2196F3";
                                  e.target.style.boxShadow = "0 0 0 3px rgba(33, 150, 243, 0.1)";
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                                  e.target.style.boxShadow = "none";
                                }}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label style={{ color: "#e9ecef", fontWeight: "500" }}>
                                <FiUser style={{ marginRight: "0.5rem" }} />
                                Last Name
                              </Form.Label>
                              <Form.Control
                                required
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
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
                                  e.target.style.borderColor = "#2196F3";
                                  e.target.style.boxShadow = "0 0 0 3px rgba(33, 150, 243, 0.1)";
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                                  e.target.style.boxShadow = "none";
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label style={{ color: "#e9ecef", fontWeight: "500" }}>
                                <FiPhone style={{ marginRight: "0.5rem" }} />
                                Emergency Contact
                              </Form.Label>
                              <Form.Control
                                required
                                type="text"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                placeholder="Enter emergency contact number"
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
                                  e.target.style.borderColor = "#2196F3";
                                  e.target.style.boxShadow = "0 0 0 3px rgba(33, 150, 243, 0.1)";
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                                  e.target.style.boxShadow = "none";
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>

                      {warning && (
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
                          {warning}
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button
                        variant="success"
                        type="submit"
                        style={{
                          width: "100%",
                          backgroundColor: "#198754",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px",
                          fontSize: "1.1rem",
                          fontWeight: "600",
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
                        🚀 Register Restaurant
                      </Button>
                    </Form>

                    {/* Login Link */}
                    <div
                      className="text-center mt-4 pt-3"
                      style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
                    >
                      <p style={{ color: "#adb5bd", marginBottom: "0.5rem" }}>
                        Already have an account?
                      </p>
                      <Button
                        variant="link"
                        onClick={() => router.push("/login")}
                        style={{
                          color: "#20c997",
                          textDecoration: "none",
                          fontWeight: "500",
                          padding: 0,
                        }}
                        onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                        onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                      >
                        Sign in to your restaurant dashboard
                      </Button>
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
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <FiShield />
                      Secure Registration
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      🔒 SSL Encrypted
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      📧 Email Verification
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      ⚡ Quick Setup
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
