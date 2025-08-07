// src/pages/[restaurantUsername]/dashboard/supplier-management/edit/[id].js

import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { Form, Button } from "react-bootstrap";
import styles from "../create/createSupplier.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAtomValue, getDefaultStore } from "jotai";
import { userAtom, tokenAtom } from "@/store/atoms";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/api";

export default function EditSupplierForm() {
  const router = useRouter();
  const { id } = router.query;
  const user = useAtomValue(userAtom);
  const store = getDefaultStore();
  const token = store.get(tokenAtom);

  const [form, setForm] = useState({
    name: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    address: "",
    notes: "",
    ingredients: [],
  });

  const [allIngredients, setAllIngredients] = useState([]);
  const [warning, setWarning] = useState("");

   useEffect(() => {
    if (!id || !token) return;

    async function fetchData() {
      try {
        // Fetch all ingredients 
        const ingredientsRes = await apiFetch("/ingredients?limit=1000");
        if (ingredientsRes.error) throw new Error(ingredientsRes.error);
        setAllIngredients(ingredientsRes.ingredients || []);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/suppliers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch supplier");

        setForm({
          name: data.data.name,
          contactPerson: data.data.contactPerson,
          phoneNumber: data.data.phoneNumber,
          email: data.data.email,
          address: data.data.address,
          notes: data.data.notes,
          ingredients: data.data.ingredients.map(ing => ing._id),
        });
      } catch (err) {
        toast.error("Failed to load supplier details");
        console.error(err);
      }
    }
    fetchData();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIngredientsChange = (e) => {
    const selectedOptions = Array.from(e.target.options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setForm({ ...form, ingredients: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWarning("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          store.set(tokenAtom, null);
          store.set(userAtom, null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error("Session expired, please log in again.");
          window.location.href = "/login";
        }
        throw new Error(result.error || "API Error");
      }

      toast.success("✅ Supplier updated successfully!", { position: "top-center" });
      router.push(`/${user.restaurantUsername}/dashboard/supplier-management`);
    } catch (err) {
      console.error(err);
      setWarning(err.message);
    }
  };

  return (
    <DashboardLayout>
      <ManagerOnly>
        <h1>Edit Supplier</h1>

        <Form className={styles.formWrapper} onSubmit={handleSubmit}>
          {warning && <p className="text-danger">{warning}</p>}

          {/* Supplier Name */}
          <Form.Group className="mb-3" controlId="formSupplierName">
            <Form.Label>Supplier Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Supplier name"
              required
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Contact Person */}
          <Form.Group className="mb-3" controlId="formContactPerson">
            <Form.Label>Contact Person</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter contact person's name"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Phone Number */}
          <Form.Group className="mb-3" controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email address"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Address */}
          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter supplier address"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Notes */}
          <Form.Group className="mb-3" controlId="formNotes">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Any additional notes about the supplier"
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Ingredients Selection */}
          <Form.Group className="mb-3" controlId="formIngredients">
            <Form.Label>Supplied Ingredients</Form.Label>
            <Form.Select
              multiple
              name="ingredients"
              value={form.ingredients}
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

          <Button variant="primary" type="submit">
            Update Supplier
          </Button>
          <Button
            type="button"
            className="ms-2"
            style={{
              backgroundColor: "#dc3545",
              borderColor: "#dc3545",
              color: "#fff",
              ":hover": {
                backgroundColor: "#c82333",
                borderColor: "#bd2130",
              },
            }}
            onClick={() =>
              router.push(`/${user.restaurantUsername}/dashboard/supplier-management`)
            }
          >
            Cancel
          </Button>
        </Form>
      </ManagerOnly>
    </DashboardLayout>
  );
}