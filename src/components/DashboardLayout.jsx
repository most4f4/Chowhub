// import { useAtomValue, useSetAtom } from 'jotai';
// import { tokenAtom, userAtom } from '@/store/atoms';
// import { useRouter } from 'next/router';
// import {
//   Drawer,
//   Box,
//   Typography,
//   Button,
//   IconButton,
//   Toolbar,
//   AppBar,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Badge,
//   Menu,
//   MenuItem,
//   InputBase,
//   Paper
// } from '@mui/material';
// import {
//   Dashboard as DashboardIcon,
//   People as PeopleIcon,
//   MenuBook as MenuIcon,
//   Inventory as InventoryIcon,
//   BarChart as SalesIcon,
//   AccessTime as ShiftsIcon,
//   Settings as SettingsIcon,
//   Notifications as NotificationsIcon,
//   AccessAlarm as AttendanceIcon
// } from '@mui/icons-material';
// import Image from 'next/image';
// import logo from '/public/images/logo.png';
// import { useEffect, useMemo, useState } from 'react';

// export default function DashboardLayout({ children }) {
//   const user = useAtomValue(userAtom);
//   const token = useAtomValue(tokenAtom);
//   const setUser = useSetAtom(userAtom);
//   const setToken = useSetAtom(tokenAtom);
//   const router = useRouter();
//   const username = router.query.restaurantUsername;

//   const isManager = user?.role === 'manager';

//   const [anchorEl, setAnchorEl] = useState(null);
//   const handleOpenNotifications = (event) => setAnchorEl(event.currentTarget);
//   const handleCloseNotifications = () => setAnchorEl(null);

//   const managerTabs = [
//     { label: 'Overview', icon: <DashboardIcon />, path: '' },
//     { label: 'Staff', icon: <PeopleIcon />, path: 'staff' },
//     { label: 'Menu', icon: <MenuIcon />, path: 'menu' },
//     { label: 'Ingredient', icon: <InventoryIcon />, path: 'ingredient' },
//     { label: 'Sales', icon: <SalesIcon />, path: 'sales' },
//     { label: 'Shifts', icon: <ShiftsIcon />, path: 'shifts' },
//     { label: 'Settings', icon: <SettingsIcon />, path: 'settings' }
//   ];

//   const staffTabs = [
//     { label: 'Overview', icon: <DashboardIcon />, path: '' },
//     { label: 'Menu', icon: <MenuIcon />, path: 'menu' },
//     { label: 'Attendance', icon: <AttendanceIcon />, path: 'attendance' }
//   ];

//   const visibleTabs = useMemo(() => (isManager ? managerTabs : staffTabs), [isManager]);
//   const currentPath = router.asPath.split('/').pop();

//   const handleLogout = () => {
//     setUser(null);
//     setToken(null);
//     router.push('/login');
//   };

//   const handleTabClick = (tabPath) => {
//     router.push(`/${username}/dashboard${tabPath ? '/' + tabPath : ''}`);
//   };

//   useEffect(() => {
//     if (!token || !user) {
//       router.push('/login');
//     }
//   }, [token, user]);

//   return (
//     <Box sx={{ display: 'flex', height: '100vh' }}>
//       {/* Sidebar */}
//       <Drawer variant="permanent" anchor="left" sx={{ width: 240 }}>
//         <Box sx={{ width: 240 }}>
//           <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
//             <Image src={logo} alt="ChowHub" width={120} height={100} />
//           </Box>
//           <List>
//             {visibleTabs.map((tab) => (
//               <ListItem
//                 key={tab.label}
//                 onClick={() => handleTabClick(tab.path)}
//                 selected={currentPath === tab.path}
//                 sx={{ cursor: 'pointer' }}
//               >
//                 <ListItemIcon>{tab.icon}</ListItemIcon>
//                 <ListItemText primary={tab.label} />
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       </Drawer>

//       {/* Main Content */}
//       <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
//         <AppBar position="static" color="default" elevation={1}>
//           <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
//             {/* Restaurant name + search */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
//                 {user?.restaurantUsername || 'My Restaurant'}
//               </Typography>
//               <Paper
//                 component="form"
//                 sx={{
//                   p: '4px 8px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   width: 280,
//                   borderRadius: '12px',
//                   backgroundColor: '#f5f5f5'
//                 }}
//               >
//                 <InputBase
//                   sx={{ ml: 1, flex: 1 }}
//                   placeholder="Search..."
//                   inputProps={{ 'aria-label': 'search dashboard' }}
//                 />
//               </Paper>
//             </Box>

