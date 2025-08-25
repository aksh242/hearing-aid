import { NextResponse } from "next/server";
import { hearing_aids } from "@/lib/store";

export async function GET() {
  return NextResponse.json(hearing_aids);
}
