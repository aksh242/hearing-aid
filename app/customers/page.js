"use client";
import { useEffect, useMemo, useState } from "react";

const apiHeaders = () => ({
  Authorization: `Bearer ${
    process.env.NEXT_PUBLIC_ADMIN_TOKEN || "change-me-secret-token"
  }`,
});

export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    hearing_loss_level: "mild",
    budget_range: 30000,
    has_insurance: false,
  });

  useEffect(() => {
    fetch("/api/customers", { headers: apiHeaders() })
      .then((r) => r.json())
      .then(setCustomers)
      .catch(() => setCustomers([]));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return customers.filter(
      (c) =>
        c.first_name.toLowerCase().includes(q) ||
        c.last_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
    );
  }, [query, customers]);

  function handleSubmit(e) {
    e.preventDefault();
    fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...apiHeaders() },
      body: JSON.stringify(form),
    })
      .then((r) => r.json())
      .then((created) => setCustomers((prev) => [created, ...prev]));
  }

  const input = { padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 };

  return (
    <main style={{ padding: 24 }}>
      <h2>Customers</h2>
      <div style={{ display: "flex", gap: 12, margin: "12px 0" }}>
        <input
          placeholder="Search customers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ ...input, flex: 1 }}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          required
          placeholder="First name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          style={input}
        />
        <input
          required
          placeholder="Last name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          style={input}
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={input}
        />
        <input
          required
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          style={input}
        />
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          style={input}
        />
        <select
          value={form.hearing_loss_level}
          onChange={(e) =>
            setForm({ ...form, hearing_loss_level: e.target.value })
          }
          style={input}
        >
          <option value="mild">mild</option>
          <option value="moderate">moderate</option>
          <option value="severe">severe</option>
        </select>
        <input
          type="number"
          placeholder="Budget (INR)"
          value={form.budget_range}
          onChange={(e) =>
            setForm({ ...form, budget_range: Number(e.target.value) })
          }
          style={input}
        />
        <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={form.has_insurance}
            onChange={(e) =>
              setForm({ ...form, has_insurance: e.target.checked })
            }
          />{" "}
          Has Insurance
        </label>
        <button
          type="submit"
          style={{
            padding: 10,
            borderRadius: 6,
            background: "#111827",
            color: "white",
          }}
        >
          Add Customer
        </button>
      </form>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 12,
        }}
      >
        {filtered.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {c.first_name} {c.last_name}
            </div>
            <div style={{ color: "#6b7280" }}>
              {c.email} · {c.phone}
            </div>
            <div>
              Loss: {c.hearing_loss_level} · Budget: ₹
              {c.budget_range.toLocaleString("en-IN")}
            </div>
            <div>Insurance: {c.has_insurance ? "Yes" : "No"}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
