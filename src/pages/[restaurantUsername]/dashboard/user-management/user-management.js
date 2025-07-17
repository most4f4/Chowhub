import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import SummaryCard from "@/components/SummaryCard";
import DataTable from "@/components/DataTable";
import { apiFetch } from "@/lib/api";
import NotificationBell from "@/components/NotificationBell";
export default function UserManagementPage() {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  // State for users and totals
  const [users, setUsers] = useState([]);
  const [totals, setTotals] = useState({ total: 0, active: 0, deactivated: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { users: list, total } = await apiFetch("/users?page=1&limit=10");
        setUsers(list);

        const activeCount = list.filter((u) => u.isActive).length;
        setTotals({
          total,
          active: activeCount,
          deactivated: total - activeCount,
        });
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Prepare rows for DataTable
  const rows = users.map((u) => ({
    fullName: `${u.firstName} ${u.lastName}`,
    username: u.username,
    email: u.email,
    role: u.role,
    status: u.isActive ? "Active" : "Inactive",
    phone: u.phone,
    emergencyContact: u.emergencyContact,
    _id: u._id,
  }));

  const columns = [
    { header: "Name", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    { header: "Status", accessor: "status" },
    { header: "Phone", accessor: "phone" },
    { header: "Emergency Contact", accessor: "emergencyContact" },
  ];

  return (
    <DashboardLayout>
      <ManagerOnly>
        <h1>👥 User Management</h1>

        {loading ? (
          <p>Loading users…</p>
        ) : (
          <>
            {/* Summary cards */}
            <div style={{ display: "flex", gap: "1rem", margin: "1.5rem 0" }}>
              <SummaryCard label="Total Users" value={totals.total} color="#FF8C00" />
              <SummaryCard label="Active Users" value={totals.active} color="#4CAF50" />
              <SummaryCard label="Inactive Users" value={totals.deactivated} color="#E53935" />
            </div>

            {/* Create User button aligned right */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "1rem",
                paddingRight: "1rem",
              }}
            >
              <button
                onClick={() =>
                  router.push(`/${restaurantUsername}/dashboard/user-management/create`)
                }
                style={{
                  backgroundColor: "#388E3C", // darker green
                  color: "#FFF",
                  border: "none",
                  padding: "0.5rem 1.25rem",
                  borderRadius: 4,
                  fontSize: "1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Create User +
              </button>
            </div>

            {/* Data table with edit button */}
            <DataTable
              columns={columns}
              data={rows}
              renderActions={(row) => (
                <button
                  onClick={() =>
                    router.push({
                      pathname: `/${restaurantUsername}/dashboard/user-management/edit/${row.username}`,
                      query: {
                        fullName: `${row.fullName}`,
                        username: `${row.username.value}`,
                        email: `${row.email}`,
                        role: `${row.role}`,
                        userStatus: `${row.status}`,
                        phone: `${row.status}`,
                        emergencyContact: `${row.emergencyContact}`,
                        _id: `${row._id}`,
                      },
                    })
                  }
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  ✏️
                </button>
              )}
            />
          </>
        )}
      </ManagerOnly>
    </DashboardLayout>
  );
}
