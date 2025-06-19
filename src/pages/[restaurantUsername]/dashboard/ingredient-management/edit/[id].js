import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { Form, Button } from "react-bootstrap";
import styles from "../create/createIngredient.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAtomValue, getDefaultStore } from "jotai";
import { userAtom, tokenAtom } from "@/store/atoms";
import { toast } from "react-toastify";

export default function EditIngredientForm() {
  const router = useRouter();
  const { id } = router.query;
  const user = useAtomValue(userAtom);
  const store = getDefaultStore();
  const token = store.get(tokenAtom);

  const unitList = [
    "kg",
    "litre",
    "piece",
    "gram",
    "ml",
    "cup",
    "tablespoon",
    "teaspoon",
    "fluid_ounce",
    "gallon",
    "pint",
    "ounce",
    "pound",
    "dozen",
    "pack",
    "bunch",
    "head",
    "bag",
    "can",
    "jar",
    "bottle",
    "sheet",
  ];

  const [form, setForm] = useState({
    name: "",
    unit: "",
    quantity: 0,
    threshold: 0,
    imageFile: null,
    imageUrl: "",
  });

  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (!id || !token) return;

    async function fetchIngredient() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch ingredient");

        const fetchedUnit = unitList.includes(data.unit) ? data.unit : "";
        if (!unitList.includes(data.unit)) {
          console.warn(`Fetched unit "${data.unit}" not found in unitList`);
        }

        setForm({
          name: data.name,
          unit: fetchedUnit,
          quantity: data.quantity,
          threshold: data.threshold,
          imageUrl: data.image,
          imageFile: null,
        });
      } catch (err) {
        toast.error("Failed to load ingredient details");
        console.error(err);
      }
    }

    fetchIngredient();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("unit", form.unit);
      formData.append("quantity", form.quantity);
      formData.append("threshold", form.threshold);

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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

      toast.success("✅ Ingredient updated successfully!", { position: "top-center" });
      router.push(`/${user.restaurantUsername}/dashboard/ingredient-management`);
    } catch (err) {
      console.error(err);
      setWarning(err.message);
    }
  };

  return (
    <DashboardLayout>
      <ManagerOnly>
        <h1>Edit Ingredient</h1>

        <Form className={styles.formWrapper} onSubmit={handleSubmit}>
          {/* Preview existing image */}
          {form.imageUrl && (
            <div className="mb-3">
              <img
                src={form.imageUrl}
                alt="ingredient"
                style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 10 }}
              />
              <Form.Text style={{ color: "#ccc", display: "block" }}>
                Existing image (Spoonacular or previously uploaded)
              </Form.Text>
            </div>
          )}

          {/* Name */}
          <Form.Group className="mb-3" controlId="formIngredName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Ingredient name"
              required
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Image upload */}
          <Form.Group className="mb-3" controlId="formIngredImage">
            <Form.Label>Change Image</Form.Label>
            <Form.Control
              type="file"
              name="imageFile"
              onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })}
            />
            <Form.Text style={{ color: "#ccc" }}>
              Upload a new image to replace the existing one.
            </Form.Text>
          </Form.Group>

          {/* Unit */}
          <Form.Group className="mb-3">
            <Form.Label>Unit</Form.Label>
            <Form.Select required name="unit" value={form.unit} onChange={handleChange}>
              <option value="">Select a unit</option>
              {unitList.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Quantity */}
          <Form.Group className="mb-3" controlId="formIngredQuantity">
            <Form.Label>Quantity in Stock</Form.Label>
            <Form.Control
              type="number"
              required
              step="any"
              min={0}
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Threshold */}
          <Form.Group className="mb-3" controlId="formIngredThreshold">
            <Form.Label>Threshold (Low-Stock Warning)</Form.Label>
            <Form.Control
              type="number"
              required
              min={0}
              step="any"
              name="threshold"
              value={form.threshold}
              onChange={handleChange}
            />
          </Form.Group>

          {warning && <p className="text-danger">{warning}</p>}

          <Button variant="primary" type="submit">
            Update Ingredient
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
            onClick={() => router.push(`/${user.restaurantUsername}/dashboard/ingredient-management`)}
          >
            Cancel
          </Button>
        </Form>
      </ManagerOnly>
    </DashboardLayout>
  );
}