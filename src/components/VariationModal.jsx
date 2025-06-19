import { useEffect, useState, useCallback } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

const VariationModal = ({ show, onClose, variation, ingredientOptions, onSave }) => {
  const [localVariation, setLocalVariation] = useState(variation);

  useEffect(() => {
    setLocalVariation({
      ...variation,
      ingredients: Array.isArray(variation?.ingredients) ? variation.ingredients.map(ing => ({
        ...ing,
        isCustom: typeof ing.isCustom === 'boolean' ? ing.isCustom : false,
        // Refined logic for 'track' initialization:
        // Prioritize existing boolean 'track' value from DB.
        // If not a boolean, default based on whether it's a linked DB ingredient.
        track: typeof ing.track === 'boolean'
               ? ing.track
               : (!!ing.ingredientId && !ing.isCustom && ing.name !== ''), // Default to true if linked and not custom and has a name
        quantityUsed: parseFloat(ing.quantityUsed) || 0,
        quantityOriginal: ing.quantityOriginal || '',
        unit: ing.unit || '',
        name: ing.name || '',
      })) : []
    });
  }, [variation]);

  const handleVariationChange = (e) => {
    const { name, value } = e.target;
    setLocalVariation((prev) => ({
      ...prev,
      [name]: name === "price" || name === "cost" ? parseFloat(value) || 0 : value,
    }));
  };

  const addIngredient = () => {
    setLocalVariation((prev) => ({
      ...prev,
      ingredients: [
        ...(prev.ingredients || []),
        {
          name: "",
          ingredientId: null,
          quantityUsed: 0,
          track: false, 
          isCustom: true, 
          unit: "",
          isChecked: false, 
          quantityOriginal: "",
        },
      ],
    }));
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...(localVariation.ingredients || [])];
    if (!updatedIngredients[index]) return;

    const ing = { ...updatedIngredients[index] };

    if (field === "isCustom") {
      ing.isCustom = value;
      if (ing.isCustom) { // Switched to Custom Ingredient
        ing.ingredientId = null; // Clear DB link
        ing.track = false; // Custom ingredients are not tracked
      } else { // Switched off Custom Ingredient (intending to link to inventory)
        ing.track = true; // Assume user intends to link to a trackable item
      }
    } else if (field === "ingredientId") {
      const matched = ingredientOptions.find((opt) => opt._id?.toString() === value?.toString());

      if (matched) {
        ing.ingredientId = matched._id?.toString();
        ing.name = matched.name;
        ing.unit = matched.unit;
        ing.track = true; // Always track if selected from inventory
        ing.isCustom = false; // Always not custom if selected from inventory
      } else if (value === "") { // User cleared the selection
        ing.ingredientId = null;
        ing.name = "";
        ing.unit = "";
        ing.track = false; // No longer linked, so not tracked
        ing.isCustom = false; 
      } else {
        toast.error("Invalid ingredient selected from DB.");
        return;
      }
    } else {
      ing[field] = value;
    }

    updatedIngredients[index] = ing;
    setLocalVariation((prev) => ({ ...prev, ingredients: updatedIngredients }));
  };

  const removeIngredient = (index) => {
    setLocalVariation((prev) => ({
      ...prev,
      ingredients: (prev.ingredients || []).filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!localVariation.name.trim()) {
      toast.error("Variation name is required.");
      return;
    }
    if (!localVariation.ingredients || localVariation.ingredients.length === 0) {
      toast.error("At least one ingredient is required for the variation.");
      return;
    }

    onSave(localVariation);
  };

  // Function to format the quantity display based on your logic
  const getIngredientQuantityDisplay = (ing) => {
    if (ing.isCustom) {
      if (ing.unit) {
        return `${ing.quantityUsed || 0} ${ing.unit}`;
      } else if (ing.quantityOriginal) {
        return ing.quantityOriginal;
      }
      return ''; // Show nothing if no unit or quantityOriginal for custom
    } else {
      // For inventory-linked ingredients, always use quantityUsed and unit
      return `${ing.quantityUsed || 0} ${ing.unit || ''}`;
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{localVariation?.name ? "Edit Variation" : "Add New Variation"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Variation Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={localVariation?.name || ""}
              onChange={handleVariationChange}
              required
            />
          </Form.Group>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={localVariation?.price || 0}
                  onChange={handleVariationChange}
                  step="0.01"
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Cost</Form.Label>
                <Form.Control
                  type="number"
                  name="cost"
                  value={localVariation?.cost || 0}
                  onChange={handleVariationChange}
                  step="0.01"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <h5>Ingredients</h5>
          {(localVariation.ingredients || []).map((ing, index) => (
            <div key={index} className="mb-3 p-3 border rounded">
              <Row className="align-items-center">
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Ingredient Name</Form.Label>
                    {ing.isCustom ? (
                      <Form.Control
                        type="text"
                        placeholder="Custom Ingredient Name"
                        value={ing.name || ""}
                        onChange={(e) => updateIngredient(index, "name", e.target.value)}
                        required
                      />
                    ) : (
                      <InputGroup> {/* Use InputGroup for icon */}
                        <Form.Select
                          value={ing.ingredientId?.toString() || ""}
                          onChange={(e) => updateIngredient(index, "ingredientId", e.target.value)}
                          required
                        >
                          <option value="">-- Select Inventory Ingredient --</option>
                          {ingredientOptions.map((opt) => (
                            <option key={opt._id?.toString()} value={opt._id?.toString()}>
                              {opt.name} ({opt.unit})
                            </option>
                          ))}
                        </Form.Select>
                        {}
                        <InputGroup.Text>
                          <FaSearch />
                        </InputGroup.Text>
                      </InputGroup>
                    )}
                  </Form.Group>
                </Col>

                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={ing.quantityUsed || 0}
                      onChange={(e) => updateIngredient(index, "quantityUsed", e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Unit</Form.Label>
                    {ing.isCustom ? (
                      <Form.Control
                        type="text"
                        placeholder="Unit (e.g., kg, pcs)"
                        value={ing.unit || ""}
                        onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                        required
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={ing.unit || ""} // Display unit from DB ingredient
                        readOnly // Read-only for non-custom ingredients
                      />
                    )}
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end justify-content-end">
                  <Form.Group className="mb-0 me-2">
                    <Form.Check
                      type="checkbox"
                      label="Custom"
                      checked={ing.isCustom}
                      onChange={(e) => updateIngredient(index, "isCustom", e.target.checked)}
                      className="mt-3"
                    />
                  </Form.Group>
                  <Form.Group className="mb-0 me-2">
                    <Form.Check
                      type="checkbox"
                      label="Track"
                      checked={ing.track}
                      onChange={(e) => updateIngredient(index, "track", e.target.checked)}
                      disabled={ing.isCustom} // Disable if it's a custom ingredient
                      className="mt-3"
                    />
                  </Form.Group>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                    className="mt-3"
                  >
                    <FaTrash />
                  </Button>
                </Col>
              </Row>
              {/* Display area for the formatted quantity/unit for clarity within the modal */}
              <Row className="mt-2">
                <Col>
                  <small className="text-muted">
                    Display: {getIngredientQuantityDisplay(ing)}
                  </small>
                </Col>
              </Row>
            </div>
          ))}
          <Button variant="secondary" onClick={addIngredient} className="mt-3">
            <FaPlus className="me-2" /> Add Ingredient
          
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Variation
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VariationModal;