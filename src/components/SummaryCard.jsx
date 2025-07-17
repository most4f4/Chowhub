import { useEffect, useRef, useState } from "react";

export default function SummaryCard({ label, value, color }) {
  const [displayValue, setDisplayValue] = useState(0);
  const frame = useRef();

  useEffect(() => {
    let start = null;
    const duration = 800; // ms
    const startValue = 0;
    const endValue = parseInt(value, 10);

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const progressRatio = Math.min(progress / duration, 1);
      const currentValue = Math.floor(progressRatio * (endValue - startValue) + startValue);
      setDisplayValue(currentValue);

      if (progress < duration) {
        frame.current = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(frame.current);
      }
    };

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame.current);
  }, [value]);

  return (
    <div
      style={{
        flex: 1,
        background: "#2A2A3A",
        borderRadius: 12,
        padding: "1.25rem",
        border: `2px solid ${color}20`,
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = `0 12px 24px ${color}30`;
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.backgroundColor = "#2E2E3E";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = `${color}20`;
        e.currentTarget.style.backgroundColor = "#2A2A3A";
      }}
    >
      {/* Background bubble */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: `${color}15`,
          opacity: 0.3,
        }}
      />

      {/* Label */}
      <h4
        style={{
          margin: 0,
          fontSize: "1.4rem",
          color: "#CCC",
          fontWeight: 500,
          marginBottom: "0.75rem",
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
            width: 18,
            height: 18,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: "1.6rem",
            color: "#FFF",
            fontWeight: 700,
          }}
        >
          {displayValue}
        </p>
      </div>
    </div>
  );
}
