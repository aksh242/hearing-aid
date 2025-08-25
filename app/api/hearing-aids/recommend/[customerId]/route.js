import { NextResponse } from "next/server";
import { customers, hearing_aids } from "@/lib/store";

export async function GET(_req, { params }) {
  const customerId = Number(params.customerId);
  const customer = customers.find((c) => c.id === customerId);
  if (!customer)
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  const recommended = hearing_aids
    .filter(
      (aid) =>
        aid.suitable_for_loss_levels.includes(customer.hearing_loss_level) &&
        aid.price <= customer.budget_range
    )
    .sort((a, b) => b.rating - a.rating);
  return NextResponse.json(recommended);
}
