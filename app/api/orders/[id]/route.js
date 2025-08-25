import { NextResponse } from "next/server";
import { findOrder, orders } from "@/lib/store";

export async function GET(_req, { params }) {
  const id = Number(params.id);
  const order = findOrder(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}
