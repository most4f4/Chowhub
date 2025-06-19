import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/api";
import VariationTable from "@/components/VariationTable";
import VariationModal from "@/components/VariationModal";

export default function EditMenuItem() {
  const router = useRouter();
  const { restaurantUsername, menuItemId } = router.query;

  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
    imageFile: null,
    isInventoryControlled: false,
  });
  const [variations, setVariations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [activeVariation, setActiveVariation] = useState(null);

  // Function to fetch categories, memoized to avoid re-creation
  const fetchCategories = useCallback(async () => {
    try {
      const categoryRes = await apiFetch("/categories");
      setCategories(Array.isArray(categoryRes.categories) ? categoryRes.categories : []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      toast.error("Failed to load categories.");
    }
  }, []);
  useEffect(() => {
    if (!router.isReady || !menuItemId) return;

    async function fetchData() {
      try {
        // Fetch Menu Item details
        const itemRes = await apiFetch(`/menu-management/${menuItemId}`);
        const item = itemRes.item;

        if (!item) {
          setWarning("Menu item not found.");
          setLoading(false);
          return;
        }

        setFormData({
          name: item.name || "",
          description: item.description || "",
          category: item.category || "",
          image: item.image || "",
          imageFile: null,
          isInventoryControlled: !!item.isInventoryControlled,
        });

        setVariations(Array.isArray(item.variations) ? item.variations : []);

        // Fetch Ingredients for dropdowns (inventory ingredients)
        const ingredientsRes = await apiFetch("/ingredients?page=1&limit=1000");
        setIngredientOptions(
          (ingredientsRes.ingredients || []).map((ing) => ({
            ...ing,
            _id: ing._id,
          })),
        );

        // Fetch Categories
        fetchCategories();
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setWarning(err.message || "Failed to load menu item or ingredients.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router.isReady, menuItemId, fetchCategories]);

  // Handles changes to the main menu item form fields (name, description, category, image, isInventoryControlled)
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  // Handles form submission for updating the menu item
  const handleSubmit = async (e) => {
    e.preventDefault();
    setWarning("");

    if (variations.length === 0) {
      setWarning("At least one variation is required for a menu item.");
      return;
    }

    // Prepare variations data for submission
    const cleanedVariations = variations.map((v) => ({
      ...v,
      ingredients: (v.ingredients || []).map((i) => ({
        ingredientId: i.ingredientId || null,
        name: i.name,
        quantityUsed: parseFloat(i.quantityUsed) || 0,
        track: !!i.track,
        unit: i.unit || "",
        isCustom: !!i.isCustom,
        isChecked: !!i.isChecked,
        quantityOriginal: i.quantityOriginal || "",
      })),
    }));

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("description", formData.description);
    formPayload.append("category", formData.category);
    formPayload.append("variations", JSON.stringify(cleanedVariations));

    if (formData.imageFile) {
      formPayload.append("image", formData.imageFile);
    } else if (formData.image) {
      formPayload.append("imageUrlFromClient", formData.image);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu-management/${menuItemId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formPayload,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to update menu item.");
      }

      toast.success("✅ Menu item updated!", { position: "top-center" });
      router.push(`/${restaurantUsername}/dashboard/menu-management`); // Redirect on success
    } catch (err) {
      console.error("Update failed:", err);
      setWarning(err.message || "Failed to update menu item.");
    }
  };

  // Handler for deleting a variation from the table
  const handleVariationDelete = (variationToDelete) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete variation "${variationToDelete.name}"?`,
    );
    if (confirmDelete) {
      setVariations((prev) => prev.filter((v) => v.name !== variationToDelete.name));
      toast.info(`Variation "${variationToDelete.name}" removed.`);
    }
  };

  // Handler for opening the modal to add a new variation
  const handleAddVariation = () => {
    // Initialize with a new, empty variation structure
    setActiveVariation({ name: "", price: 0, cost: 0, ingredients: [] });
    setShowVariationModal(true);
  };

  // Callback to handle saving a variation from the modal
  const handleSaveVariation = (updatedVariation) => {
    // Basic validation for variation
    if (!updatedVariation.name.trim()) {
      toast.error("Variation name cannot be empty.");
      return;
    }
    if (!updatedVariation.ingredients || updatedVariation.ingredients.length === 0) {
      toast.error("Each variation must include at least one ingredient.");
      return;
    }

    // Check for duplicate names, excluding the currently active variation if editing
    const nameExists = variations.some(
      (v) =>
        v.name.toLowerCase() === updatedVariation.name.toLowerCase() &&
        activeVariation?.name.toLowerCase() !== updatedVariation.name.toLowerCase(),
    );

    if (nameExists) {
      toast.error("Variation name must be unique.");
      return;
    }

    setVariations((prev) => {
      // Find index of existing variation to update, or -1 if new
      const existingIndex = prev.findIndex(
        (v) => activeVariation && v.name === activeVariation.name,
      );

      if (existingIndex > -1) {
        // Update existing variation
        const newVariations = [...prev];
        newVariations[existingIndex] = updatedVariation;
        return newVariations;
      } else {
        // Add new variation
        return [...prev, updatedVariation];
      }
    });

    setShowVariationModal(false);
    setActiveVariation(null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <ManagerOnly>
          <div style={{ padding: "2rem", color: "#FFF", textAlign: "center" }}>
            <Spinner animation="border" variant="light" className="me-2" /> Loading menu item...
          </div>
        </ManagerOnly>
      </DashboardLayout>
    );
  }

  if (warning && !loading && !formData.name) {
    return (
      <DashboardLayout>
        <ManagerOnly>
          <div style={{ padding: "2rem", color: "red", textAlign: "center" }}>
            <p>{warning}</p>
            <Button onClick={() => router.push(`/${restaurantUsername}/dashboard/menu-management`)}>
              Go Back to Menu Management
            </Button>
          </div>
        </ManagerOnly>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ManagerOnly>
        <h1>Edit Menu Item</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <Form.Select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id?.toString()} value={cat._id?.toString()}>
                  {" "}
                  {/* Ensure _id is a string */}
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {formData.image && (
            <div className="mb-2">
              <img
                src={formData.image}
                alt="Current"
                style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 10 }}
              />
              <Form.Text style={{ color: "#ccc", display: "block" }}>Existing image</Form.Text>
            </div>
          )}

          <Form.Group className="mb-3" controlId="formImageUpload">
            <Form.Label>Change Image</Form.Label>
            <Form.Control type="file" name="imageFile" onChange={handleChange} accept="image/*" />
            <Form.Text style={{ color: "#ccc" }}>Upload to replace existing image</Form.Text>
          </Form.Group>

          {warning && <p className="text-danger mt-2">{warning}</p>}

          <Button type="submit" variant="primary" className="mt-3">
            Save Changes
          </Button>
        </Form>

        <div className="mt-4 mb-2">
          <Button variant="success" onClick={handleAddVariation}>
            Add New Variation
          </Button>
        </div>

        <VariationTable
          variations={variations}
          onEdit={(variation) => {
            setActiveVariation(variation);
            setShowVariationModal(true);
          }}
          onDelete={handleVariationDelete}
        />

        {showVariationModal && (
          <VariationModal
            show={showVariationModal}
            onClose={() => {
              setShowVariationModal(false);
              setActiveVariation(null);
            }}
            variation={activeVariation}
            ingredientOptions={ingredientOptions}
            onSave={handleSaveVariation}
          />
        )}
      </ManagerOnly>
    </DashboardLayout>
  );
}
