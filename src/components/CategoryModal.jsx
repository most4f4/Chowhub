import { useState } from "react";
import { createPortal } from "react-dom";
import { apiFetch } from "@/lib/api";

export default function CategoryModal({ open, onClose, initialName = "", categoryId = null, isEditing }) {
  const [categoryName, setCategoryName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const body = JSON.stringify({ name: categoryName });

      if (isEditing && categoryId) {
        await apiFetch(`/categories/${categoryId}`, {
          method: "PUT",
          body,
        });
      } else {
        await apiFetch(`/categories`, {
          method: "POST",
          body,
        });
      }

      onClose();
    } catch (err) {
      console.error("Error saving category:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>{isEditing ? "Edit Category" : "Add Category"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
            required
            style={styles.input}
          />
          <div style={styles.buttons}>
            <button
              type="button"
              onClick={onClose}
              style={{ ...styles.button, backgroundColor: "#757575" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ ...styles.button, backgroundColor: "#4CAF50" }}
            >
              {saving ? "Saving..." : isEditing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#2A2A3A",
    padding: "1.5rem",
    borderRadius: 8,
    width: 400,
    maxWidth: "90%",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  },
  title: {
    margin: 0,
    marginBottom: "1rem",
    color: "#FFF",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    borderRadius: 4,
    border: "1px solid #555",
    backgroundColor: "#1E1E2F",
    color: "#FFF",
    marginBottom: "1rem",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.5rem",
  },
  button: {
    padding: "0.5rem 1rem",
    borderRadius: 4,
    border: "none",
    color: "#FFF",
    cursor: "pointer",
  },
};
