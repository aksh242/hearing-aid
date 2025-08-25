import { NextResponse } from "next/server";
import { findOrder } from "@/lib/store";
import { formatINR } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const id = Number(params.id);
  const order = findOrder(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const { default: PDFDocument } = await import("pdfkit");
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    const chunks = [];
    const pdfBufferPromise = new Promise((resolve, reject) => {
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });

    doc.fontSize(18).text("Hearing Aid Store", { align: "right" });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice #${order.id}`);
    doc.text(`Date: ${new Date(order.order_date).toLocaleDateString()}`);
    doc.moveDown();
    doc.text(
      `Bill To: ${order.customer.first_name} ${order.customer.last_name}`
    );
    doc.text(`${order.customer.email} | ${order.customer.phone}`);
    doc.moveDown();

    doc.text("Items:");
    doc.moveDown(0.5);
    order.items.forEach((it) => {
      doc.text(
        `${it.product.brand} ${it.product.model} (${it.ear_side}) x${
          it.quantity
        } - ${formatINR(it.unit_price)} = ${formatINR(
          it.unit_price * it.quantity
        )}`
      );
    });

    doc.moveDown();
    doc.text(`Subtotal: ${formatINR(order.total_amount)}`);
    doc.text(`Insurance Discount: -${formatINR(order.insurance_discount)}`);
    doc
      .font("Helvetica-Bold")
      .text(`Total Due: ${formatINR(order.final_amount)}`);
    doc.font("Helvetica");
    doc.end();

    const pdfBuffer = await pdfBufferPromise;

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order.id}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "PDF generation failed", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}
