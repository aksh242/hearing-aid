"use client";
import { useEffect, useState } from "react";

const H = {
  Authorization: `Bearer ${
    process.env.NEXT_PUBLIC_ADMIN_TOKEN || "change-me-secret-token"
  }`,
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    customer_id: "",
    order_id: "",
    appointment_type: "consultation",
    scheduled_date: "",
    status: "scheduled",
    notes: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/appointments", { headers: H }).then((r) => r.json()),
      fetch("/api/customers", { headers: H }).then((r) => r.json()),
      fetch("/api/orders", { headers: H }).then((r) => r.json()),
    ]).then(([a, c, o]) => {
      setAppointments(a);
      setCustomers(c);
      setOrders(o);
    });
  }, []);

  function createAppointment(e) {
    e.preventDefault();
    fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...H },
      body: JSON.stringify({
        ...form,
        customer_id: Number(form.customer_id),
        order_id: form.order_id ? Number(form.order_id) : null,
      }),
    })
      .then((r) => r.json())
      .then((a) => setAppointments((prev) => [a, ...prev]));
  }

  const input = { padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 };

  return (
    <main style={{ padding: 24 }}>
      <h2>Appointments</h2>
      <form
        onSubmit={createAppointment}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginTop: 12,
        }}
      >
        <select
          value={form.customer_id}
          onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
          style={input}
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.first_name} {c.last_name}
            </option>
          ))}
        </select>
        <select
          value={form.order_id}
          onChange={(e) => setForm({ ...form, order_id: e.target.value })}
          style={input}
        >
          <option value="">(optional) Related Order</option>
          {orders.map((o) => (
            <option key={o.id} value={o.id}>
              Order #{o.id}
            </option>
          ))}
        </select>
        <select
          value={form.appointment_type}
          onChange={(e) =>
            setForm({ ...form, appointment_type: e.target.value })
          }
          style={input}
        >
          <option value="consultation">consultation</option>
          <option value="delivery">delivery</option>
          <option value="fitting">fitting</option>
        </select>
        <input
          type="datetime-local"
          value={form.scheduled_date}
          onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
          style={input}
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          style={input}
        >
          <option value="scheduled">scheduled</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
        </select>
        <input
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          style={input}
        />
        <button
          type="submit"
          style={{
            padding: 10,
            borderRadius: 6,
            background: "#111827",
            color: "white",
          }}
        >
          Add
        </button>
      </form>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 12,
        }}
      >
        {appointments.map((a) => (
          <div
            key={a.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {a.appointment_type} ·{" "}
              {new Date(a.scheduled_date).toLocaleString()}
            </div>
            <div style={{ color: "#6b7280" }}>
              Customer #{a.customer_id}{" "}
              {a.order_id ? `· Order #${a.order_id}` : ""}
            </div>
            <div>Status: {a.status}</div>
            <div>{a.notes}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
