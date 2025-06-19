import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import SummaryCard from "@/components/SummaryCard";
import IngredientTable from "@/components/IngredientTable";
import { apiFetch } from "@/lib/api";
import { Modal, Button } from "react-bootstrap";
import Style from "../menu-management/menuManage.module.css";

export default function IngredientManagementPage() {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  const [ingredients, setIngredients] = useState([]);
  const [totals, setTotals] = useState({
    totalIngredients: 0,
    lowStock: 0,
    criticalStock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [deleteIngredientModalOpen, setDeleteIngredientModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const loadIngredients = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
      }).toString();
      const {
        ingredients: list,
        total,
        totalLowStock,
        totalCriticalStock,
      } = await apiFetch(`/ingredients?${params}`);

      setIngredients(list);
      setTotalItems(total);
      setTotals({
        totalIngredients: total,
        lowStock: totalLowStock,
        criticalStock: totalCriticalStock,
      });
    } catch (err) {
      console.error("Failed to load ingredients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, [currentPage, searchTerm]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleDeleteIngredient = async () => {
    if (!selectedIngredient) return;
    setDeleteIngredientModalOpen(false);
    try {
      await apiFetch(`/ingredients/${selectedIngredient._id}`, { method: "DELETE" });
      await loadIngredients();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <DashboardLayout>
      <ManagerOnly>
        <h1>Ingredient Management</h1>

        {loading ? (
          <p>Loading ingredients…</p>
        ) : (
          <>
            <div style={{ display: "flex", gap: "1rem", margin: "1.5rem 0" }}>
              <SummaryCard label="Total Ingredients" value={totals.totalIngredients} color="#4CAF50" />
              <SummaryCard label="Low Stock" value={totals.lowStock} color="#FF8C00" />
              <SummaryCard label="Critical Stock" value={totals.criticalStock} color="#E53935" />
            </div>

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
                  router.push(`/${restaurantUsername}/dashboard/ingredient-management/create`)
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
                Add Ingredient +
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem", padding: "0 1rem" }}>
              <svg
                style={{ marginRight: "0.5rem", color: "#FFF" }}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search ingredients by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.5rem 1rem",
                  borderRadius: 4,
                  border: "1px solid #3A3A4A",
                  backgroundColor: "#2A2A3A",
                  color: "#FFF",
                  width: "100%",
                }}
              />
            </div>

            <IngredientTable
              ingredients={ingredients}
              onEdit={(ingredient) => {
                router.push(`/${restaurantUsername}/dashboard/ingredient-management/edit/${ingredient._id}`);
              }}
              onDelete={(ingredient) => {
                setSelectedIngredient(ingredient);
                setDeleteIngredientModalOpen(true);
              }}
            />

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

            {/* Delete Ingredient Modal */}
            <Modal
              contentClassName={Style.modalContent}
              centered
              show={deleteIngredientModalOpen}
              onHide={() => setDeleteIngredientModalOpen(false)}
            >
              <Modal.Header className={Style.modalHeader}>
                <Modal.Title>Delete Ingredient</Modal.Title>
              </Modal.Header>
              <Modal.Body className={Style.modalBody}>
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{selectedIngredient?.name}</strong>?
                </p>
              </Modal.Body>
              <Modal.Footer className={Style.modalFooter}>
                <Button variant="secondary" onClick={() => setDeleteIngredientModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteIngredient}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </ManagerOnly>
    </DashboardLayout>
  );
}
