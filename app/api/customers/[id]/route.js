import { NextResponse } from "next/server";
import { customers } from "@/lib/store";

export async function GET(_req, { params }) {
  const id = Number(params.id);
  const c = customers.find((x) => x.id === id);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(c);
}

export async function PUT(request, { params }) {
  const id = Number(params.id);
  const idx = customers.findIndex((x) => x.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = await request.json();
    customers[idx] = { ...customers[idx], ...body };
    return NextResponse.json(customers[idx]);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
