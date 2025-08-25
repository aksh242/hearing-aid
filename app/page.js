import Link from "next/link";

export default function HomePage() {
  const card = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  };
  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
    gap: "16px",
  };
  const link = { color: "#2563eb", textDecoration: "none" };

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Orders overview, recent customers, and quick links.
      </p>
      <div style={grid}>
        <div style={card}>
          <h3>Customers</h3>
          <p>Manage customers</p>
          <Link href="/customers" style={link}>
            Go to Customers
          </Link>
        </div>
        <div style={card}>
          <h3>Orders</h3>
          <p>Track and update orders</p>
          <Link href="/orders" style={link}>
            Go to Orders
          </Link>
        </div>
        <div style={card}>
          <h3>New Order</h3>
          <p>Create an order with recommendations</p>
          <Link href="/orders/new" style={link}>
            Create Order
          </Link>
        </div>
        <div style={card}>
          <h3>Appointments</h3>
          <p>Schedule fittings and deliveries</p>
          <Link href="/appointments" style={link}>
            Manage Appointments
          </Link>
        </div>
      </div>
    </main>
  );
}
