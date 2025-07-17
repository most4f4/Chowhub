// components/AnalyticsBackButton.js
import { useRouter } from "next/router";

export default function AnalyticsBackButton({
  customBackPath = null,
  showIcon = true,
  buttonText = "Back to Analytics Dashboard",
  variant = "default", // "default", "minimal", "pill"
}) {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  const handleBack = () => {
    if (customBackPath) {
      router.push(`/${restaurantUsername}/dashboard/${customBackPath}`);
    } else {
      router.push(`/${restaurantUsername}/dashboard/sales-analytics`);
    }
  };

  // Style variants
  const getButtonStyles = () => {
    const baseStyles = {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "0.75rem 1.5rem",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      textDecoration: "none",
    };

    switch (variant) {
      case "minimal":
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          color: "#CCC",
          border: "1px solid #3A3A4A",
          padding: "0.5rem 1rem",
          fontSize: "0.9rem",
        };
      case "pill":
        return {
          ...baseStyles,
          backgroundColor: "#FF980020",
          color: "#FF9800",
          border: "1px solid #FF980040",
          borderRadius: "25px",
          padding: "0.5rem 1.25rem",
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: "#2A2A3A",
          color: "#FFF",
          border: "1px solid #3A3A4A",
        };
    }
  };

  const getHoverStyles = () => {
    switch (variant) {
      case "minimal":
        return {
          backgroundColor: "#2A2A3A",
          borderColor: "#FF9800",
        };
      case "pill":
        return {
          backgroundColor: "#FF980030",
          borderColor: "#FF9800",
        };
      default:
        return {
          backgroundColor: "#3A3A4A",
          borderColor: "#FF9800",
        };
    }
  };

  return (
    <button
      onClick={handleBack}
      style={getButtonStyles()}
      onMouseEnter={(e) => {
        const hoverStyles = getHoverStyles();
        Object.assign(e.target.style, hoverStyles);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.target.style, getButtonStyles());
      }}
    >
      {showIcon && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
      )}
      {buttonText}
    </button>
  );
}

// Optional: Higher-level wrapper for analytics pages
export function AnalyticsPageHeader({ title, subtitle = null, backButtonProps = {} }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <AnalyticsBackButton {...backButtonProps} />
      </div>
      <h1
        style={{
          fontSize: "2rem",
          color: "#FFF",
          margin: "0 0 0.5rem 0",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            color: "#CCC",
            fontSize: "1.1rem",
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