//             {/* User / notifications / logout */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               {isManager && (
//                 <>
//                   <IconButton onClick={handleOpenNotifications}>
//                     <Badge color="error" variant="dot">
//                       <NotificationsIcon color="action" />
//                     </Badge>
//                   </IconButton>
//                   <Menu
//                     anchorEl={anchorEl}
//                     open={Boolean(anchorEl)}
//                     onClose={handleCloseNotifications}
//                   >
//                     <MenuItem disabled>🔔 No new notifications</MenuItem>
//                   </Menu>
//                 </>
//               )}

//               <Typography variant="body1" color="textSecondary">
//                 👤 {user?.firstName|| user?.username ||  user?.email}
//               </Typography>
//               <Button variant="outlined" size="small" color="error" onClick={handleLogout}>
//                 Logout
//               </Button>
//             </Box>
//           </Toolbar>
//         </AppBar>

//         <Box sx={{ p: 3 }}>{children}</Box>
//       </Box>
//     </Box>
//   );
// }

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAtomValue, useSetAtom } from "jotai";
import { tokenAtom, userAtom } from "@/store/atoms";
import Protected from "./Protected";
import DashboardHeader from "./DashboardHeader";
import SummaryCard from "./SummaryCard";
import { apiFetch } from "@/lib/api";
import {
  FiHome,
  FiShoppingCart,
  FiBook,
  FiBox,
  FiUsers,
  FiBarChart2,
  FiUserCheck,
  FiMenu,
  FiX,
  FiLogOut,
  FiHash,
  FiMapPin,
  FiEdit2,
} from "react-icons/fi";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const NAV_ITEMS = [
  { label: "Overview", icon: <FiHome />, path: "" },
  { label: "Ordering", icon: <FiShoppingCart />, path: "ordering" },
  { label: "Menu", icon: <FiBook />, path: "menu-management", managerOnly: true },
  { label: "Ingredients", icon: <FiBox />, path: "ingredient-management", managerOnly: true },
  { label: "Suppliers", icon: <FiUsers />, path: "supplier-management", managerOnly: true },
  { label: "Sales & Analytics", icon: <FiBarChart2 />, path: "sales-analytics", managerOnly: true },
  { label: "Users", icon: <FiUserCheck />, path: "user-management", managerOnly: true },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { restaurantUsername } = router.query;
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 60 : 240;
  const currentPath = useMemo(() => {
    const parts = router.asPath.split("/");
    return parts[parts.length - 1] || "";
  }, [router.asPath]);

  const user = useAtomValue(userAtom);
  const isManager = user?.role === "manager";
  const tabs = useMemo(() => NAV_ITEMS.filter(tab => !tab.managerOnly || isManager), [isManager]);

  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);

  const [menuItems, setMenuItems] = useState([]);
  const [ingredientTotals, setIngredientTotals] = useState({
    totalIngredients: 0,
    lowStock: 0,
    criticalStock: 0,
  });
  const [userStats, setUserStats] = useState({ total: 0, active: 0, deactivated: 0 });
  const [restaurant, setRestaurant] = useState(null);
  const [form, setForm] = useState({ name: "", username: "", location: "" });
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.restaurantId || !user?.role) return;

    async function fetchData() {
      try {
        const restaurantRes = await apiFetch(`/restaurant/${user.restaurantId}`);

        setRestaurant(restaurantRes.restaurant || null);
        setForm({
          name: restaurantRes.restaurant.name,
          username: restaurantRes.restaurant.username,
          location: restaurantRes.restaurant.location || "",
        });

        if (user.role === "manager") {
          const [menuRes, ingredientRes, userRes] = await Promise.all([
            apiFetch("/menu-management"),
            apiFetch("/ingredients"),
            apiFetch("/users"),
          ]);

          setMenuItems(Array.isArray(menuRes.menuItems) ? menuRes.menuItems : []);

          const { ingredients = [], totalLowStock = 0, totalCriticalStock = 0 } = ingredientRes;
          setIngredientTotals({
            totalIngredients: ingredients.length,
            lowStock: totalLowStock,
            criticalStock: totalCriticalStock,
          });

          const users = userRes.users || [];
          const active = users.filter((u) => u.isActive).length;
          const deactivated = users.length - active;
          setUserStats({ total: users.length, active, deactivated });
        }
      } catch (err) {
        console.error("Failed to load dashboard overview data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/${user.restaurantId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update");
      toast.success("✅ Restaurant profile updated");
      setShowEdit(false);
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.replace("/login");
  };

  if (loading) {
    return <div style={{ color: "#FFF", padding: "2rem" }}>Loading dashboard...</div>;
  }

  return (
    <Protected>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <div style={{ width: sidebarWidth, backgroundColor: "#1E1E2F", color: "#FFF", transition: "width 0.2s", overflow: "hidden" }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{ margin: "1rem", background: "none", border: "none", color: "#FFF", fontSize: "1.5rem", cursor: "pointer" }}>
            {collapsed ? <FiMenu /> : <FiX />}
          </button>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
            {tabs.map(({ label, icon, path }) => {
              const selected = currentPath === path;
              return (
                <li key={path} style={{ margin: "0.5rem 0" }}>
                  <Link href={`/${restaurantUsername}/dashboard${path ? "/" + path : ""}`} style={{ display: "flex", alignItems: "center", textDecoration: "none", color: selected ? "#FFF" : "rgba(255,255,255,0.6)", padding: "0.75rem 1rem", fontWeight: selected ? 600 : 500, fontSize: "0.95rem" }}>
                    <span style={{ marginRight: collapsed ? 0 : 12, fontSize: "1.2rem" }}>{icon}</span>
                    {!collapsed && <span>{label}</span>}
                  </Link>
                </li>
              );
            })}
            <li style={{ margin: "0.5rem 0" }}>
              <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", width: "100%", background: "none", border: "none", color: "rgba(255,255,255,0.6)", padding: "0.75rem 1rem", cursor: "pointer", fontWeight: 500, fontSize: "0.95rem" }}>
                <span style={{ marginRight: collapsed ? 0 : 12, fontSize: "1.2rem" }}><FiLogOut /></span>
                {!collapsed && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div style={{ flexGrow: 1, backgroundColor: "#121212", color: "#FFF", padding: "1.5rem", overflowY: "auto" }}>
          <DashboardHeader />

          {router.pathname.endsWith("/dashboard") && restaurant && (
            <div style={{ backgroundColor: "#1E1E2F", padding: "1rem 1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="d-flex align-items-center gap-2"><FiHome /> {form.name}</h5>
                  <p><FiHash /> <strong>Username:</strong> {form.username}</p>
                  <p><FiMapPin /> <strong>Location:</strong> {form.location || "—"}</p>
                </div>
                {isManager && (
                  <Button variant="outline-light" size="sm" onClick={() => setShowEdit((prev) => !prev)} title="Edit Restaurant Info">
                    <FiEdit2 />
                  </Button>
                )}
              </div>
            </div>
          )}

          {router.pathname.endsWith("/dashboard") && isManager && showEdit && (
            <Form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Restaurant Name</Form.Label>
                <Form.Control type="text" required name="name" value={form.name} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Restaurant Username</Form.Label>
                <Form.Control type="text" required name="username" value={form.username} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control type="text" name="location" value={form.location} onChange={handleChange} />
              </Form.Group>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
              <Button variant="secondary" className="ms-2" onClick={() => setShowEdit(false)} disabled={saving}>Cancel</Button>
            </Form>
          )}

          {router.pathname.endsWith("/dashboard") && isManager && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "2rem" }}>
              <div>
                <h5>🧂 Ingredients</h5>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                  <SummaryCard label="Total Ingredients" value={ingredientTotals.totalIngredients} color="#009688" />
                  <SummaryCard label="Low Stock" value={ingredientTotals.lowStock} color="#FF8C00" />
                  <SummaryCard label="Critical Stock" value={ingredientTotals.criticalStock} color="#E53935" />
                </div>
              </div>
              <div>
                <h5>🍔 Menu Items</h5>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                  <SummaryCard label="Total Menu Items" value={menuItems.length} color="#4CAF50" />
                </div>
              </div>
              <div>
                <h5>👥 Users</h5>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                  <SummaryCard label="Total Users" value={userStats.total} color="#FF8C00" />
                  <SummaryCard label="Active Users" value={userStats.active} color="#4CAF50" />
                  <SummaryCard label="Inactive Users" value={userStats.deactivated} color="#E53935" />
                </div>
              </div>
            </div>
          )}

          {children}
        </div>
      </div>
    </Protected>
  );
}
