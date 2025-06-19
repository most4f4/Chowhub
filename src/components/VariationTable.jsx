import React from "react";

export default function VariationTable({ variations = [], onEdit, onDelete }) {
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Price", accessor: "price" },
    { header: "Cost", accessor: "cost" },
    { header: "Ingredients", accessor: "ingredients" },
  ];

  const renderActions = (row, index) => (
    <div style={{ display: "flex", gap: "0.5rem", padding: "0 0.5rem" }}>
      <button
        onClick={() => onEdit(row)}
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
        onClick={() => onDelete(row)}
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

  // Helper function to safely format prices/costs
  const formatCurrency = (value) => {
    if (typeof value === "number" && !isNaN(value)) {
      return value.toFixed(2);
    }
    return "0.00"; // Default value in case of invalid or missing price/cost
  };

  return (
    <div
      style={{
        overflowX: "auto",
        backgroundColor: "#1E1E2F",
        borderRadius: 8,
        margin: "1.5rem 0",
      }}
    >
      <h4 style={{ padding: "1rem 1rem 0", color: "#FFF" }}>Variations</h4>
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
          {variations.map((row, index) => {
            const isEven = index % 2 === 0;

            return (
              <tr
                key={index}
                style={{
                  backgroundColor: isEven
                    ? "transparent"
                    : "rgba(255,255,255,0.03)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = isEven
                    ? "transparent"
                    : "rgba(255,255,255,0.03)")
                }
              >
                <td style={{ padding: "0.75rem 1rem", color: "#EEE" }}>
                  {row.name}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "#EEE" }}>
                  ${formatCurrency(row.price)}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "#EEE" }}>
                  ${formatCurrency(row.cost)}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "#EEE" }}>
                  {row.ingredients?.length || 0} item(s)
                </td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                  {renderActions(row, index)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
