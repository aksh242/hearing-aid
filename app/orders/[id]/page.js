"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const H = {
  Authorization: `Bearer ${
    process.env.NEXT_PUBLIC_ADMIN_TOKEN || "change-me-secret-token"
  }`,
};

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("ordered");
  const [tracking, setTracking] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`, { headers: H })
      .then((r) => r.json())
      .then((o) => {
        setOrder(o);
        setStatus(o.status);
        setTracking(o.tracking_number || "");
      });
  }, [id]);

  function updateStatus() {
    fetch(`/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...H },
      body: JSON.stringify({ status, tracking_number: tracking }),
    })
      .then((r) => r.json())
      .then(setOrder);
  }

  if (!order) return <main style={{ padding: 24 }}>Loading...</main>;

  return (
    <main style={{ padding: 24 }}>
      <h2>Order #{order.id}</h2>
      <div>Status Timeline: ordered → shipped → delivered → fitted</div>
      <div style={{ display: "flex", gap: 12, margin: "12px 0" }}>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 }}
        >
          <option value="ordered">ordered</option>
          <option value="shipped">shipped</option>
          <option value="delivered">delivered</option>
          <option value="fitted">fitted</option>
        </select>
        <input
          placeholder="Tracking number"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 }}
        />
        <button
          onClick={updateStatus}
          style={{
            padding: 10,
            borderRadius: 6,
            background: "#111827",
            color: "white",
          }}
        >
          Update
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <div>
          <strong>Customer:</strong> {order.customer?.first_name}{" "}
          {order.customer?.last_name}
        </div>
        <div>
          <strong>Total:</strong> ₹{order.final_amount?.toLocaleString("en-IN")}{" "}
          (discount: ₹{order.insurance_discount?.toLocaleString("en-IN")})
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
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
              } catch (_){
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
          Download Invoice (PDF)
        </a>
      </div>
    </main>
  );
}
