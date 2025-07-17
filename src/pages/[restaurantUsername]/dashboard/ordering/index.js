import { FiPlusCircle, FiClock, FiList, FiBox } from "react-icons/fi";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/router";

export default function OrderingSwitchMenu() {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  const cards = [
    {
      title: "Create Order",
      icon: <FiPlusCircle size={80} />,
      color: "#4CAF50",
      path: "ordering/create-order",
    },
    {
      title: "Order History",
      icon: <FiClock size={80} />,
      color: "#2196F3",
      path: "ordering/history",
    },
    {
      title: "Active Orders",
      icon: <FiList size={80} />,
      color: "#FF9800",
      path: "ordering/active",
    },
  ];

  const Card = ({ title, icon, color, path }) => (
    <div
      onClick={() => router.push(`/${restaurantUsername}/dashboard/${path}`)}
      style={{
        backgroundColor: "#1E1E2F",
        borderRadius: 20,
        padding: "4rem 3rem",
        border: `2px solid ${color}30`,
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        minHeight: "340px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = `0 20px 40px ${color}40`;
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.backgroundColor = "#26263A";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = `${color}30`;
        e.currentTarget.style.backgroundColor = "#1E1E2F";
      }}
    >
      {/* Subtle background dot */}
      <div
        style={{
          position: "absolute",
          top: -70,
          right: -70,
          width: 140,
          height: 140,
          borderRadius: "50%",
          backgroundColor: `${color}10`,
          opacity: 0.4,
        }}
      />

      {/* Icon container */}
      <div
        style={{
          backgroundColor: `${color}20`,
          borderRadius: "50%",
          padding: "2.5rem",
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h2
        style={{
          margin: 0,
          fontSize: "2rem",
          fontWeight: 700,
          color: "#FFF",
        }}
      >
        {title}
      </h2>
    </div>
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div
        style={{
          marginBottom: "1.5rem",
          textAlign: "center",
          paddingTop: "2rem", 
        }}
      >
        <h1
          style={{
            color: "#FFF",
            fontSize: "2.5rem",
            fontWeight: 700,
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <FiBox style={{ color: "#4CAF50" }} />
          Ordering Hub
        </h1>
        <p
          style={{
            color: "#CCC",
            fontSize: "1.1rem",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          Manage and track orders seamlessly — create new orders, view active orders, and check order history.
        </p>
      </div>

      <div
        style={{
          padding: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "2rem",
          minHeight: "60vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </DashboardLayout>
  );
}
