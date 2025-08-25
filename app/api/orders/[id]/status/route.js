import { NextResponse } from "next/server";
import { findOrder } from "@/lib/store";

export async function PUT(request, { params }) {
  const id = Number(params.id);
  const order = findOrder(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = await request.json();
    const allowedStatuses = ["ordered", "shipped", "delivered", "fitted"];
    if (body.status && !allowedStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    if (body.status) order.status = body.status;
    if (body.tracking_number !== undefined)
      order.tracking_number = String(body.tracking_number);
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
