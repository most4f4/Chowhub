// Source Code\chowhub\src\components\SupplierTable.js

import React from "react";

export default function SupplierTable({ suppliers, onEdit, onDelete }) {
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Contact Person", accessor: "contactPerson" },
    { header: "Phone Number", accessor: "phoneNumber" },
    { header: "Email", accessor: "email" },
    { header: "Address", accessor: "address" },
    { header: "Notes", accessor: "notes" },
  ];

  const renderActions = (row, index) => (
    <div style={{ display: "flex", gap: "0.5rem", padding: "0 0.5rem" }}>
      {}
      <button
        onClick={() => onEdit(row)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#FFF" }}
        title="Edit Supplier" 
      >
        ✏️
      </button>
      {}
      <button
        onClick={() => onDelete(row)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#FFF" }}
        title="Delete Supplier" 
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
            {}
            <th 
              style={{
                padding: "0.75rem 1rem",
                textAlign: "center", 
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.8)",
                fontWeight: 600,
                borderBottom: "1px solid #3A3A4A", 
              }}
            >
              
            </th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '2rem', color: '#AAA' }}>
                No suppliers found.
              </td>
            </tr>
          ) : (
            suppliers.map((row, index) => {
              const isEven = index % 2 === 0;
              const backgroundColor = isEven
                ? "transparent"
                : "rgba(255,255,255,0.03)"; 

              return (
                <tr
                  key={row._id || index} 
                  style={{
                    backgroundColor,
                    transition: "background 0.2s",
                    height: "60px", 
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
                  {}
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
            })
          )}
        </tbody>
      </table>
    </div>
  );
}