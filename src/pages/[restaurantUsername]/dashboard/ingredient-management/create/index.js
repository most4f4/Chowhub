import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { Form, Button } from "react-bootstrap";
import styles from "./createIngredient.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAtomValue } from "jotai";
import { userAtom, tokenAtom } from "@/store/atoms";
import { toast } from "react-toastify";
import { getDefaultStore } from "jotai";

export default function CreateIngredientForm() {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const store = getDefaultStore();
  const token = store.get(tokenAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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
    imageUrlFromSpoonacular: "",
  });

  // Holds warning messages to display if something goes wrong (e.g., duplicate email)
  const [warning, setWarning] = useState("");

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
      formData.append("image", form.imageFile); // File object

      if (form.image) {
        formData.append("image", form.image); // file upload
        // sending a multipart/form-data request where the file is attached with the field name "image".
      }

      if (form.imageUrlFromSpoonacular) {
        formData.append("imageUrlFromSpoonacular", form.imageUrlFromSpoonacular);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          // 1) Clear auth in Jotai + localStorage
          store.set(tokenAtom, null);
          store.set(userAtom, null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // 2) Notify the user
          toast.error("Session expired, please log in again.");
          // 3) Redirect out of dashboard
          window.location.href = "/login";
        }
        throw new Error(result.error || "API Error");
      }

      // Notify the success
      toast.success(`✅ ${form.name} is successfully added to the inventory. `, {
        position: "top-center",
        autoClose: 5000,
      });

      console.log(res.message); // Log success message

      // Return back to ingredient-management page
      router.push(`/${user.restaurantUsername}/dashboard/ingredient-management`);
    } catch (err) {
      console.log(err, "error occured while creating new employee");
      // If the API call fails, show the error message
      setWarning(err.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.trim() !== "") {
        try {
          const res = await fetch(
            `https://api.spoonacular.com/food/ingredients/search?query=${searchTerm}&number=5&apiKey=${process.env.NEXT_PUBLIC_SPOONACULARE_API_KEY2}`,
          );
          const data = await res.json();
          setSuggestions(data.results);
        } catch (err) {
          console.error("Spoonacular error:", err);
        }
      } else {
        setSuggestions([]);
      }
    }, 400);
  }, [searchTerm]);

  const handleSelectSuggestion = async (item) => {
    try {
      setForm((prev) => ({
        ...prev,
        name: item.name,
        imageUrlFromSpoonacular: `https://spoonacular.com/cdn/ingredients_500x500/${item.image}`,
      }));
      setSuggestions([]);
      setSearchTerm("");
    } catch (err) {
      console.error("Failed to load image blob:", err);
    }
  };

  return (
    <DashboardLayout>
      <ManagerOnly>
        <h1>Create New Ingredient</h1>

        <Form className={styles.formWrapper} onSubmit={handleSubmit}>
          {/* Spoonacular Search Field */}
          <Form.Group controlId="spoonacularSearch">
            <Form.Label>Search Ingredient</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search from Spoonacular..."
              className={styles.ingredientLabel}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form.Group>
          {Array.isArray(suggestions) && suggestions.length > 0 && (
            <ul className={`list-group mt-2 ${styles.suggestionsList}`}>
              {suggestions.map((item) => (
                <li
                  key={item.id}
                  className={`list-group-item list-group-item-action d-flex align-items-center ${styles.suggestionsListItem}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectSuggestion(item)}
                >
                  <img
                    src={`https://spoonacular.com/cdn/ingredients_100x100/${item.image}`}
                    alt={item.name}
                    style={{ width: 40, height: 40, objectFit: "cover", marginRight: "1rem" }}
                  />
                  {item.name}
                </li>
              ))}
            </ul>
          )}

          <br />

          {/* Name */}
          <Form.Group className="mb-3" controlId="formIngredName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Ingredient name"
              required
              name="name"
              value={form.name}
              className={styles.ingredientLabel}
              onChange={handleChange}
            />
            <Form.Text style={{ color: "#ccc" }}>Name of the Ingredient must be unique.</Form.Text>
          </Form.Group>

          {/* Image */}
          <Form.Group className="mb-3" controlId="formIngredImage">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              name="imageFile"
              onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })}
            />
            <Form.Text style={{ color: "#ccc" }}>
              This should be a relative path or full image URL.
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
              step="any" // ← allows decimals like 4.555
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
            <Form.Text style={{ color: "#ccc" }}>
              If quantity drops below this number, a notification will be triggered.
            </Form.Text>
          </Form.Group>

          {warning && <p className="text-danger">{warning}</p>}

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </ManagerOnly>
    </DashboardLayout>
  );
}
