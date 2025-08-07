// src/pages/[restaurantUsername]/dashboard/supplier-management/create/index.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { Form, Button } from "react-bootstrap";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import styles from "./createSupplier.module.css";

export default function CreateSupplierPage() {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    address: "",
    notes: "",
    ingredients: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allIngredients, setAllIngredients] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        // Fetch all ingredients
        const { ingredients } = await apiFetch("/ingredients?limit=1000");

        if (!ingredients) {
          throw new Error("API response is missing 'ingredients' array.");
        }
        setAllIngredients(ingredients);
      } catch (err) {
        console.error("Failed to fetch ingredients:", err);
        toast.error("Failed to load ingredients. Please try again.");
      }
    };
    fetchIngredients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleIngredientsChange = (e) => {
    const selectedOptions = Array.from(e.target.options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setFormData({ ...formData, ingredients: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.name.trim()) {
      setError("Supplier Name is required.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiFetch("/suppliers", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.error) {
        setError(response.error);
      } else {
        toast.success(`✅ Supplier "${formData.name}" added successfully!`, {
          position: "top-center",
          autoClose: 3000,
        });
        setFormData({
          name: "",
          contactPerson: "",
          phoneNumber: "",
          email: "",
          address: "",
          notes: "",
          ingredients: [],
        });
        router.push(`/${restaurantUsername}/dashboard/supplier-management`);
      }
    } catch (err) {
      console.error("Failed to add supplier:", err);
      setError(err.message || "Failed to add supplier. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ManagerOnly>
        <div style={{ padding: "1rem" }}>
          <h1>Add New Supplier</h1>

          <Form className={styles.formWrapper} onSubmit={handleSubmit}>
            {error && <p className="text-danger">{error}</p>}

            {/* Supplier Name */}
            <Form.Group className="mb-3" controlId="formSupplierName">
              <Form.Label>Supplier Name *</Form.Label>
              <Form.Control
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.supplierLabel}
              />
              <Form.Text style={{ color: "#ccc" }}>
                Name of the Supplier must be unique per restaurant.
              </Form.Text>
            </Form.Group>

            {/* Contact Person */}
            <Form.Group className="mb-3" controlId="formContactPerson">
              <Form.Label>Contact Person</Form.Label>
              <Form.Control
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className={styles.supplierLabel}
              />
            </Form.Group>

            {/* Phone Number */}
            <Form.Group className="mb-3" controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={styles.supplierLabel}
              />
            </Form.Group>

            {/* Email Address */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.supplierLabel}
              />
            </Form.Group>

            {/* Physical Address */}
            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Physical Address</Form.Label>
              <Form.Control
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={styles.supplierLabel}
              />
            </Form.Group>

            {/* Notes */}
            <Form.Group className="mb-3" controlId="formNotes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className={styles.supplierLabel}
              />
            </Form.Group>

            {/* Ingredients Selection */}
            <Form.Group className="mb-3" controlId="formIngredients">
              <Form.Label>Supplied Ingredients</Form.Label>
              <Form.Select
                multiple
                name="ingredients"
                value={formData.ingredients}
                onChange={handleIngredientsChange}
                className={styles.supplierLabel}
              >
                {allIngredients && allIngredients.map((ingredient) => (
                  <option key={ingredient._id} value={ingredient._id}>
                    {ingredient.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Text style={{ color: "#ccc" }}>
                Hold down the `Ctrl` (Windows) or `Cmd` (Mac) key to select multiple ingredients.
              </Form.Text>
            </Form.Group>

            {/* Submit Button */}
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? "Adding Supplier..." : "Add Supplier"}
            </Button>
          </Form>
        </div>
      </ManagerOnly>
    </DashboardLayout>
  );
}