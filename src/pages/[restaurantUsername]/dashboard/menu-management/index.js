import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { apiFetch } from "@/lib/api";
import MenuItemTable from "@/components/MenuItemTable";
import SummaryCard from "@/components/SummaryCard";
import CategoryModal from "@/components/CategoryModal";
import { Button, Modal, Pagination } from "react-bootstrap";
import Style from "./menuManage.module.css";

export default function MenuManagementPage() {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteMenuModalOpen, setDeleteMenuModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemRes, catRes] = await Promise.all([
          apiFetch("/menu-management"),
          apiFetch("/categories"),
        ]);

        const categoryMap = {};
        (catRes.categories || []).forEach((cat) => {
          categoryMap[cat._id] = cat.name;
        });

        const rawItems = Array.isArray(itemRes.menuItems)
          ? itemRes.menuItems
          : [];

        const itemsWithCategoryNames = rawItems.map((item) => ({
          ...item,
          categoryName: categoryMap[item.category] || "Unknown",
        }));

        setCategories(catRes.categories || []);
        setMenuItems(itemsWithCategoryNames);
        calculateStats(itemsWithCategoryNames); 
      } catch (err) {
        console.error("Failed to load menu items or categories", err);
        setMenuItems([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  async function loadItems() {
    try {
      const res = await apiFetch(`/menu-management`);
      const items = Array.isArray(res.menuItems) ? res.menuItems : [];
      const categoryMap = {}; // Re-create categoryMap if categories are not reloaded with items
      categories.forEach((cat) => {
        categoryMap[cat._id] = cat.name;
      });
      const itemsWithCategoryNames = items.map((item) => ({
        ...item,
        categoryName: categoryMap[item.category] || "Unknown",
      }));
      setMenuItems(itemsWithCategoryNames);
      calculateStats(itemsWithCategoryNames);
      setCurrentPage(1); // Reset page after items are reloaded (e.g. after deletion)
    } catch (err) {
      console.error("Failed to load menu items", err);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const res = await apiFetch(`/categories`);
      setCategories(res.categories || []);
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategories([]);
    }
  }

  function calculateStats(items) {
    const catMap = {};
    for (const item of items) {
      // Use item.categoryName if it's already mapped, otherwise fallback to item.category
      const cat = item.categoryName?.trim() || item.category?.trim() || "Uncategorized";
      catMap[cat] = (catMap[cat] || 0) + 1;
    }
    setCategoryCounts(catMap);
  }

  const filteredAndSearchedItems = Array.isArray(menuItems)
    ? menuItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategoryFilter === "all" || item.categoryName === selectedCategoryFilter;
        return matchesSearch && matchesCategory;
      })
    : [];

  const totalFilteredItems = filteredAndSearchedItems.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSearchedItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteCategoryConfirm = async (category) => {
    setDeleteModalOpen(false);
    try {
      await apiFetch(`/categories/${category._id}`, {
        method: "DELETE",
      });
      loadCategories(); // Reload categories list
      loadItems(); // Reload menu items as category deletion might affect them
    } catch (err) {
      console.error("Delete category failed", err);
    }
  };

  const handleDeleteMenuItem = async () => { 
    if (!selectedMenuItem) return; 
    setDeleteMenuModalOpen(false);
    try {
      await apiFetch(`/menu-management/${selectedMenuItem._id}`, { // Use selectedMenuItem
        method: "DELETE",
      });
      loadItems(); // Reload menu items to update the table
    } catch (err) {
      console.error("Delete menu item failed", err);
    }
  };

  return (
    <DashboardLayout>
      <ManagerOnly>
        
        <h1>🍔 Menu Management</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "1.5rem 0",
            gap: "2rem",
          }}
        >
          <div
            style={{
              flex: 1.5,
              backgroundColor: "#1E1E2F",
              padding: "1rem",
              borderRadius: 8,
            }}
          >
            <h3 style={{ color: "#FFF", marginBottom: "0.75rem" }}>Categories</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #444", color: "#AAA" }}>
                  <th style={{ textAlign: "left", paddingBottom: 8 }}>Category</th>
                  <th style={{ textAlign: "right", paddingBottom: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id} style={{ borderBottom: "1px solid #333" }}>
                    <td style={{ color: "#FFF", padding: "0.5rem 0" }}>{cat.name}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#4FC3F7",
                        }}
                      >
                        ❌ Delete
                      </button>
                      <button
                        onClick={() => handleEditCategory(cat)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#4FC3F7",
                        }}
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={handleAddCategory}
              style={{
                marginTop: "1rem",
                backgroundColor: "#4CAF50",
                color: "#FFF",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              ➕ Add Category
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <SummaryCard label="Total Menu Items" value={menuItems.length} color="#4CAF50" />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <button
            onClick={() =>
              router.push(`/${restaurantUsername}/dashboard/menu-management/create`)
            }
            style={{
              backgroundColor: "#388E3C",
              color: "#FFF",
              border: "none",
              padding: "0.5rem 1.25rem",
              borderRadius: 4,
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Add Menu Item +
          </button>
        </div>

        <div
          style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}
        >
          <label htmlFor="category-filter" style={{ color: "#FFF" }}>Filter:</label>
          <select
            id="category-filter"
            value={selectedCategoryFilter}
            onChange={(e) => {
              setSelectedCategoryFilter(e.target.value);
              setCurrentPage(1); 
            }}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 4,
              border: "1px solid #3A3A4A",
              backgroundColor: "#2A2A3A",
              color: "#FFF",
            }}
          >
            <option value="all">All</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search menu items by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search change
            }}
            style={{
              flex: 1,
              padding: "0.5rem 1rem",
              borderRadius: 4,
              border: "1px solid #3A3A4A",
              backgroundColor: "#2A2A3A",
              color: "#FFF",
            }}
          />
        </div>

        <MenuItemTable
          items={currentItems} 
          restaurantUsername={restaurantUsername}
          onDelete={(item) => {
            setSelectedMenuItem(item);
            setDeleteMenuModalOpen(true);
          }}
          onEdit={(item) => {
            router.push(`/${restaurantUsername}/dashboard/menu-management/edit/${item._id}`);
          }}
        />

        {totalFilteredItems > itemsPerPage && ( // Only show pagination if there's more than one page
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  backgroundColor: currentPage === i + 1 ? "#388E3C" : "#2A2A3A",
                  color: "#FFF",
                  border: "none",
                  padding: "0.5rem 1rem",
                  margin: "0 0.25rem",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}


        {modalOpen && (
          <CategoryModal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              loadCategories();
              loadItems(); 
            }}
            initialName={selectedCategory?.name || ""}
            categoryId={selectedCategory?._id || null}
            isEditing={isEditing}
          />
        )}

        <Modal
          contentClassName={Style.modalContent}
          centered
          show={deleteModalOpen}
          onHide={() => setDeleteModalOpen(false)}
        >
          <Modal.Header className={Style.modalHeader}>
            <Modal.Title>Delete Category</Modal.Title>
          </Modal.Header>
          <Modal.Body className={Style.modalBody}>
            <p>
              Are you sure you want to delete {selectedCategory != null ? selectedCategory.name : ""}.
            </p>
          </Modal.Body>
          <Modal.Footer className={Style.modalFooter}>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Close
            </Button>
            <Button variant="danger" onClick={() => handleDeleteCategoryConfirm(selectedCategory)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          contentClassName={Style.modalContent}
          centered
          show={deleteMenuModalOpen}
          onHide={() => setDeleteMenuModalOpen(false)}
        >
          <Modal.Header className={Style.modalHeader}>
            <Modal.Title>Delete Menu Item</Modal.Title>
          </Modal.Header>
          <Modal.Body className={Style.modalBody}>
            <p>
              Are you sure you want to delete {selectedMenuItem != null ? selectedMenuItem.name : ""}.
            </p>
          </Modal.Body>
          <Modal.Footer className={Style.modalFooter}>
            <Button variant="secondary" onClick={() => setDeleteMenuModalOpen(false)}>
              Close
            </Button>
            <Button variant="danger" onClick={handleDeleteMenuItem}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </ManagerOnly>
    </DashboardLayout>
  );
}