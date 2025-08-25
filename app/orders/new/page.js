"use client";
import { useEffect, useMemo, useState } from "react";

const H = {
  Authorization: `Bearer ${
    process.env.NEXT_PUBLIC_ADMIN_TOKEN || "change-me-secret-token"
  }`,
};

export default function NewOrderPage() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/customers", { headers: H }).then((r) => r.json()),
      fetch("/api/hearing-aids", { headers: H }).then((r) => r.json()),
    ]).then(([c, p]) => {
      setCustomers(c);
      setProducts(p);
    });
  }, []);

  useEffect(() => {
    if (!selectedCustomerId) return;
    fetch(`/api/hearing-aids/recommend/${selectedCustomerId}`, { headers: H })
      .then((r) => r.json())
      .then(setRecommendations);
  }, [selectedCustomerId]);

  function addItem(product, ear_side = "both") {
    setItems((prev) => [
      ...prev,
      {
        hearing_aid_id: product.id,
        quantity: 1,
        unit_price: product.price,
        ear_side,
      },
    ]);
  }

  const totalAmount = useMemo(
    () => items.reduce((sum, it) => sum + it.unit_price * it.quantity, 0),
    [items]
  );

  function createOrder(e) {
    e.preventDefault();
    if (!selectedCustomerId || items.length === 0) return;
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...H },
      body: JSON.stringify({
        customer_id: Number(selectedCustomerId),
        order_date: new Date().toISOString(),
        status: "ordered",
        total_amount: totalAmount,
        delivery_date: deliveryDate || null,
        tracking_number: "",
        notes,
        items,
      }),
    })
      .then((r) => r.json())
      .then((o) => {
        window.location.href = `/orders/${o.id}`;
      });
  }

  const card = { border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 };
  const input = { padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 };

  return (
    <main style={{ padding: 24 }}>
      <h2>New Order</h2>
      <form
        onSubmit={createOrder}
        style={{ display: "grid", gap: 16, marginTop: 12 }}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            style={input}
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            style={input}
          />
        </div>

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ ...input, minHeight: 80 }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: 12,
          }}
        >
          {recommendations.map((p) => (
            <div key={p.id} style={card}>
              <div style={{ fontWeight: 600 }}>
                {p.brand} {p.model}
              </div>
              <div>Type: {p.type}</div>
              <div>Price: ₹{p.price.toLocaleString("en-IN")}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => addItem(p, "left")}
                  style={{ padding: 8, borderRadius: 6 }}
                >
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => addItem(p, "right")}
                  style={{ padding: 8, borderRadius: 6 }}
                >
                  Right
                </button>
                <button
                  type="button"
                  onClick={() => addItem(p, "both")}
                  style={{ padding: 8, borderRadius: 6 }}
                >
                  Both
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={card}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Order Items</div>
          {items.length === 0 ? (
            <div style={{ color: "#6b7280" }}>No items added yet.</div>
          ) : (
            items.map((it, idx) => {
              const prod = products.find((p) => p.id === it.hearing_aid_id);
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    {prod?.brand} {prod?.model} ({it.ear_side})
                  </div>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((x, i) =>
                            i === idx
                              ? { ...x, quantity: Number(e.target.value) }
                              : x
                          )
                        )
                      }
                      style={{ width: 64, ...input }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setItems((prev) => prev.filter((_, i) => i !== idx))
                      }
                      style={{ padding: 8, borderRadius: 6 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
          <div style={{ marginTop: 8, fontWeight: 600 }}>
            Total: ₹{totalAmount.toLocaleString("en-IN")}
          </div>
        </div>

        <button
          type="submit"
          style={{
            padding: 12,
            borderRadius: 8,
            background: "#111827",
            color: "white",
          }}
        >
          Create Order
        </button>
      </form>
    </main>
  );
}
