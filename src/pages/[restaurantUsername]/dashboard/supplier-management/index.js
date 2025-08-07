// Source Code\chowhub\src\pages\[restaurantUsername]\dashboard\supplier-management\index.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import SupplierTable from "@/components/SupplierTable";
import { apiFetch } from "@/lib/api";
import { Modal, Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAtomValue, getDefaultStore } from "jotai";
import { userAtom, tokenAtom } from "@/store/atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function SupplierManagementPage() {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  // Jotai for user and token management (for 401 handling)
  const user = useAtomValue(userAtom);
  const store = getDefaultStore();
  const token = store.get(tokenAtom);

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // New state for the debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // States for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const loadSuppliers = async (currentSearchTerm) => {
    if (!token) {
      setLoading(false);
      return; // Exit if no token, user is not authenticated
    }

    try {
      setLoading(true);
      setError(null); // Clear previous errors on new load attempt
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: currentSearchTerm,
      }).toString();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in headers
        },
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle 401 Unauthorized specifically
        if (res.status === 401) {
          store.set(tokenAtom, null);
          store.set(userAtom, null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error("Session expired, please log in again.");
          window.location.href = "/login"; // Redirect to login page
          return;
        }
        throw new Error(data.error || "Failed to fetch suppliers");
      }

      setSuppliers(data.suppliers);
      setTotalItems(data.total);
    } catch (err) {
      console.error("Failed to load suppliers", err);
      setError(err.message || "An unexpected error occurred while loading suppliers.");
      toast.error(err.message || "Failed to load suppliers."); // Show toast notification
    } finally {
      setLoading(false);
    }
  };

  // Effect for debouncing the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Debounce delay: 500ms

    // Cleanup function: This will clear the timeout if searchTerm changes before 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    // Only fetch if router is ready and user/token data is available
    if (restaurantUsername && token) {
      loadSuppliers(debouncedSearchTerm);
    }
  }, [currentPage, debouncedSearchTerm, restaurantUsername, token]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleEdit = (supplier) => {
    // Navigate to the edit page for the specific supplier
    if (user && user.restaurantUsername) {
      router.push(`/${user.restaurantUsername}/dashboard/supplier-management/edit/${supplier._id}`);
    } else {
      toast.error("Restaurant username not found. Cannot navigate to edit page.");
    }
  };

  const handleDeleteConfirm = (supplier) => {
    setSupplierToDelete(supplier);
    setShowDeleteModal(true);
  };

  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) return;

    try {
      setLoading(true); // Indicate loading while deleting
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/suppliers/${supplierToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          store.set(tokenAtom, null);
          store.set(userAtom, null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error("Session expired, please log in again.");
          window.location.href = "/login";
          return;
        }
        throw new Error(data.error || "Failed to delete supplier");
      }

      toast.success(`✅ Supplier "${supplierToDelete.name}" deleted successfully!`, {
        position: "top-center",
        autoClose: 3000,
      });
      // Reload suppliers list after successful deletion, staying on the same page
      await loadSuppliers(debouncedSearchTerm);
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err.message || "An unexpected error occurred during deletion.");
      toast.error(err.message || "Failed to delete supplier.");
    } finally {
      setShowDeleteModal(false); // Close modal regardless of success/failure
      setSupplierToDelete(null); // Clear supplier to delete
      setLoading(false); // Reset loading state
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSupplierToDelete(null);
  };

  return (
    <DashboardLayout>
      <ManagerOnly>
        <h1>🤝 Supplier Management</h1>

        {/* Loading indicator */}
        {loading && <p style={{ textAlign: "center", color: "#FFF" }}>Loading suppliers…</p>}
        {/* Error display */}
        {error && <p style={{ textAlign: "center", color: "#E53935" }}>Error: {error}</p>}

        {/* Render content only when not loading OR if loading has finished at least once and there are suppliers */}
        {(!loading || suppliers.length > 0) && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "1rem",
                paddingRight: "1rem",
              }}
            >
              <Button
                onClick={() =>
                  router.push(`/${restaurantUsername}/dashboard/supplier-management/create`)
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
                Add New Supplier +
              </Button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
                padding: "0 1rem",
              }}
            >
              <FontAwesomeIcon icon={faSearch} style={{ marginRight: "0.5rem", color: "#FFF" }} />
              <input
                type="text"
                placeholder="Search suppliers by name, contact, or email..."
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

            <SupplierTable
              suppliers={suppliers}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
            />

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1rem",
                }}
              >
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
          </>
        )}

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
          <Modal.Header closeButton className="bg-dark text-light border-bottom-0">
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light">
            <p>
              Are you sure you want to permanently delete supplier &quot;
              <strong>{supplierToDelete?.name}</strong>&quot;? This action cannot be undone.
            </p>
          </Modal.Body>
          <Modal.Footer className="bg-dark border-top-0">
            <Button variant="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteSupplier}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </ManagerOnly>
    </DashboardLayout>
  );
}
