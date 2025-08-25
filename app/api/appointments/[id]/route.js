import { NextResponse } from "next/server";
import { appointments } from "@/lib/store";

export async function PUT(request, { params }) {
  const id = Number(params.id);
  const idx = appointments.findIndex((a) => a.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = await request.json();
    appointments[idx] = { ...appointments[idx], ...body };
    return NextResponse.json(appointments[idx]);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
