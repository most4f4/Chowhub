import DashboardLayout from "@/components/DashboardLayout";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Modal, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import Style from "./createOrder.module.css";

export default function CreateOrder() {
  const [cartItems, setCartItems] = useState([]);
  const [menuItems, setMenuitems] = useState([]);
  const [categories, setCatgories] = useState([]);
  const [choosenCategory, setChoosenCategory] = useState(null);
  const [selectedMenuItems, setSelectedMenuItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailViewMenuItem, setDetailViewMenuItem] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantiy, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [groupedMenuItems, setGroupedMenuItems] = useState({});
  const [ingredients, setIngredients] = useState({});
  const taxRate = 0.13;
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Extract menu fetching logic into a separate function
  async function fetchMenuData() {
    try {
      setLoading(true);

      const resMenu = await apiFetch("/menu-management", {
        method: "GET",
      });

      // Process menu items for availability
      resMenu.menuItems.forEach((item) => {
        item.isDisabled = item.variations.every((v) => v.isAvailable === false);
      });

      console.log("MENU ITEMS: ", resMenu.menuItems);
      setMenuitems(resMenu.menuItems);

      const resCat = await apiFetch("/categories", { method: "GET" });
      console.log("CATEGORIES:", resCat.categories);
      setCatgories(resCat.categories);

      const grouped = resCat.categories.reduce((acc, category) => {
        acc[category._id] = resMenu.menuItems.filter((item) => item.category === category._id);
        return acc;
      }, {});

      setGroupedMenuItems(grouped);
    } catch (error) {
      console.error("Error fetching menu data:", error);
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  }

  const subtotal = cartItems.reduce((sum, entry) => {
    const variant = entry.item.variations.find((v) => v._id === entry.variant);
    return sum + (variant?.price || 0) * entry.quantity;
  }, 0);
  const tax = subtotal * taxRate;
  const total = tax + subtotal;

  // Initial load
  useEffect(() => {
    fetchMenuData();
  }, []);

  async function setItemsToCategory(categoryId) {
    setLoading(true);
    setChoosenCategory(categoryId);
    const filtered = menuItems.filter((item) => item.category === categoryId);
    setSelectedMenuItems(filtered);
    console.log(selectedMenuItems);
    setLoading(false);
  }

  function goBack() {
    setChoosenCategory(null);
    setSelectedMenuItems(null);
  }

  function viewSpecificItem(itemId) {
    const item = menuItems.find((item) => item._id === itemId);
    setDetailViewMenuItem(item);
    console.log(item);
  }

  function addItemToCart() {
    setCartItems((arr) => {
      const newCart = [
        ...arr,
        { item: detailViewMenuItem, variant: selectedVariantId, quantity: quantiy },
      ];
      return mergeExistingItems(newCart);
    });

    console.log(cartItems);
    setDetailViewMenuItem(null);
    setQuantity(1);
    setSelectedVariantId(null);
  }

  function mergeExistingItems(items) {
    const merged = [];

    for (const entry of items) {
      const existingIndex = merged.findIndex(
        (e) => e.item._id === entry.item._id && e.variant === entry.variant,
      );

      if (existingIndex !== -1) {
        merged[existingIndex].quantity += entry.quantity;
      } else {
        merged.push({ ...entry });
      }
    }

    return merged;
  }

  function removeItemFromCart(index) {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function submitOrder(cartItems) {
    setSubmittingOrder(true);

    const orderLineItems = cartItems.map((entry) => {
      const variant = entry.item.variations.find((v) => v._id === entry.variant);
      const quantity = entry.quantity || 1;
      const price = variant?.price || 0;
      const subTotal = quantity * price;

      return {
        menuItemId: entry.item._id,
        name: entry.item.name,
        variationName: variant?.name,
        quantity,
        price,
        subTotal,
      };
    });
    const subtotal = orderLineItems.reduce((acc, item) => acc + item.subTotal, 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    try {
      const res = await apiFetch("/order/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderLineItems,
          subtotal: subtotal.toFixed(2),
          tax: tax.toFixed(2),
          total: total.toFixed(2),
          comment,
        }),
      });

      if (res.error) {
        console.error("Failed to submit order:", res.error);
        toast.error("Failed to submit order: " + res.error);
        return; // This was the problem - return without finally block!
      }

      toast.success(`✅ Order has been successfully placed`);
      setCartItems([]);
      setComment("");

      console.log("Refreshing menu data after order submission...");
      await fetchMenuData();

      console.log("Order submitted successfully:", res);
    } catch (err) {
      console.error("Error submitting order:", err);
      toast.error("An error occurred while submitting the order");
    } finally {
      // FIXED: This finally block ensures setSubmittingOrder(false) ALWAYS runs
      setSubmittingOrder(false);
    }
  }

  return (
    <>
      {/* Detail view of the item */}
      {detailViewMenuItem ? (
        <Modal
          show={detailViewMenuItem !== null}
          onHide={() => {
            setDetailViewMenuItem(null);
            setSelectedVariantId(null);
          }}
          centered
          contentClassName={Style.darkModal}
          size="xl"
        >
          <Modal.Header contentClassName={Style.darkModalHeader}>
            <Modal.Title>{detailViewMenuItem?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body contentClassName={Style.darkModalBody}>
            <div className="text-center mb-3">
              <Image src={detailViewMenuItem?.image} thumbnail></Image>
            </div>
            <p>{detailViewMenuItem?.description}</p>
            <strong>Quantity:</strong>
            <input
              type="number"
              min="1"
              className="form-control w-25"
              value={quantiy}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            <strong>Choose a variant:</strong>
            {detailViewMenuItem?.variations?.map((variant) => (
              <div className="form-check" key={variant._id}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="variant"
                  id={`variant-${variant._id}`}
                  value={variant._id}
                  checked={selectedVariantId === variant._id}
                  disabled={variant.isAvailable === false}
                  onChange={() => setSelectedVariantId(variant._id)}
                />
                <label className="form-check-label" htmlFor={`variant-${variant._id}`}>
                  {variant.name} — ${variant.price}
                  {!variant.isAvailable && (
                    <span
                      style={{
                        color: "#f88",
                        marginLeft: "0.5rem",
                        fontWeight: "normal",
                        fontSize: "0.9rem",
                      }}
                    >
                      (Out of stock)
                    </span>
                  )}
                </label>
                <div style={{ fontSize: "0.85rem", color: "#AAA", marginLeft: "1.8rem" }}>
                  Ingredients:{" "}
                  {variant.ingredients && variant.ingredients.length > 0
                    ? variant.ingredients.map((ing) => ing.name).join(", ")
                    : "No ingredients listed"}
                </div>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer contentClassName={Style.darkModalFooter}>
            <Button
              variant="secondary"
              onClick={() => {
                setDetailViewMenuItem(null);
                setSelectedVariantId(null);
              }}
            >
              Close
            </Button>
            <Button
              variant="primary"
              disabled={!selectedVariantId}
              onClick={() => {
                addItemToCart();
              }}
            >
              Add to Cart
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}

      <DashboardLayout>
        {/* FIXED: Use proper Container with responsive padding */}
        <div
          style={{
            width: "100%",
            maxWidth: "none",
            padding: "0",
            margin: "0",
          }}
        >
          {/* Header with refresh button */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 style={{ color: "#CCC", margin: 0 }}>Menu</h1>
            <Button
              variant="outline-secondary"
              onClick={fetchMenuData}
              disabled={loading}
              size="sm"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Refreshing...
                </>
              ) : (
                "🔄 Refresh Menu"
              )}
            </Button>
          </div>

          {/* FIXED: Use flexbox layout instead of Bootstrap grid */}
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              height: "calc(100vh - 140px)", // Adjust based on your header height
              overflow: "hidden",
            }}
          >
            {/* Menu Section - Left Side */}
            <div
              style={{
                flex: "1",
                overflowY: "auto",
                paddingRight: "1rem",
              }}
            >
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" />
                  <p className="mt-2" style={{ color: "#CCC" }}>
                    Loading menu items...
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {categories.map((cat) => (
                    <div key={cat._id}>
                      <h2 className="text-center mb-3" style={{ color: "#CCC" }}>
                        {cat.name}
                      </h2>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                          gap: "1rem",
                        }}
                      >
                        {groupedMenuItems[cat._id]?.map((item) => (
                          <div
                            key={item._id}
                            onClick={() => !item.isDisabled && viewSpecificItem(item._id)}
                            style={{
                              background: item.isDisabled ? "#444" : "#2A2A3A",
                              border: "1px solid #444",
                              color: item.isDisabled ? "#888" : "#CCC",
                              padding: "1rem",
                              borderRadius: "0.5rem",
                              cursor: item.isDisabled ? "not-allowed" : "pointer",
                              textAlign: "left",
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.5rem",
                              opacity: item.isDisabled ? 0.5 : 1,
                              pointerEvents: item.isDisabled ? "none" : "auto",
                              transition: "all 0.3s ease",
                              ":hover": !item.isDisabled
                                ? {
                                    background: "#3A3A4A",
                                  }
                                : {},
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                borderRadius: "0.5rem",
                                width: "100%",
                                height: "180px",
                                objectFit: "cover",
                              }}
                            />
                            <strong>
                              {item.name}
                              {item.isDisabled && (
                                <span
                                  style={{
                                    color: "#f88",
                                    marginLeft: "0.5rem",
                                    fontWeight: "normal",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  (Out of stock)
                                </span>
                              )}
                            </strong>
                            <small style={{ color: "#AAA" }}>
                              Ingredients:{" "}
                              {item.variations[0]?.ingredients &&
                              item.variations[0].ingredients.length > 0
                                ? (() => {
                                    const fullString = item.variations[0].ingredients
                                      .map((ing) => ing.name)
                                      .join(", ");
                                    const maxLength = 50;
                                    return fullString.length > maxLength
                                      ? fullString.slice(0, maxLength) + "..."
                                      : fullString;
                                  })()
                                : "No ingredients listed"}
                            </small>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Section - Right Side (Fixed Width) */}
            <div
              style={{
                width: "350px",
                flexShrink: 0,
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  background: "#1f1f2a",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  color: "#CCC",
                  height: "fit-content",
                  position: "sticky",
                  top: "0",
                }}
              >
                <h3 style={{ marginBottom: "1rem" }}>Cart</h3>
                {cartItems.length === 0 ? (
                  <p style={{ color: "#888", fontStyle: "italic" }}>No items in cart.</p>
                ) : (
                  <div style={{ marginBottom: "1rem" }}>
                    {cartItems.map((entry, idx) => {
                      const item = entry.item;
                      const variant = item.variations.find((v) => v._id === entry.variant);
                      return (
                        <div
                          key={idx}
                          style={{
                            marginBottom: "1rem",
                            padding: "0.75rem",
                            background: "#2A2A3A",
                            borderRadius: "0.5rem",
                            border: "1px solid #444",
                          }}
                        >
                          <strong style={{ display: "block", marginBottom: "0.25rem" }}>
                            {item.name}
                          </strong>
                          <div style={{ fontSize: "0.9rem", color: "#AAA" }}>
                            <div>Variant: {variant?.name || "N/A"}</div>
                            <div>Quantity: {entry.quantity}</div>
                            <div>
                              Price: ${(variant?.price * entry.quantity).toFixed(2) || "0.00"}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => removeItemFromCart(idx)}
                            style={{ marginTop: "0.5rem" }}
                          >
                            Remove
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div
                  style={{
                    borderTop: "1px solid #444",
                    paddingTop: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <div style={{ marginBottom: "0.5rem" }}>
                    <strong>Subtotal: ${subtotal.toFixed(2)}</strong>
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <strong>Tax (13%): ${tax.toFixed(2)}</strong>
                  </div>
                  <div style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
                    <strong>Total: ${total.toFixed(2)}</strong>
                  </div>

                  <Form.Control
                    onChange={(e) => setComment(e.target.value)}
                    type="text"
                    value={comment}
                    placeholder="Comments"
                    style={{ marginBottom: "1rem" }}
                  />

                  <Button
                    variant="success"
                    onClick={() => submitOrder(cartItems)}
                    disabled={cartItems.length === 0 || submittingOrder}
                    style={{ width: "100%" }}
                  >
                    {submittingOrder ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Order"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
