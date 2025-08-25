import { NextResponse } from "next/server";
import { customers, generateId } from "@/lib/store";

export async function GET() {
  return NextResponse.json(customers);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const required = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "hearing_loss_level",
      "budget_range",
    ];
    for (const k of required) {
      if (body[k] === undefined || body[k] === null || body[k] === "") {
        return NextResponse.json(
          { error: `Missing field: ${k}` },
          { status: 400 }
        );
      }
    }
    const created = {
      id: generateId("customer"),
      first_name: String(body.first_name),
      last_name: String(body.last_name),
      email: String(body.email),
      phone: String(body.phone),
      address: body.address ? String(body.address) : "",
      hearing_loss_level: body.hearing_loss_level,
      budget_range: Number(body.budget_range),
      has_insurance: Boolean(body.has_insurance),
      created_at: new Date().toISOString(),
    };
    customers.unshift(created);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
