"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const H = {
  Authorization: `Bearer ${
    process.env.NEXT_PUBLIC_ADMIN_TOKEN || "change-me-secret-token"
  }`,
};

export default function InvoiceViewPage() {
  const params = useParams();
  const id = params?.id;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`, { headers: H })
      .then((r) => r.json())
      .then(setOrder);
  }, [id]);

  if (!order) return <main style={{ padding: 24 }}>Loading...</main>;

  return (
    <main style={{ padding: 24 }}>
      <h2>Invoice Preview</h2>
      <div style={{ margin: "12px 0" }}>
        <a
          href={`/api/orders/${order.id}/invoice`}
          onClick={async (e) => {
            e.preventDefault();
            const res = await fetch(`/api/orders/${order.id}/invoice`, {
              headers: H,
            });
            if (!res.ok) {
              let msg = `Failed to generate PDF (status ${res.status})`;
              try {
                const data = await res.json();
                if (data?.error) msg = `${msg}: ${data.error}`;
                if (data?.message) msg = `${msg} - ${data.message}`;
              } catch (_) {
              }
              alert(msg);
              return;
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice-${order.id}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
          }}
          style={{ color: "#2563eb" }}
        >
          Download PDF
        </a>
      </div>
      <div
        style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700 }}>Hearing Aid Store</div>
            <div>Invoice #{order.id}</div>
          </div>
          <div>Date: {new Date(order.order_date).toLocaleDateString()}</div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div>
            <strong>Bill To:</strong> {order.customer?.first_name}{" "}
            {order.customer?.last_name}
          </div>
          <div>
            {order.customer?.email} · {order.customer?.phone}
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #e5e7eb",
                    padding: 8,
                  }}
                >
                  Item
                </th>
                <th
                  style={{
                    textAlign: "right",
                    borderBottom: "1px solid #e5e7eb",
                    padding: 8,
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    textAlign: "right",
                    borderBottom: "1px solid #e5e7eb",
                    padding: 8,
                  }}
                >
                  Unit
                </th>
                <th
                  style={{
                    textAlign: "right",
                    borderBottom: "1px solid #e5e7eb",
                    padding: 8,
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it, idx) => (
                <tr key={idx}>
                  <td style={{ padding: 8 }}>
                    {it.product.brand} {it.product.model} ({it.ear_side})
                  </td>
                  <td style={{ textAlign: "right", padding: 8 }}>
                    {it.quantity}
                  </td>
                  <td style={{ textAlign: "right", padding: 8 }}>
                    ₹{it.unit_price.toLocaleString("en-IN")}
                  </td>
                  <td style={{ textAlign: "right", padding: 8 }}>
                    ₹{(it.unit_price * it.quantity).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            marginTop: 12,
            display: "grid",
            gap: 4,
            justifyContent: "end",
          }}
        >
          <div>Subtotal: ₹{order.total_amount.toLocaleString("en-IN")}</div>
          <div>
            Insurance Discount: -₹
            {order.insurance_discount.toLocaleString("en-IN")}
          </div>
          <div style={{ fontWeight: 700 }}>
            Total Due: ₹{order.final_amount.toLocaleString("en-IN")}
          </div>
        </div>
      </div>
    </main>
  );
}
