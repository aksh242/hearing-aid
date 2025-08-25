import { NextResponse } from "next/server";
import { appointments, customers, findOrder, generateId } from "@/lib/store";

export async function GET() {
  return NextResponse.json(appointments);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const required = ["customer_id", "appointment_type", "scheduled_date"];
    for (const k of required) {
      if (!body[k])
        return NextResponse.json(
          { error: `Missing field: ${k}` },
          { status: 400 }
        );
    }
    const customer = customers.find((c) => c.id === Number(body.customer_id));
    if (!customer)
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    if (body.order_id) {
      const order = findOrder(Number(body.order_id));
      if (!order)
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const a = {
      id: generateId("appointment"),
      customer_id: Number(body.customer_id),
      order_id: body.order_id ? Number(body.order_id) : null,
      appointment_type: String(body.appointment_type),
      scheduled_date: String(body.scheduled_date),
      status: body.status ? String(body.status) : "scheduled",
      notes: body.notes ? String(body.notes) : "",
    };
    appointments.unshift(a);
    return NextResponse.json(a, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
