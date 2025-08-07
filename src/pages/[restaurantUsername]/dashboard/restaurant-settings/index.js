import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAtomValue } from "jotai";
import { userAtom } from "@/store/atoms";
import { apiFetch } from "@/lib/api";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { FiEdit2, FiHash, FiHome, FiMapPin } from "react-icons/fi";

export default function RestaurantSettings() {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const isManager = user?.role === "manager";

  const [form, setForm] = useState({ name: "", username: "", location: "", taxRatePercent: 13 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false); // 👈 Toggle for edit mode

  useEffect(() => {
    if (!user?.restaurantId) return;

    async function fetchSettings() {
      setLoading(true);
      try {
        const res = await apiFetch(`/restaurant/${user.restaurantId}`);
        if (res.restaurant) {
          setForm({
            name: res.restaurant.name || "",
            username: res.restaurant.username || "",
            location: res.restaurant.location || "",
            taxRatePercent: res.restaurant.taxRatePercent || 13,
          });
        }
      } catch (err) {
        console.error("Failed to fetch restaurant settings", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurant/${user.restaurantId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update");
      toast.success("✅ Restaurant profile updated");
      setEditing(false); // Exit edit mode after saving
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <ManagerOnly>
        <h1>Restaurant Settings</h1>
        {loading ? (
          <p>Loading settings...</p>
        ) : (
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
              {!editing ? (
                <>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="d-flex align-items-center gap-2">
                        <FiHome /> {form.name}
                      </h5>
                      <p>
                        <FiHash /> <strong>Username:</strong> {form.username}
                      </p>
                      <p>
                        <FiMapPin /> <strong>Location:</strong> {form.location || "—"}
                      </p>
                      <p>
                        <strong>% Tax Rate:</strong> {form.taxRatePercent ?? "—"}%
                      </p>
                    </div>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => setEditing(true)}
                      title="Edit Restaurant Info"
                    >
                      <FiEdit2 />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="d-flex justify-content-between align-items-start">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formName">
                      <Form.Label>Restaurant Name</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formUsername">
                      <Form.Label>Restaurant Username</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formLocation">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formTaxRate">
                      <Form.Label>Tax Rate</Form.Label>
                      <Form.Control
                        type="number"
                        name="taxRatePercent"
                        value={form.taxRatePercent}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="d-flex gap-2">
                      <Button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditing(false)}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </div>
              )}
            </div>
          </div>
        )}
      </ManagerOnly>
    </DashboardLayout>
  );
}
