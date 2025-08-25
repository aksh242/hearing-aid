import { NextResponse } from "next/server";
import {
  appointments,
  customers,
  findCustomer,
  generateId,
  hearing_aids,
  orders,
} from "@/lib/store";
import { calculateDiscount } from "@/lib/utils";

export async function GET() {
  return NextResponse.json(orders);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const required = ["customer_id", "items"];
    for (const k of required) {
      if (
        body[k] === undefined ||
        body[k] === null ||
        (Array.isArray(body[k]) && body[k].length === 0)
      ) {
        return NextResponse.json(
          { error: `Missing field: ${k}` },
          { status: 400 }
        );
      }
    }

    const customer = findCustomer(body.customer_id);
    if (!customer)
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );

    const items = body.items.map((it) => {
      const product = hearing_aids.find(
        (p) => p.id === Number(it.hearing_aid_id)
      );
      if (!product) throw new Error("Invalid hearing_aid_id");
      return {
        hearing_aid_id: product.id,
        quantity: Math.max(1, Number(it.quantity || 1)),
        unit_price: Number(it.unit_price ?? product.price),
        ear_side: it.ear_side || "both",
        product,
      };
    });

    const total_amount = items.reduce(
      (sum, it) => sum + it.unit_price * it.quantity,
      0
    );
    const insurance_discount = calculateDiscount(customer, total_amount);
    const final_amount = total_amount - insurance_discount;

    const order = {
      id: generateId("order"),
      customer_id: customer.id,
      order_date: body.order_date || new Date().toISOString(),
      status: body.status || "ordered",
      total_amount,
      insurance_discount,
      final_amount,
      delivery_date: body.delivery_date || null,
      tracking_number: body.tracking_number || "",
      notes: body.notes || "",
      items,
      customer,
    };
    orders.unshift(order);

    if (order.status === "delivered") {
      appointments.unshift({
        id: generateId("appointment"),
        customer_id: customer.id,
        order_id: order.id,
        appointment_type: "fitting",
        scheduled_date: new Date(
          Date.now() + 3 * 24 * 3600 * 1000
        ).toISOString(),
        status: "scheduled",
        notes: "Auto scheduled after delivery",
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Invalid JSON" },
      { status: 400 }
    );
  }
}
