import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Import FaSearch icon

export default function MenuItemTable({ items, onEdit, onDelete }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Image", accessor: "image" },
    { header: "Category", accessor: "categoryName" },
    { header: "Price (Range)", accessor: "priceRange" },
    { header: "Inventory Controlled", accessor: "isInventoryControlled" },
    { header: "Variations", accessor: "variations" },
  ];

  const renderActions = (item) => (
    <div style={{ display: "flex", gap: "0.5rem", padding: "0 0.5rem" }}>
      <button
        onClick={() => onEdit(item)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#FFF",
        }}
      >
        ✏️
      </button>
      <button
        onClick={() => onDelete(item)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#FFF",
        }}
      >
        🗑️
      </button>
    </div>
  );

  // Helper function to get the correct quantity display for an ingredient
  const getIngredientDisplay = (ingredient) => {
    // If it's a custom ingredient (which implies track: false)
    // Note: Based on VariationModal, isCustom:true implies track:false
    // If unit is provided for the custom ingredient, use quantityUsed + unit
    if (ingredient.track) {
      // Keeping this check as it's the primary way to identify custom in modal
      return `${ingredient.quantityUsed || 0} ${ingredient.unit || ""}`.trim();
    } else {
      // For inventory-linked ingredients (which implies track: true), use quantityUsed and unit
      // Ensure quantityUsed is a number and unit is a string
      if (ingredient.unit) {
        return `${ingredient.quantityUsed || 0} ${ingredient.unit}`;
      }
      // Otherwise, use quantityOriginal if available
      else if (ingredient.quantityOriginal) {
        return ingredient.quantityOriginal;
      }
      // If neither, just return an empty string (name will be enough)
      return "";
    }
  };

  return (
    <div
      style={{
        overflowX: "auto",
        backgroundColor: "#1E1E2F",
        borderRadius: 8,
        margin: "0 1rem",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
        }}
      >
        <thead style={{ backgroundColor: "#2A2A3A" }}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                style={{
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 600,
                  borderBottom: "1px solid #3A3A4A",
                }}
              >
                {col.header}
              </th>
            ))}
            <th style={{ padding: "0.75rem 1rem" }} />
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const isEven = index % 2 === 0;
            const { variations = [] } = item;

            const isCritical = variations.some((v) =>
              v.ingredients?.some((ing) => ing.track && ing.quantityUsed <= ing.threshold),
            );

            const isLow =
              !isCritical &&
              variations.some((v) =>
                v.ingredients?.some(
                  (ing) =>
                    ing.track &&
                    ing.quantityUsed <= ing.threshold * 1.1 &&
                    ing.quantityUsed > ing.threshold,
                ),
              );

            const backgroundColor = isCritical
              ? "rgba(229, 57, 53, 0.2)"
              : isLow
                ? "rgba(255, 165, 0, 0.2)"
                : isEven
                  ? "transparent"
                  : "rgba(255,255,255,0.03)";

            const prices = variations.map((v) => parseFloat(v.price)).filter((n) => !isNaN(n));
            const priceRange =
              prices.length === 0
                ? "-"
                : prices.length === 1
                  ? `$${prices[0].toFixed(2)}`
                  : `$${Math.min(...prices).toFixed(2)} - $${Math.max(...prices).toFixed(2)}`;

            const isExpanded = expandedRow === item._id;

            return (
              <React.Fragment key={item._id || index}>
                <tr
                  style={{
                    backgroundColor,
                    transition: "background 0.2s",
                    height: "100px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = backgroundColor)}
                >
                  <td
                    style={{
                      padding: "0.5rem 1rem",
                      color: "#EEE",
                      fontSize: "0.95rem",
                    }}
                  >
                    {item.name}
                  </td>
                  <td style={{ padding: "0.5rem 1rem" }}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 110, height: 100, borderRadius: 5 }}
                      />
                    ) : null}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem 1rem",
                      color: "#EEE",
                      fontSize: "0.95rem",
                    }}
                  >
                    {item.categoryName}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem 1rem",
                      color: "#EEE",
                      fontSize: "0.95rem",
                    }}
                  >
                    {priceRange}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem 1rem",
                      color: "#EEE",
                      fontSize: "0.95rem",
                    }}
                  >
                    {item.isInventoryControlled ? "Yes" : "No"}
                  </td>
                  <td style={{ padding: "0.5rem 1rem" }}>
                    <button
                      onClick={() =>
                        setExpandedRow((prev) => (prev === item._id ? null : item._id))
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "#4CAF50",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {isExpanded ? "Hide" : "View"}
                    </button>
                  </td>
                  <td
                    style={{
                      padding: "0.5rem 0.5rem",
                      textAlign: "center",
                      width: "100px",
                    }}
                  >
                    {renderActions(item)}
                  </td>
                </tr>
                {isExpanded &&
                  variations.map((v, vi) => (
                    <tr key={`v-${item._id}-${vi}`} style={{ backgroundColor: "#282838" }}>
                      <td colSpan={7} style={{ padding: "1rem", color: "#FFF" }}>
                        <strong>Variation:</strong> {v.name} — $
                        {parseFloat(v.price || 0).toFixed(2)} (Cost: $
                        {parseFloat(v.cost || 0).toFixed(2)})
                        <br />
                        <strong>Ingredients:</strong>
                        <ul style={{ margin: "0.5rem 0 0 1.5rem" }}>
                          {v.ingredients?.map((ing, ii) => (
                            <li key={`ing-${ii}`}>
                              {/* Conditionally render magnifying glass for trackable items */}
                              {ing.track && <>🔍</>}
                              {ing.name} — {getIngredientDisplay(ing)}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
