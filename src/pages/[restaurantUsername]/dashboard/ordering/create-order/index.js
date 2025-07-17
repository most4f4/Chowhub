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
  const subtotal = cartItems.reduce((sum, entry) => {
    const variant = entry.item.variations.find((v) => v._id === entry.variant);
    return sum + (variant?.price || 0) * entry.quantity;
  }, 0);
  const tax = subtotal * taxRate;
  const total = tax + subtotal;
  //get menu items
  useEffect(() => {
    async function getMenuItems() {
      const resMenu = await apiFetch("/menu-management", {
        method: "GET",
      });
      //   const data = await res.json();
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
      setLoading(false);
    }
    getMenuItems();
  }, []);
  async function setItemsToCategory(categoryId) {
    setLoading(true);
    setChoosenCategory(categoryId);
    const filtered = menuItems.filter((item) => item.category === categoryId);
    setSelectedMenuItems(filtered);
    console.log(selectedMenuItems);
    // setChoosenCategory;

    setLoading(false);
  }
  function goBack() {
    setChoosenCategory(null);
    setSelectedMenuItems(null);
  }

  function viewSpecificItem(itemId) {
    const item = menuItems.find((item) => item._id === itemId);
    // const item = selectedMenuItems.find((item) => item._id === itemId);
    setDetailViewMenuItem(item);
    console.log(item);
  }
  function addItemToCart() {
    setCartItems((arr) => {
      // Add new item to array
      const newCart = [
        ...arr,
        { item: detailViewMenuItem, variant: selectedVariantId, quantity: quantiy },
      ];

      // Merge duplicates
      return mergeExistingItems(newCart);
    });

    console.log(cartItems);
    setDetailViewMenuItem(null);
    setQuantity(1);
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
        console.error("Failed to submit order:", error);
        return;
      }
      toast.success(`✅ Order has been successfully placed`);
      //clear data
      setCartItems([]);
      setComment("");
      console.log("Order submitted successfully:", res);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {/* Detail view of the item */}
      {detailViewMenuItem ? (
        <div style={{}}>
          <Modal
            show={detailViewMenuItem !== null}
            onHide={() => setDetailViewMenuItem(null)}
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

              {/* <p>
                <strong>Price:</strong> ${detailViewMenuItem?.price}
              </p> */}
            </Modal.Body>
            <Modal.Footer contentClassName={Style.darkModalFooter}>
              <Button variant="secondary" onClick={() => setDetailViewMenuItem(null)}>
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
        </div>
      ) : null}
      <DashboardLayout>
        <Container fluid>
          {/* Menu */}
          <Row>
            <Col>
              <h1>Menu</h1>
              {/* <div style={{ minHeight: "72px" }}>
                {choosenCategory != null && (
                  <>
                    <Button
                      style={{
                        background: "#2A2A3A",
                        borderColor: "#2A2A3A",
                        color: "#CCC",
                      }}
                      size="lg"
                      onClick={() => goBack()}
                    >
                      Back
                    </Button>
                    <br />
                    <br />
                  </>
                )} */}
              {/* </div> */}
              {/* category item display */}

              {loading ? (
                <Spinner animation="border" />
              ) : (
                <div className="d-flex flex-column gap-4">
                  {categories.map((cat) => (
                    <div key={cat._id}>
                      <b>
                        <h2 className="text-center" style={{ color: "#CCC" }}>
                          {cat.name}
                        </h2>
                      </b>
                      <div className="d-flex flex-wrap gap-2">
                        {groupedMenuItems[cat._id]?.map((item) => (
                          <div
                            key={item._id}
                            onClick={() => !item.isDisabled && viewSpecificItem(item._id)}
                            style={{
                              background: item.isDisabled ? "#444" : "#2A2A3A",
                              border: "1px solid #444",
                              color: item.isDisabled ? "#888" : "#CCC",
                              flex: "1 1 250px",
                              padding: "1rem",
                              borderRadius: "0.5rem",
                              cursor: item.isDisabled ? "not-allowed" : "pointer",
                              textAlign: "left",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              gap: "0.5rem",
                              width: "33%",
                              minWidth: "100px",
                              maxWidth: "300px",
                              opacity: item.isDisabled ? 0.5 : 1,
                              pointerEvents: item.isDisabled ? "none" : "auto",
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                borderRadius: "0.5rem",
                                width: "100%",
                                height: "auto",
                                aspectRatio: "4 / 3",
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
            </Col>
            {/* </Row> */}
            {/* Cart */}
            {/* <Row> */}
            <Col md={4}>
              <div
                style={{
                  background: "#1f1f2a",
                  padding: "1rem",
                  borderRadius: "8px",
                  color: "#CCC",
                }}
              >
                <h3>Cart</h3>
                {cartItems.length === 0 ? (
                  <p>No items in cart.</p>
                ) : (
                  <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                    {cartItems.map((entry, idx) => {
                      const item = entry.item;
                      const variant = item.variations.find((v) => v._id === entry.variant);
                      return (
                        <li key={idx} style={{ marginBottom: "1rem" }}>
                          <strong>{item.name}</strong>
                          <br />
                          Variant: {variant?.name || "N/A"}
                          <br />
                          Quantity: {entry.quantity}
                          <br />
                          Price: ${(variant?.price * entry.quantity).toFixed(2) || "0.00"}
                          <br />
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => removeItemFromCart(idx)}
                            style={{ marginTop: "0.5rem" }}
                          >
                            Remove
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <b>
                  <h5>Subtotal: ${subtotal.toFixed(2)}</h5>

                  <h5>Tax (13%): ${tax.toFixed(2)}</h5>
                  <h5>Total: ${total.toFixed(2)}</h5>
                </b>
                <Form.Control
                  onChange={(e) => setComment(e.target.value)}
                  type="text"
                  value={comment}
                  placeholder="Comments"
                />
                <Button
                  variant="success"
                  onClick={() => submitOrder(cartItems)}
                  disabled={cartItems.length === 0}
                  style={{ marginTop: "1rem" }}
                >
                  Submit
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </DashboardLayout>
    </>
  );
}
