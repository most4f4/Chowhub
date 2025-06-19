export default function SummaryCard({ label, value, color }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#2A2A3A",
        borderRadius: 8,
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Label */}
      <h4
        style={{
          margin: 0,
          fontSize: "1.5rem",
          color: "#CCC",
          fontWeight: 500,
        }}
      >
        {label}
      </h4>

      {/* Dot + Value */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: "1.5rem",
            color: "#FFF",
            fontWeight: 600,
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
