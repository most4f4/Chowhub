import React from "react";

export default function IngredientTable({ ingredients, onEdit, onDelete }) {
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Image", accessor: "image" },
    { header: "Unit", accessor: "unit" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Threshold", accessor: "threshold" },
  ];

  const renderActions = (row, index) => (
    <div style={{ display: "flex", gap: "0.5rem", padding: "0 0.5rem" }}>
      <button
        onClick={() => onEdit(row)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#FFF" }}
      >
        ✏️
      </button>
      <button
        onClick={() => onDelete(row)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#FFF" }}
      >
        🗑️
      </button>
    </div>
  );

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
        <thead
          style={{
            backgroundColor: "#2A2A3A",
          }}
        >
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
            <th
              style={{
                padding: "0.75rem 1rem",
              }}
            />
          </tr>
        </thead>
        <tbody>
          {ingredients.map((row, index) => {
            const isEven = index % 2 === 0;
            const isNearingThreshold =
              row.quantity <= row.threshold * 1.1 && row.quantity > row.threshold;
            const isCritical = row.quantity <= row.threshold;
            const backgroundColor = isCritical
              ? "rgba(229, 57, 53, 0.2)" // Red for critical stock
              : isNearingThreshold
              ? "rgba(255, 165, 0, 0.2)" // Light orange for nearing threshold
              : isEven
              ? "transparent"
              : "rgba(255,255,255,0.03)";

            return (
              <tr
                key={index}
                style={{
                  backgroundColor,
                  transition: "background 0.2s",
                  height: "100px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = backgroundColor)
                }
              >
                {columns.map((col) => {
                  const cell = row[col.accessor];

                  if (col.accessor === "image") {
                    return (
                      <td key={col.accessor} style={{ padding: "0.5rem 1rem" }}>
                        {cell ? (
                          <img
                            src={cell}
                            alt={row.name}
                            style={{ width: 110, height: 100, borderRadius: 5 }}
                          />
                        ) : null}
                      </td>
                    );
                  }

                  return (
                    <td
                      key={col.accessor}
                      style={{
                        padding: "0.5rem 1rem",
                        textAlign: "left",
                        color: "#EEE",
                        fontSize: "0.95rem",
                      }}
                    >
                      {cell}
                    </td>
                  );
                })}
                <td
                  style={{
                    padding: "0.5rem 0.5rem",
                    textAlign: "center",
                    width: "100px",
                  }}
                >
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