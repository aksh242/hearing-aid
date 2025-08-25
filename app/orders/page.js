"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const headers = {
  Authorization: `Bearer ${
    process.env.NEXT_PUBLIC_ADMIN_TOKEN || "change-me-secret-token"
  }`,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders", { headers })
      .then((r) => r.json())
      .then(setOrders);
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Orders</h2>
        <Link href="/orders/new" style={{ color: "#2563eb" }}>
          New Order
        </Link>
      </div>
      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 12,
        }}
      >
        {orders.map((o) => (
          <div
            key={o.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 600 }}>Order #{o.id}</div>
            <div style={{ color: "#6b7280" }}>Status: {o.status}</div>
            <div>Total: ₹{o.final_amount?.toLocaleString("en-IN")}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <Link href={`/orders/${o.id}`} style={{ color: "#2563eb" }}>
                Details
              </Link>
              <Link
                href={`/orders/${o.id}/invoice`}
                style={{ color: "#2563eb" }}
              >
                Invoice
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
